"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
          <div className="h-full min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
            <p className="text-gray-500">Drop tasks here</p>
          </div>
        </div>

        {/* In Progress Column */}
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
          <h4 className="font-bold mb-4">In Progress</h4>
          <div className="h-full min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
            <p className="text-gray-500">Drop tasks here</p>
          </div>
        </div>

        {/* Need Approval Column */}
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
          <h4 className="font-bold mb-4">Need Approval</h4>
          <div className="h-full min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
            <p className="text-gray-500">Drop tasks here</p>
          </div>
        </div>

        {/* Done Column */}
        <div className="h-full bg-white/50 dark:bg-black/50 rounded-xl shadow-lg p-6">
          <h4 className="font-bold mb-4">Done</h4>
          <div className="h-full min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
            <p className="text-gray-500">Drop tasks here</p>
          </div>
        </div>
      </div>
    </div>
  );
}