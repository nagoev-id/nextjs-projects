-- Таблица пользователей (users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Таблица чатов (chats)
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Удаляем триггер, если он существует
DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;

-- Создаем триггер заново
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Таблица участников чатов (chat_participants)
CREATE TABLE IF NOT EXISTS chat_participants (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    chat_id INTEGER NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- Таблица сообщений (messages)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    chat_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- Модифицируем таблицу users, если она уже существует
ALTER TABLE public.users 
  ALTER COLUMN phone DROP NOT NULL,
  ALTER COLUMN password_hash DROP NOT NULL;

-- Обновляем тип id в таблице users, если он не соответствует UUID
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'id' 
    AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::UUID;
  END IF;
END $$;

-- Обновляем типы в связанных таблицах, если необходимо
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'chat_participants' 
    AND column_name = 'user_id' 
    AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE chat_participants ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'user_id' 
    AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE messages ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
  END IF;
END $$;

-- Теперь создаем улучшенную функцию для триггера
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
    -- Можно решить, нужно ли прерывать транзакцию или нет
    -- RAISE EXCEPTION 'Error creating user: %', SQLERRM; -- Прервать транзакцию
    -- Или продолжить без ошибки:
    RETURN NEW;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Удаляем старый триггер, если он существует
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Создаем триггер заново
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Копируем существующих пользователей из auth.users в public.users
-- Запустите этот запрос, чтобы скопировать существующих пользователей
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

