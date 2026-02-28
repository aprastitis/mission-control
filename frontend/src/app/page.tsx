"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm";
import Sidebar from "../components/Sidebar";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="h-screen relative flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} filters={{priority: [], labels: [], dueDateRange: {start: '', end: ''}}} onFiltersChange={() => {}} />
      <div className="flex-1">
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
      <motion.div
        className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Backlog Column */}
        <motion.div
          data-testid="column-backlog"
          className={`h-full rounded-3xl p-6 bg-neu-glass dark:bg-neu-glass-dark shadow-neu-convex dark:shadow-neu-convex-dark border border-slate-200/50 dark:border-slate-700 transition-all ${
            draggingOver === 'backlog' ? 'shadow-neu-pressed dark:shadow-neu-pressed-dark scale-105' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('backlog')}
          onDragEnter={handleDragEnter('backlog')}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-responsive-xl font-bold">📋 Backlog</h4>
            <motion.button
              data-testid="add-task"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-responsive-sm rounded-xl shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ➕ Add Task
            </motion.button>
          </div>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'backlog').length === 0 ? (
              <div className="text-center text-responsive-base text-gray-500 dark:text-gray-400 py-8">No tasks in backlog</div>
            ) : (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {tasks.filter(task => task.status === 'backlog').map(task => (
                  <motion.div
                    key={task.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TaskCard
                      task={task}
                      onDelete={removeTask}
                      onEdit={editTask}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* In Progress Column */}
        <motion.div
          data-testid="column-inprogress"
          className={`h-full rounded-3xl p-6 bg-neu-glass dark:bg-neu-glass-dark shadow-neu-convex dark:shadow-neu-convex-dark border border-slate-200/50 dark:border-slate-700 transition-all ${
            draggingOver === 'inprogress' ? 'shadow-neu-pressed dark:shadow-neu-pressed-dark scale-105' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('inprogress')}
          onDragEnter={handleDragEnter('inprogress')}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="text-responsive-xl font-bold mb-6">🚀 In Progress</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'inprogress').length === 0 ? (
              <div className="text-center text-responsive-base text-gray-500 dark:text-gray-400 py-8">No tasks in progress</div>
            ) : (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {tasks.filter(task => task.status === 'inprogress').map(task => (
                  <motion.div
                    key={task.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TaskCard
                      task={task}
                      onDelete={removeTask}
                      onEdit={editTask}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Need Approval Column */}
        <motion.div
          data-testid="column-needapproval"
          className={`h-full rounded-3xl p-6 bg-neu-glass dark:bg-neu-glass-dark shadow-neu-convex dark:shadow-neu-convex-dark border border-slate-200/50 dark:border-slate-700 transition-all ${
            draggingOver === 'needapproval' ? 'shadow-neu-pressed dark:shadow-neu-pressed-dark scale-105' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('needapproval')}
          onDragEnter={handleDragEnter('needapproval')}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="text-responsive-xl font-bold mb-6">⏳ Need Approval</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'needapproval').length === 0 ? (
              <div className="text-center text-responsive-base text-gray-500 dark:text-gray-400 py-8">No tasks need approval</div>
            ) : (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {tasks.filter(task => task.status === 'needapproval').map(task => (
                  <motion.div
                    key={task.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TaskCard
                      task={task}
                      onDelete={removeTask}
                      onEdit={editTask}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Done Column */}
        <motion.div
          data-testid="column-done"
          className={`h-full rounded-3xl p-6 bg-neu-glass dark:bg-neu-glass-dark shadow-neu-convex dark:shadow-neu-convex-dark border border-slate-200/50 dark:border-slate-700 transition-all ${
            draggingOver === 'done' ? 'shadow-neu-pressed dark:shadow-neu-pressed-dark scale-105' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop('done')}
          onDragEnter={handleDragEnter('done')}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="text-responsive-xl font-bold mb-6">✅ Done</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            {tasks.filter(task => task.status === 'done').length === 0 ? (
              <div className="text-center text-responsive-base text-gray-500 dark:text-gray-400 py-8">No completed tasks</div>
            ) : (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {tasks.filter(task => task.status === 'done').map(task => (
                  <motion.div
                    key={task.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TaskCard
                      task={task}
                      onDelete={removeTask}
                      onEdit={editTask}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <CreateTaskForm
          onSubmit={handleCreateTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      </div>
    </div>
  );
}