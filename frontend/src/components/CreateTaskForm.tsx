import React, { useState, useEffect, useRef } from 'react';

interface CreateTaskFormProps {
  onSubmit: (task: { title: string; description: string; label?: string }) => void;
  onClose: () => void;
}

export default function CreateTaskForm({ onSubmit, onClose }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus trap: focus first input
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), label: label || undefined });
    setTitle('');
    setDescription('');
    setLabel('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md mx-4 w-full"
        aria-labelledby="create-task-title"
      >
        <h2 id="create-task-title" className="text-xl font-bold mb-4">Create New Task</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
            <input
              ref={titleRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="label" className="block text-sm font-medium mb-1">Label</label>
            <select
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select label (optional)</option>
              <option value="bug">Bug</option>
              <option value="feat">Feature</option>
              <option value="chore">Chore</option>
              <option value="docs">Documentation</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            disabled={!title.trim()}
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}