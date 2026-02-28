import React from 'react';

interface TaskCardProps {
  title: string;
  description: string;
  id: number;
  onDelete: (id: number) => void;
}

export default function TaskCard({ title, description, id, onDelete }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text', id.toString());
  };

  return (
    <div
      data-testid={`task-${id}`}
      draggable
      onDragStart={handleDragStart}
      className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-move relative"
    >
      <button
        data-testid={`delete-task-${id}`}
        onClick={() => onDelete(id)}
        className="absolute top-4 right-4 opacity-0 hover:opacity-100 text-gray-400 hover:text-red-500 text-sm transition-opacity"
      >
        ✕
      </button>
      <h3 className="font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{description}</p>
    </div>
  );
}