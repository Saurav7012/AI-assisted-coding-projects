import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Edit3, Star, Calendar, ChevronDown, ChevronUp, FileText, Check } from 'lucide-react';

export default function TodoItem({ todo, onToggleComplete, onToggleStar, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine priority color elements
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
          border: 'border-l-4 border-l-rose-500',
          badge: 'bg-rose-950/30 text-rose-400 border-rose-900/30'
        };
      case 'medium':
        return {
          dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
          border: 'border-l-4 border-l-amber-500',
          badge: 'bg-amber-950/30 text-amber-400 border-amber-900/30'
        };
      case 'low':
      default:
        return {
          dot: 'bg-zinc-500',
          border: 'border-l-4 border-l-zinc-700',
          badge: 'bg-zinc-800/40 text-zinc-400 border-zinc-700/30'
        };
    }
  };

  // Human-friendly due date formatting
  const getDueDateLabel = (dateStr) => {
    if (!dateStr) return null;
    
    // Parse the date as YYYY-MM-DD local
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    
    const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
    targetDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { text: 'Today', style: 'bg-amber-950/40 text-amber-300 border-amber-800/40 font-semibold' };
    }
    if (diffDays === 1) {
      return { text: 'Tomorrow', style: 'bg-indigo-950/40 text-indigo-300 border-indigo-900/40' };
    }
    if (diffDays === -1) {
      return { text: 'Yesterday (Overdue)', style: 'bg-rose-950/40 text-rose-300 border-rose-800/40 font-semibold' };
    }
    if (diffDays < -1) {
      return { text: `${Math.abs(diffDays)} days overdue`, style: 'bg-rose-950/50 text-rose-200 border-rose-800/50 font-bold' };
    }
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const currentYear = new Date().getFullYear();
    const formatted = targetDate.toLocaleDateString('en-US', 
      targetDate.getFullYear() === currentYear 
        ? { month: 'short', day: 'numeric' }
        : options
    );
    
    return { text: formatted, style: 'bg-zinc-800/40 text-zinc-400 border-zinc-700/40' };
  };

  // Category visual mapping
  const getCategoryStyle = (catName) => {
    const normalized = (catName || '').toLowerCase();
    if (normalized === 'personal') return 'bg-[#1d4ed8]/20 text-[#60a5fa] border-[#1d4ed8]/40';
    if (normalized === 'work') return 'bg-[#6b21a8]/20 text-[#c084fc] border-[#6b21a8]/40';
    if (normalized === 'shopping') return 'bg-[#c2410c]/20 text-[#fb923c] border-[#c2410c]/40';
    if (normalized === 'health') return 'bg-[#065f46]/20 text-[#34d399] border-[#065f46]/40';
    return 'bg-zinc-800/40 text-zinc-400 border-zinc-700/30';
  };

  const priorityConfig = getPriorityConfig(todo.priority);
  const dueDateLabel = getDueDateLabel(todo.dueDate);
  const catStyle = getCategoryStyle(todo.category);

  return (
    <motion.div
      id={`todo-item-${todo.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`task-item-bg rounded-xl overflow-hidden shadow-lg transition-all flex flex-col ${priorityConfig.border}`}
    >
      {/* Top Main Row */}
      <div className="p-4 flex items-start gap-3.5">
        {/* Animated Custom Checkbox */}
        <button
          id={`todo-complete-toggle-${todo.id}`}
          onClick={() => onToggleComplete(todo.id)}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer flex-shrink-0 ${
            todo.completed
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'border-zinc-700 hover:border-indigo-500 bg-[#18181b]'
          }`}
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Task Title & Meta Row */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Category Badge */}
            <span id={`todo-category-${todo.id}`} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${catStyle}`}>
              {todo.category || 'General'}
            </span>

            {/* Priority Badge */}
            <span id={`todo-priority-${todo.id}`} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${priorityConfig.badge}`}>
              {todo.priority}
            </span>

            {/* Due Date Label */}
            {dueDateLabel && (
              <span id={`todo-duedate-${todo.id}`} className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${dueDateLabel.style}`}>
                <Calendar size={10} />
                {dueDateLabel.text}
              </span>
            )}
          </div>

          {/* Title Text */}
          <h4
            id={`todo-title-${todo.id}`}
            onClick={() => onToggleComplete(todo.id)}
            className={`text-sm font-semibold transition-all cursor-pointer break-words pr-2 ${
              todo.completed
                ? 'line-through text-zinc-600 font-normal opacity-75'
                : 'text-zinc-200 hover:text-white'
            }`}
          >
            {todo.title}
          </h4>

          {/* Collapsible Notes Indicator */}
          {todo.description && (
            <button
              id={`todo-desc-toggle-${todo.id}`}
              onClick={() => setShowDetails(!showDetails)}
              className="mt-1 text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileText size={12} />
              {showDetails ? 'Hide notes' : 'View notes'}
              {showDetails ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          )}
        </div>

        {/* Actions Button Row */}
        <div className="flex items-center gap-1.5 self-start">
          {/* Star Toggle */}
          <button
            id={`todo-star-btn-${todo.id}`}
            onClick={() => onToggleStar(todo.id)}
            className={`p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer ${
              todo.starred ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
            }`}
            title="Star Task"
          >
            <Star size={16} fill={todo.starred ? 'currentColor' : 'none'} />
          </button>

          {/* Edit Button */}
          <button
            id={`todo-edit-btn-${todo.id}`}
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>

          {/* Delete Button */}
          <button
            id={`todo-delete-btn-${todo.id}`}
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Details Row */}
      <AnimatePresence initial={false}>
        {showDetails && todo.description && (
          <motion.div
            id={`todo-details-panel-${todo.id}`}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-zinc-900/40 border-t border-white/5"
          >
            <div className="p-4 text-xs text-zinc-400 font-medium whitespace-pre-wrap leading-relaxed">
              {todo.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
