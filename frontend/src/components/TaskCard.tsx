import React, { useState } from 'react';

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
    <div
      data-testid={`task-${task.id}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 ${isDragging ? 'opacity-50' : ''} ${!isEditing ? 'cursor-move' : 'cursor-default'} relative`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-semibold mb-1 w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none"
            />
          ) : (
            <h3 className="font-semibold mb-1 truncate">{task.title}</h3>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="opacity-0 hover:opacity-100 text-gray-400 hover:text-blue-500 text-sm transition-opacity"
          >
            ✏️
          </button>
          <button
            data-testid={`delete-task-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="opacity-0 hover:opacity-100 text-gray-400 hover:text-red-500 text-sm transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="text-sm text-gray-600 dark:text-gray-300 mb-2 w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded p-1 focus:outline-none"
          rows={2}
        />
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-medium ${priorityColor[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
        {task.due_date && (
          <span className="text-xs text-gray-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {labelsArray.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {labelsArray.map((label, idx) => (
            <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {label}
            </span>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 space-y-2">
          <div>
            <label className="text-xs text-gray-500">Priority:</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="ml-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Due Date:</label>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="ml-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Labels (comma-separated):</label>
            <input
              value={editLabels}
              onChange={(e) => setEditLabels(e.target.value)}
              className="ml-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-1 w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}