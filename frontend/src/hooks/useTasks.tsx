import { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, Task } from '../api/tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const task = await createTask(newTask);
      setTasks(prev => [...prev, task]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const editTask = async (id: number, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const removeTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  return { tasks, loading, error, addTask, editTask, removeTask, loadTasks };
};