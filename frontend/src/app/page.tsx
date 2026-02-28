"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm";

interface Task {
  id: string;
  title: string;
  description: string;
  label: string;
  column: 'backlog' | 'inprogress' | 'approval' | 'done';
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('mission-tasks');
    try {
      const loadedTasks = stored ? JSON.parse(stored) : [];
      setTasks(loadedTasks);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mission-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = (newTask: { title: string; description: string; label?: string }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      label: newTask.label || '',
      column: 'backlog',
    };
    setTasks(prev => [...prev, task]);
  };

  const handleDrop = (targetColumn: Task['column']) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, column: targetColumn } : task
    ));
    setDraggingOver(null);
  };

  const handleDragEnter = (column: string) => () => {
    setDraggingOver(column);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  if (!mounted) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen relative">
      {/* Theme toggle top-right */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setTheme("light")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          System
        </button>
      </div>

      {/* Kanban board */}
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
        {/* Backlog Column */}
        <div
          className={`h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6 transition-all ${
            draggingOver === 'backlog' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('backlog')}
          onDragEnter={handleDragEnter('backlog')}
          onDragLeave={handleDragLeave}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Backlog</h4>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              + Add Task
            </button>
          </div>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.column === 'backlog').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                label={task.label}
              />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div
          className={`h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6 transition-all ${
            draggingOver === 'inprogress' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('inprogress')}
          onDragEnter={handleDragEnter('inprogress')}
          onDragLeave={handleDragLeave}
        >
          <h4 className="font-bold mb-4">In Progress</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.column === 'inprogress').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                label={task.label}
              />
            ))}
          </div>
        </div>

        {/* Need Approval Column */}
        <div
          className={`h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6 transition-all ${
            draggingOver === 'approval' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('approval')}
          onDragEnter={handleDragEnter('approval')}
          onDragLeave={handleDragLeave}
        >
          <h4 className="font-bold mb-4">Need Approval</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.column === 'approval').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                label={task.label}
              />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div
          className={`h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6 transition-all ${
            draggingOver === 'done' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('done')}
          onDragEnter={handleDragEnter('done')}
          onDragLeave={handleDragLeave}
        >
          <h4 className="font-bold mb-4">Done</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.column === 'done').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                label={task.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <CreateTaskForm
          onSubmit={handleCreateTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}