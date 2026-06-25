import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, Star, Calendar, Bookmark, FileText, ChevronDown, ChevronUp, AlertCircle, Check } from 'lucide-react';

export default function TodoForm({
  onAddTodo,
  onUpdateTodo,
  editingTodo,
  setEditingTodo,
  categories,
  onAddCategory
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [starred, setStarred] = useState(false);
  
  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [showCatInput, setShowCatInput] = useState(false);

  // Sync with editingTodo if provided
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setCategory(editingTodo.category || 'Personal');
      setDueDate(editingTodo.dueDate || '');
      setPriority(editingTodo.priority || 'medium');
      setStarred(editingTodo.starred || false);
      setShowAdvanced(true); // Open options when editing
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Personal');
    setDueDate('');
    setPriority('medium');
    setStarred(false);
    setShowAdvanced(false);
    setShowCatInput(false);
    setNewCatInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todoData = {
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate,
      priority,
      starred,
    };

    if (editingTodo) {
      onUpdateTodo({
        ...editingTodo,
        ...todoData
      });
      setEditingTodo(null);
    } else {
      onAddTodo(todoData);
    }
    resetForm();
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    
    // Check if category already exists
    const exists = categories.some(cat => cat.name.toLowerCase() === newCatInput.trim().toLowerCase());
    if (!exists) {
      onAddCategory(newCatInput.trim());
      setCategory(newCatInput.trim());
    }
    setNewCatInput('');
    setShowCatInput(false);
  };

  return (
    <div id="todo-form-card" className="bg-[#111113] rounded-2xl border border-white/5 p-5 mb-6 transition-all duration-300 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Form Header */}
        <div className="flex items-center justify-between">
          <h3 id="form-heading" className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            {editingTodo ? (
              <>
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                Edit Task
              </>
            ) : (
              <>
                <Plus size={14} className="text-indigo-400" />
                Create New Task
              </>
            )}
          </h3>
          {editingTodo && (
            <button
              type="button"
              id="cancel-edit-btn"
              onClick={() => setEditingTodo(null)}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Main Title Row */}
        <div className="flex gap-2">
          <input
            id="task-title-input"
            type="text"
            required
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-100 input-dark-focus"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Quick Star Toggle */}
          <button
            type="button"
            id="form-star-btn"
            onClick={() => setStarred(!starred)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              starred 
                ? 'bg-amber-950/40 border-amber-800/40 text-amber-400' 
                : 'bg-[#18181b] border-white/10 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mark as Starred"
          >
            <Star size={18} fill={starred ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Expandable Advanced Options Trigger */}
        <button
          type="button"
          id="toggle-advanced-btn"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 flex items-center gap-1 self-start transition-colors cursor-pointer"
        >
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showAdvanced ? "Hide Details & Options" : "Add Details, Due Date, Priority..."}
        </button>

        {/* Advanced Options Content */}
        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              id="advanced-options-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-4 pb-2 border-t border-white/5 mt-1">
                {/* Description Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="task-desc-input" className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <FileText size={12} />
                    Notes / Description
                  </label>
                  <textarea
                    id="task-desc-input"
                    placeholder="Describe this task in more detail..."
                    rows={2}
                    className="w-full px-4 py-2 bg-[#18181b] border border-white/10 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-100 resize-none input-dark-focus"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Priority Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: '💤 Low', color: 'border-white/10 hover:bg-zinc-800/50 text-zinc-400', activeColor: 'bg-zinc-800 border-zinc-600 text-zinc-200 font-bold' },
                      { id: 'medium', label: '⚡ Medium', color: 'border-white/10 hover:bg-amber-950/20 text-amber-500', activeColor: 'bg-amber-950/40 border-amber-800/40 text-amber-400 font-bold' },
                      { id: 'high', label: '🔥 High', color: 'border-white/10 hover:bg-rose-950/20 text-rose-500', activeColor: 'bg-rose-950/40 border-rose-800/40 text-rose-400 font-bold' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        id={`priority-btn-${p.id}`}
                        onClick={() => setPriority(p.id)}
                        className={`py-2 px-3 border rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          priority === p.id ? p.activeColor : p.color
                        }`}
                      >
                        {p.label}
                        {priority === p.id && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category & Due Date Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="task-category-select" className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <Bookmark size={12} />
                        Category
                      </label>
                      <button
                        type="button"
                        id="toggle-custom-category-btn"
                        onClick={() => setShowCatInput(!showCatInput)}
                        className="text-[10px] font-bold uppercase text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        {showCatInput ? "Select Existing" : "+ Custom"}
                      </button>
                    </div>

                    {showCatInput ? (
                      <div className="flex gap-1.5">
                        <input
                          id="new-category-input"
                          type="text"
                          placeholder="Category name"
                          className="flex-1 px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-xl text-xs font-medium text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 input-dark-focus"
                          value={newCatInput}
                          onChange={(e) => setNewCatInput(e.target.value)}
                        />
                        <button
                          type="button"
                          id="save-new-category-btn"
                          onClick={handleAddCategorySubmit}
                          className="px-3 py-1.5 accent-gradient-bg hover:opacity-90 text-white rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <select
                        id="task-category-select"
                        className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-xl text-xs text-zinc-300 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer input-dark-focus"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.emoji} {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Due Date */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="task-due-date" className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Calendar size={12} />
                      Due Date
                    </label>
                    <input
                      id="task-due-date"
                      type="date"
                      className="w-full px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-xl text-xs font-medium text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer input-dark-focus"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <button
          type="submit"
          id="submit-task-btn"
          className="w-full accent-gradient-bg hover:opacity-95 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {editingTodo ? (
            <>
              <Sparkles size={16} />
              Save Changes
            </>
          ) : (
            <>
              <Plus size={16} />
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
}
