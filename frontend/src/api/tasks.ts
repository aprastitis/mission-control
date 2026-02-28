const API_BASE = 'http://100.117.111.36:8000/api/v1/tasks';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'backlog' | 'inprogress' | 'needapproval' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  labels: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const updateTask = async (id: number, task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Promise<Task> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
};