# Инструкция по настройке базы данных в Supabase

Эта инструкция поможет вам правильно настроить базу данных для чат-приложения в Supabase.

## Вариант 1: Пошаговое выполнение запросов (рекомендуется)

Для избежания ошибок, рекомендуется выполнять SQL-запросы пошагово:

1. Откройте панель управления Supabase
2. Перейдите в раздел "SQL Editor"
3. Создайте новый запрос
4. Откройте файл `setup-step-by-step.sql`
5. Копируйте и выполняйте запросы **по одному**, в указанном порядке

Если при выполнении какого-то запроса возникает ошибка (например, "relation already exists"), просто пропустите этот шаг и переходите к следующему.

## Вариант 2: Пересоздание всех таблиц сразу

Если вы хотите выполнить все запросы сразу:

1. Откройте панель управления Supabase
2. Перейдите в раздел "SQL Editor"
3. Создайте новый запрос
4. Вставьте содержимое файла `recreate-users-table.sql`
5. Выполните запрос

> **Внимание**: Этот скрипт удалит существующие таблицы `users`, `messages` и `chat_participants`, если они уже существуют. Если у вас есть важные данные в этих таблицах, сделайте их резервную копию перед выполнением.

## Проверка результатов

После выполнения скрипта:

1. Перейдите в раздел "Table Editor"
2. Проверьте, что созданы следующие таблицы:
   - `users` (с полем `id` типа UUID)
   - `chats`
   - `chat_participants`
   - `messages`
3. Проверьте, что в таблице `users` появились пользователи, которых вы создали через Authentication

## Решение распространенных ошибок

### Ошибка: "relation already exists"

Эта ошибка возникает, когда таблица, которую вы пытаетесь создать, уже существует. Решения:

1. **Пошаговое выполнение**: Используйте файл `setup-step-by-step.sql` и выполняйте запросы по одному. Если возникает ошибка, просто пропустите этот шаг.

2. **Удаление существующих таблиц**: Выполните следующие запросы перед созданием новых таблиц:
   ```sql
   DROP TABLE IF EXISTS messages CASCADE;
   DROP TABLE IF EXISTS chat_participants CASCADE;
   DROP TABLE IF EXISTS chats CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   ```

### Ошибка: "column id is of type integer but expression is of type uuid"

Эта ошибка возникает из-за несоответствия типов данных. Решение:
- Пересоздайте таблицу `users` с правильным типом данных для поля `id` (UUID), используя шаги из файла `setup-step-by-step.sql`.

### Если пользователи не появляются в таблице `users`

Выполните следующий запрос для ручного копирования пользователей:

```sql
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
```

## Настройка политик доступа для хранилища (если используется загрузка файлов)

Если ваше приложение поддерживает загрузку файлов (например, аватаров пользователей), выполните следующий скрипт для настройки политик доступа:

```sql
-- Политика для разрешения загрузки файлов в бакет "photos" авторизованным пользователям
create policy "Allow authenticated users to upload to photos bucket"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'photos');

-- Политика для разрешения чтения файлов из бакета "photos" всем пользователям
create policy "Allow public read access to photos bucket"
    on storage.objects
    for select
    to public
    using (bucket_id = 'photos');

-- Политика для разрешения обновления файлов в бакете "photos" авторизованным пользователям
create policy "Allow authenticated users to update photos"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'photos');

-- Политика для разрешения удаления файлов из бакета "photos" авторизованным пользователям
create policy "Allow authenticated users to delete photos"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'photos');
```

## Шаг 4: Проверка работы триггера при создании новых пользователей

Чтобы убедиться, что триггер работает правильно:

1. Создайте нового пользователя через Authentication
2. Проверьте, что пользователь автоматически появился в таблице `users`

## Дополнительно: Что делать, если возникают ошибки

### Если пользователи не появляются в таблице `users`

Выполните следующий запрос для ручного копирования пользователей:

```sql
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
```

### Если триггер не создается или не работает

Выполните следующий запрос для создания триггера:

```sql
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

-- Удаляем старый триггер, если он существует
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Создаем триггер заново
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
``` 