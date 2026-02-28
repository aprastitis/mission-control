import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'backlog' | 'inprogress' | 'needapproval' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  labels: string;
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: Partial<Task>) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date || '');
  const [editLabels, setEditLabels] = useState(task.labels);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('text', task.id.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    onEdit(task.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      due_date: editDueDate || undefined,
      labels: editLabels,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || '');
    setEditLabels(task.labels);
    setIsEditing(false);
  };

  const priorityColor = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  const labelsArray = task.labels ? task.labels.split(',').map(l => l.trim()).filter(l => l) : [];

  return (
    <motion.div
      data-testid={`task-${task.id}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700 bg-neu-glass dark:bg-neu-glass-dark shadow-neu-convex dark:shadow-neu-convex-dark transition-all duration-300 ${isDragging ? 'opacity-50' : ''} ${!isEditing ? 'cursor-move' : 'cursor-default'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-responsive-lg font-semibold mb-1 w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark"
            />
          ) : (
            <h3 className="text-responsive-lg font-semibold mb-1 truncate">{task.title}</h3>
          )}
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 text-2xl transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            ✏️
          </motion.button>
          <motion.button
            data-testid={`delete-task-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-2xl transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            ✕
          </motion.button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="text-responsive-sm text-gray-600 dark:text-gray-300 mb-3 w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark"
          rows={2}
        />
      ) : (
        <p className="text-responsive-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <motion.span
          className={`text-responsive-xs font-semibold px-3 py-1 rounded-full shadow-neu-inset dark:shadow-neu-inset-dark ${priorityColor[task.priority]} bg-white/20 dark:bg-black/20`}
          whileHover={{ scale: 1.05 }}
        >
          🔴 {task.priority.toUpperCase()}
        </motion.span>
        {task.due_date && (
          <motion.span
            className="text-responsive-xs text-gray-500 px-3 py-1 rounded-full shadow-neu-inset dark:shadow-neu-inset-dark bg-white/20 dark:bg-black/20"
            whileHover={{ scale: 1.05 }}
          >
            📅 {new Date(task.due_date).toLocaleDateString()}
          </motion.span>
        )}
      </div>

      {labelsArray.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {labelsArray.map((label, idx) => (
            <motion.span
              key={idx}
              className="text-responsive-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full shadow-neu-convex dark:shadow-neu-convex-dark"
              whileHover={{ scale: 1.05 }}
            >
              🏷️ {label}
            </motion.span>
          ))}
        </div>
      )}

      {isEditing && (
        <motion.div
          className="mt-4 space-y-3 shadow-neu-inset dark:shadow-neu-inset-dark rounded-xl p-4 bg-white/10 dark:bg-black/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="text-responsive-xs text-gray-500 block mb-1">Priority:</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full text-responsive-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-responsive-xs text-gray-500 block mb-1">Due Date:</label>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="w-full text-responsive-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark"
            />
          </div>
          <div>
            <label className="text-responsive-xs text-gray-500 block mb-1">Labels (comma-separated):</label>
            <input
              value={editLabels}
              onChange={(e) => setEditLabels(e.target.value)}
              className="w-full text-responsive-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark"
            />
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-responsive-sm rounded-lg shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 Save
            </motion.button>
            <motion.button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-responsive-sm rounded-lg shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ❌ Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}