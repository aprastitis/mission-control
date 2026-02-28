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
      status: 'backlog',
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-4">
        {/* Backlog Column */}
        <div
          data-testid="column-backlog"
          className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 min-h-[500px] ${
            draggingOver === 'backlog' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('backlog')}
          onDragEnter={handleDragEnter('backlog')}
          onDragLeave={handleDragLeave}
        >
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
            📋 Backlog
          </div>
          <div className="mb-4">
            <button
              data-testid="add-task"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm font-semibold rounded-2xl shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-colors"
            >
              + Add Task
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'backlog').length === 0 ? (
              <div className="text-slate-500 italic">
                No tasks? <span className="text-indigo-500 hover:text-indigo-400 cursor-pointer font-semibold" onClick={() => setIsModalOpen(true)}>Add one</span>
              </div>
            ) : (
              tasks.filter(task => task.status === 'backlog').map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  onDelete={removeTask}
                />
              ))
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div
          data-testid="column-inprogress"
          className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 min-h-[500px] ${
            draggingOver === 'inprogress' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('inprogress')}
          onDragEnter={handleDragEnter('inprogress')}
          onDragLeave={handleDragLeave}
        >
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
            🚀 In Progress
          </div>
          <div className="space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'inprogress').length === 0 ? (
              <div className="text-slate-500 italic">
                No tasks in progress.
              </div>
            ) : (
              tasks.filter(task => task.status === 'inprogress').map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  onDelete={removeTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Need Approval Column */}
        <div
          data-testid="column-needapproval"
          className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 min-h-[500px] ${
            draggingOver === 'needapproval' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('needapproval')}
          onDragEnter={handleDragEnter('needapproval')}
          onDragLeave={handleDragLeave}
        >
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
            ✅ Need Approval
          </div>
          <div className="space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'needapproval').length === 0 ? (
              <div className="text-slate-500 italic">
                No tasks awaiting approval.
              </div>
            ) : (
              tasks.filter(task => task.status === 'needapproval').map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  onDelete={removeTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Done Column */}
        <div
          data-testid="column-done"
          className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 min-h-[500px] ${
            draggingOver === 'done' ? 'bg-blue-100/50 border-blue-400 opacity-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('done')}
          onDragEnter={handleDragEnter('done')}
          onDragLeave={handleDragLeave}
        >
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
            🎉 Done
          </div>
          <div className="space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'done').length === 0 ? (
              <div className="text-slate-500 italic">
                No completed tasks yet.
              </div>
            ) : (
              tasks.filter(task => task.status === 'done').map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  onDelete={removeTask}
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