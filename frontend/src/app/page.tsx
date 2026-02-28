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
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'backlog-1', title: 'Implement user authentication', description: 'Add login/signup with email and password', label: 'Feature', column: 'backlog' },
    { id: 'backlog-2', title: 'Design dashboard layout', description: 'Create wireframes for the main dashboard', label: 'Design', column: 'backlog' },
    { id: 'backlog-3', title: 'Write API documentation', description: 'Document all endpoints with examples', label: 'Documentation', column: 'backlog' },
    { id: 'inprogress-1', title: 'Setup database schema', description: 'Define tables for users, tasks, projects', label: 'Backend', column: 'inprogress' },
    { id: 'inprogress-2', title: 'Create responsive navbar', description: 'Make navigation work on mobile', label: 'Frontend', column: 'inprogress' },
    { id: 'inprogress-3', title: 'Add drag and drop', description: 'Implement DnD for task cards', label: 'Feature', column: 'inprogress' },
    { id: 'approval-1', title: 'Review pull request #45', description: 'Code review for authentication module', label: 'Review', column: 'approval' },
    { id: 'approval-2', title: 'Approve budget for server', description: 'Check costs and approve hosting', label: 'Admin', column: 'approval' },
    { id: 'done-1', title: 'Fix login bug', description: 'Resolved issue with password reset', label: 'Bugfix', column: 'done' },
    { id: 'done-2', title: 'Update dependencies', description: 'Upgrade to latest versions', label: 'Maintenance', column: 'done' },
    { id: 'done-3', title: 'Add unit tests', description: 'Coverage for core functions', label: 'Testing', column: 'done' },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
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
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
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
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
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
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
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