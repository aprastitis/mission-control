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
  status: 'backlog' | 'inprogress' | 'needapproval' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  labels: string;
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

  const handleCreateTask = async (newTask: { title: string; description: string; priority?: 'low' | 'medium' | 'high'; due_date?: string; labels?: string }) => {
    await addTask({
      title: newTask.title,
      description: newTask.description,
      status: 'backlog',
      priority: newTask.priority || 'medium',
      due_date: newTask.due_date,
      labels: newTask.labels || '',
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
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
        {/* Backlog Column */}
        <div
          data-testid="column-backlog"
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
              data-testid="add-task"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              + Add Task
            </button>
          </div>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'backlog').length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks in backlog</div>
            ) : (
              tasks.filter(task => task.status === 'backlog').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={removeTask}
                  onEdit={editTask}
                />
              ))
            )}
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
            {tasks.filter(task => task.status === 'inprogress').length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks in progress</div>
            ) : (
              tasks.filter(task => task.status === 'inprogress').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={removeTask}
                  onEdit={editTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Need Approval Column */}
        <div
          data-testid="column-needapproval"
          className={`h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6 transition-all ${
            draggingOver === 'needapproval' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('needapproval')}
          onDragEnter={handleDragEnter('needapproval')}
          onDragLeave={handleDragLeave}
        >
          <h4 className="font-bold mb-4">Need Approval</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'needapproval').length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks need approval</div>
            ) : (
              tasks.filter(task => task.status === 'needapproval').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={removeTask}
                  onEdit={editTask}
                />
              ))
            )}
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
            {tasks.filter(task => task.status === 'done').length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No completed tasks</div>
            ) : (
              tasks.filter(task => task.status === 'done').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={removeTask}
                  onEdit={editTask}
                />
              ))
            )}
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