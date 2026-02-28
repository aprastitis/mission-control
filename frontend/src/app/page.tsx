"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <h4 className="font-bold mb-4">Backlog</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            <TaskCard
              id="backlog-1"
              title="Implement user authentication"
              description="Add login/signup with email and password"
              label="Feature"
            />
            <TaskCard
              id="backlog-2"
              title="Design dashboard layout"
              description="Create wireframes for the main dashboard"
              label="Design"
            />
            <TaskCard
              id="backlog-3"
              title="Write API documentation"
              description="Document all endpoints with examples"
              label="Documentation"
            />
          </div>
        </div>

        {/* In Progress Column */}
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
          <h4 className="font-bold mb-4">In Progress</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            <TaskCard
              id="inprogress-1"
              title="Setup database schema"
              description="Define tables for users, tasks, projects"
              label="Backend"
            />
            <TaskCard
              id="inprogress-2"
              title="Create responsive navbar"
              description="Make navigation work on mobile"
              label="Frontend"
            />
            <TaskCard
              id="inprogress-3"
              title="Add drag and drop"
              description="Implement DnD for task cards"
              label="Feature"
            />
          </div>
        </div>

        {/* Need Approval Column */}
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
          <h4 className="font-bold mb-4">Need Approval</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            <TaskCard
              id="approval-1"
              title="Review pull request #45"
              description="Code review for authentication module"
              label="Review"
            />
            <TaskCard
              id="approval-2"
              title="Approve budget for server"
              description="Check costs and approve hosting"
              label="Admin"
            />
          </div>
        </div>

        {/* Done Column */}
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
          <h4 className="font-bold mb-4">Done</h4>
          <div className="h-full min-h-[400px] space-y-4 overflow-y-auto">
            <TaskCard
              id="done-1"
              title="Fix login bug"
              description="Resolved issue with password reset"
              label="Bugfix"
            />
            <TaskCard
              id="done-2"
              title="Update dependencies"
              description="Upgrade to latest versions"
              label="Maintenance"
            />
            <TaskCard
              id="done-3"
              title="Add unit tests"
              description="Coverage for core functions"
              label="Testing"
            />
          </div>
        </div>
      </div>
    </div>
  );
}