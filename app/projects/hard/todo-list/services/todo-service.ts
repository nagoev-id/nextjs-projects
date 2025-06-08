import { supabase } from '../utils/supabase';

export type Todo = {
  id?: string;
  title: string;
  description: string;
  category: string;
  date: Date | string;
  color: string;
  completed: boolean;
  user_id?: string;
  created_at?: string;
};

export type Todos = Todo[];

export const TodoService = {
  async createTodo(todo: Omit<Todo, 'id' | 'created_at'>): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .insert({
        title: todo.title,
        description: todo.description,
        category: todo.category,
        date: new Date(todo.date).toISOString(),
        color: todo.color,
        completed: todo.completed,
        user_id: todo.user_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getTodos(userId: string): Promise<Todos> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteTodo(id: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
}; 