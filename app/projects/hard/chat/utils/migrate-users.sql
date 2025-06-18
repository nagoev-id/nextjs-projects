-- Этот SQL-запрос копирует существующих пользователей из auth.users в public.users
-- Запустите его в SQL-редакторе Supabase

-- Проверяем, что таблица users существует и имеет нужную структуру
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE public.users (
      id UUID PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      phone VARCHAR(20),
      full_name VARCHAR(100) NOT NULL,
      registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL,
      is_active BOOLEAN DEFAULT TRUE
    );
  ELSE
    -- Проверяем тип столбца id и изменяем его, если это не UUID
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'id' 
      AND data_type <> 'uuid'
    ) THEN
      -- Создаем временную таблицу для сохранения данных
      CREATE TEMP TABLE temp_users AS SELECT * FROM users;
      
      -- Удаляем существующую таблицу
      DROP TABLE users CASCADE;
      
      -- Создаем таблицу заново с правильным типом id
      CREATE TABLE public.users (
        id UUID PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        phone VARCHAR(20),
        full_name VARCHAR(100) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
      
      -- Восстанавливаем данные, если это возможно
      -- Этот шаг может потребовать ручной конвертации, если есть проблемы с типами
      BEGIN
        INSERT INTO users 
        SELECT 
          id::uuid, 
          username, 
          email, 
          password_hash, 
          phone, 
          full_name, 
          registration_date, 
          last_login, 
          is_active 
        FROM temp_users;
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Не удалось восстановить данные из временной таблицы: %', SQLERRM;
      END;
      
      -- Удаляем временную таблицу
      DROP TABLE temp_users;
    END IF;
  END IF;
END $$;

-- Копируем существующих пользователей из auth.users в public.users
INSERT INTO public.users (id, username, email, password_hash, phone, full_name, registration_date, is_active)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)) as username,
  au.email,
  '' as password_hash,
  COALESCE(au.phone, '') as phone,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)) as full_name,
  au.created_at as registration_date,
  TRUE as is_active
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Проверяем, что триггер для новых пользователей существует
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    -- Создаем функцию для триггера
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    DECLARE
      username_val TEXT;
      phone_val TEXT;
      full_name_val TEXT;
    BEGIN
      -- Устанавливаем значения с обработкой NULL
      username_val := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
      phone_val := COALESCE(NEW.phone, '');
      full_name_val := COALESCE(NEW.raw_user_meta_data->>'full_name', username_val);

      -- Вставляем запись с обработкой ошибок
      BEGIN
        INSERT INTO public.users (
          id,
          username,
          email,
          password_hash,
          phone,
          full_name,
          registration_date,
          is_active
        ) VALUES (
          NEW.id,
          username_val,
          NEW.email,
          '', -- Пароль хранится в auth.users
          phone_val,
          full_name_val,
          NEW.created_at,
          TRUE
        )
        ON CONFLICT (id) DO UPDATE SET
          username = EXCLUDED.username,
          email = EXCLUDED.email,
          full_name = EXCLUDED.full_name;
      EXCEPTION WHEN OTHERS THEN
        -- Записываем ошибку в лог
        RAISE LOG 'Error creating user in public.users: %', SQLERRM;
        RETURN NEW;
      END;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Создаем триггер
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$; 