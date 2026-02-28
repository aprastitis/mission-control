"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm";
import { useTasks } from "../hooks/useTasks";

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);
  const { tasks, addTask, editTask, removeTask, loading, error } = useTasks();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateTask = async (newTask: { title: string; description: string }) => {
    await addTask({
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
    });
    setIsModalOpen(false);
  };

  const handleDrop = (targetStatus: Task['status']) => async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text'));
    await editTask(taskId, { status: targetStatus });
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
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
        {/* To Do Column */}
        <div
          data-testid="column-todo"
          className={`h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6 transition-all ${
            draggingOver === 'todo' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('todo')}
          onDragEnter={handleDragEnter('todo')}
          onDragLeave={handleDragLeave}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">To Do</h4>
            <button
              data-testid="add-task"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              + Add Task
            </button>
          </div>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'todo').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                onDelete={removeTask}
              />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div
          data-testid="column-inprogress"
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
            {tasks.filter(task => task.status === 'inprogress').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                onDelete={removeTask}
              />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div
          data-testid="column-done"
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
            {tasks.filter(task => task.status === 'done').map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                onDelete={removeTask}
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