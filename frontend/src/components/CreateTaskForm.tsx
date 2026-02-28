import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CreateTaskFormProps {
  onSubmit: (task: { title: string; description: string; priority?: 'low' | 'medium' | 'high'; due_date?: string; labels?: string }) => void;
  onClose: () => void;
}

export default function CreateTaskForm({ onSubmit, onClose }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load draft from localStorage
    const draft = localStorage.getItem('taskDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setTitle(parsed.title || '');
        setDescription(parsed.description || '');
        setPriority(parsed.priority || 'medium');
        setDueDate(parsed.due_date || '');
        setLabels(parsed.labels || '');
      } catch (e) {
        // Ignore invalid draft
      }
    }
    // Focus trap: focus first input
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Save draft to localStorage on change
  useEffect(() => {
    const draft = { title, description, priority, due_date: dueDate, labels };
    localStorage.setItem('taskDraft', JSON.stringify(draft));
  }, [title, description, priority, dueDate, labels]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || undefined,
      labels: labels.trim()
    });
    // Clear draft
    localStorage.removeItem('taskDraft');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setLabels('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-neu-glass dark:bg-neu-glass-dark p-8 rounded-3xl shadow-neu-convex dark:shadow-neu-convex-dark border border-slate-200/50 dark:border-slate-700 max-w-md mx-4 w-full"
        aria-labelledby="create-task-title"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 id="create-task-title" className="text-responsive-2xl font-bold mb-6 text-center">📝 Create New Task</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-responsive-sm font-medium mb-2">Title *</label>
            <input
              data-testid="task-title"
              ref={titleRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-responsive-sm font-medium mb-2">Description</label>
            <textarea
              data-testid="task-description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-responsive-sm font-medium mb-2">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-responsive-sm font-medium mb-2">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="labels" className="block text-responsive-sm font-medium mb-2">Labels (comma-separated)</label>
            <input
              id="labels"
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
              placeholder="e.g. bug, feature"
            />
          </div>

        </div>
        <div className="flex justify-end gap-4 mt-8">
          <motion.button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 rounded-xl shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark transition-all text-responsive-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ❌ Cancel
          </motion.button>
          <motion.button
            data-testid="submit-task"
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark transition-all text-responsive-sm"
            disabled={!title.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Create Task
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}