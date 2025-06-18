-- Этот файл содержит пошаговые SQL-запросы для настройки базы данных
-- Выполняйте их по одному, чтобы избежать ошибок

-- ШАГ 1: Удаляем таблицы, зависящие от users
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_participants CASCADE;

-- ШАГ 2: Удаляем таблицу users
DROP TABLE IF EXISTS users CASCADE;

-- ШАГ 3: Создаем таблицу users с правильным типом id (UUID)
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

-- ШАГ 4: Удаляем таблицу chats, если она существует
DROP TABLE IF EXISTS chats CASCADE;

-- ШАГ 5: Создаем таблицу чатов
CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ШАГ 6: Создаем функцию для триггера обновления времени
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- ШАГ 7: Создаем триггер для обновления времени
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ШАГ 8: Создаем таблицу участников чатов
CREATE TABLE chat_participants (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  chat_id INTEGER NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- ШАГ 9: Создаем таблицу сообщений
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  chat_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- ШАГ 10: Копируем существующих пользователей из auth.users в public.users
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

-- ШАГ 11: Создаем функцию для триггера добавления новых пользователей
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

-- ШАГ 12: Удаляем старый триггер, если он существует
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ШАГ 13: Создаем триггер заново
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 