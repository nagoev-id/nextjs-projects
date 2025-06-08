# Todo List Application with Supabase and Redux

This is a full-stack Todo List application built with Next.js, Supabase, and Redux. It features user authentication, todo creation, filtering, and management.

## Features

- User authentication (sign up, sign in, sign out)
- Create, read, update, and delete todos
- Filter todos by category and completion status
- Responsive design
- Row Level Security for data protection

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit with RTK Query
- **Backend**: Supabase (PostgreSQL, Authentication)
- **Form Handling**: React Hook Form with Zod validation

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase account and project at [https://supabase.com](https://supabase.com)
2. In the SQL Editor, run the following SQL script to create the necessary tables and policies:

```sql
-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  color TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own todos
CREATE POLICY "Users can view their own todos" 
  ON todos 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own todos
CREATE POLICY "Users can insert their own todos" 
  ON todos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own todos
CREATE POLICY "Users can update their own todos" 
  ON todos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own todos
CREATE POLICY "Users can delete their own todos" 
  ON todos 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

3. Configure authentication in Supabase (Email/Password provider)

### 2. Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase URL and anon key from your Supabase project settings.

### 3. Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000/projects/hard/todo-list](http://localhost:3000/projects/hard/todo-list) in your browser.

## Application Structure

- `/components` - UI components
  - `/auth` - Authentication-related components
  - `/todo` - Todo-related components
- `/redux` - Redux store configuration
  - `/features` - Redux slices and RTK Query APIs
- `/utils` - Utility functions and configurations
- `/services` - API services (deprecated, now using RTK Query)

## Usage

1. Sign up for a new account or sign in with existing credentials
2. Create new todos with title, description, category, date, and color
3. Filter todos by category or completion status
4. Mark todos as completed or delete them as needed
5. Sign out when finished

## License

This project is licensed under the MIT License. 