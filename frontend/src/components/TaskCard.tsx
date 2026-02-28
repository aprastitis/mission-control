import React from 'react';

interface TaskCardProps {
  title: string;
  description: string;
  label: string;
  id: string;
}

export default function TaskCard({ title, description, label, id }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text', id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="shadow-md rounded-lg p-4 bg-white dark:bg-gray-800 border hover:shadow-lg transition-all cursor-move"
    >
      <h3 className="font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{description}</p>
      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full font-medium">
        {label}
      </span>
    </div>
  );
}