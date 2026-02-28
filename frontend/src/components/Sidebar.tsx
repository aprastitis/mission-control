import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: {
    priority: string[];
    labels: string[];
    dueDateRange: { start: string; end: string };
  };
  onFiltersChange: (filters: SidebarProps['filters']) => void;
}

export default function Sidebar({ isOpen, onToggle, filters, onFiltersChange }: SidebarProps) {
  const [tempFilters, setTempFilters] = useState(filters);

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorities = checked
      ? [...tempFilters.priority, priority]
      : tempFilters.priority.filter(p => p !== priority);
    setTempFilters({ ...tempFilters, priority: newPriorities });
  };

  const handleLabelChange = (label: string, checked: boolean) => {
    const newLabels = checked
      ? [...tempFilters.labels, label]
      : tempFilters.labels.filter(l => l !== label);
    setTempFilters({ ...tempFilters, labels: newLabels });
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priority: [],
      labels: [],
      dueDateRange: { start: '', end: '' }
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-80 backdrop-blur-md bg-white/10 dark:bg-black/10 border-r border-slate-200/50 dark:border-slate-700 shadow-glass dark:shadow-glass-dark z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:relative md:translate-x-0 md:z-auto`}
        initial={false}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-responsive-xl font-bold">Filters</h2>
            <button
              onClick={onToggle}
              className="md:hidden text-2xl hover:text-gray-600 dark:hover:text-gray-400"
            >
              ✕
            </button>
          </div>

          {/* Priority Filter */}
          <div className="mb-6">
            <h3 className="text-responsive-lg font-semibold mb-3">Priority</h3>
            <div className="space-y-2">
              {['low', 'medium', 'high'].map(priority => (
                <label key={priority} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempFilters.priority.includes(priority)}
                    onChange={(e) => handlePriorityChange(priority, e.target.checked)}
                    className="mr-3 rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-responsive-sm capitalize">
                    {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'} {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Labels Filter */}
          <div className="mb-6">
            <h3 className="text-responsive-lg font-semibold mb-3">Labels</h3>
            <input
              type="text"
              placeholder="Add label filter..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleLabelChange(e.currentTarget.value.trim(), true);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
              {tempFilters.labels.map(label => (
                <div key={label} className="flex items-center justify-between bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  <span className="text-responsive-sm">🏷️ {label}</span>
                  <button
                    onClick={() => handleLabelChange(label, false)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Due Date Range */}
          <div className="mb-6">
            <h3 className="text-responsive-lg font-semibold mb-3">Due Date Range</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-responsive-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={tempFilters.dueDateRange.start}
                  onChange={(e) => setTempFilters({
                    ...tempFilters,
                    dueDateRange: { ...tempFilters.dueDateRange, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-responsive-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={tempFilters.dueDateRange.end}
                  onChange={(e) => setTempFilters({
                    ...tempFilters,
                    dueDateRange: { ...tempFilters.dueDateRange, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-neu-convex dark:shadow-neu-convex-dark focus:shadow-neu-inset dark:focus:shadow-neu-inset-dark focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply
            </motion.button>
            <motion.button
              onClick={handleResetFilters}
              className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-neu-convex dark:shadow-neu-convex-dark hover:shadow-neu-pressed dark:hover:shadow-neu-pressed-dark transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}