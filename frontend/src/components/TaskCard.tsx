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
      className="shadow-md rounded-lg p-4 bg-white dark:bg-gray-800 border hover:shadow-lg transition-all cursor-move relative"
    >
      <button
        data-testid={`delete-task-${id}`}
        onClick={() => onDelete(id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
      >
        ✕
      </button>
      <h3 className="font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{description}</p>
    </div>
  );
}