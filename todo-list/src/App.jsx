import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ListTodo, Sparkles, Plus, AlertCircle, X, Check, Info } from 'lucide-react';

// Import subcomponents
import TodoProgress from './components/TodoProgress';
import TodoForm from './components/TodoForm';
import TodoFilters from './components/TodoFilters';
import TodoItem from './components/TodoItem';
import TodoExportImport from './components/TodoExportImport';

// Starter demo data
const sampleTodos = [
  {
    id: 'sample-1',
    title: '🚀 Create your first custom task',
    description: 'Use the input card above to type a task. Expand details to assign tags, custom priority, and due dates!',
    completed: false,
    priority: 'high',
    category: 'Personal',
    dueDate: new Date().toISOString().slice(0, 10), // Today
    starred: true,
    createdAt: Date.now()
  },
  {
    id: 'sample-2',
    title: '⚡ Try checking off this task as completed',
    description: 'Completed tasks are styled with a clean strike-through and count towards your total progress percentage!',
    completed: true,
    priority: 'medium',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // Tomorrow
    starred: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'sample-3',
    title: '⭐ Star high-priority actions',
    description: 'Click the star icon to prioritize tasks. You can quickly view all starred items using the "Starred" quick filter tab.',
    completed: false,
    priority: 'low',
    category: 'Health',
    dueDate: '',
    starred: true,
    createdAt: Date.now() - 7200000
  },
  {
    id: 'sample-4',
    title: '📦 Back up or restore your data',
    description: 'Expand the management panel at the bottom to export your task list as a JSON file or import a backup!',
    completed: false,
    priority: 'medium',
    category: 'Shopping',
    dueDate: '',
    starred: false,
    createdAt: Date.now() - 10800000
  }
];

const defaultCategories = [
  { name: 'Personal', emoji: '🏠' },
  { name: 'Work', emoji: '💼' },
  { name: 'Shopping', emoji: '🛒' },
  { name: 'Health', emoji: '❤️' },
  { name: 'Others', emoji: '🔖' }
];

export default function App() {
  // State variables loaded from localStorage with fallbacks
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('local_todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return sampleTodos;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('local_todo_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultCategories;
  });

  // Filters State
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all'); // 'all' | 'active' | 'completed' | 'starred'
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Editing state
  const [editingTodo, setEditingTodo] = useState(null);

  // Toast System State
  const [toasts, setToasts] = useState([]);

  // Save todos to localStorage on change
  useEffect(() => {
    localStorage.setItem('local_todos', JSON.stringify(todos));
  }, [todos]);

  // Save categories to localStorage on change
  useEffect(() => {
    localStorage.setItem('local_todo_categories', JSON.stringify(categories));
  }, [categories]);

  // Toast handlers
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Task Mutators
  const handleAddTodo = (todoData) => {
    const newTodo = {
      ...todoData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      completed: false,
      createdAt: Date.now()
    };
    setTodos((prev) => [newTodo, ...prev]);
    addToast(`Task "${newTodo.title.slice(0, 20)}${newTodo.title.length > 20 ? '...' : ''}" created!`, "success");
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos((prev) => prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    addToast("Task updated successfully!", "success");
  };

  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          addToast(
            nextCompleted ? "Task completed! Way to go!" : "Task marked as active.",
            nextCompleted ? "success" : "info"
          );
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleToggleStar = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStarred = !t.starred;
          addToast(
            nextStarred ? "Task added to Starred!" : "Task removed from Starred.",
            "info"
          );
          return { ...t, starred: nextStarred };
        }
        return t;
      })
    );
  };

  const handleDeleteTodo = (id) => {
    const target = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    addToast(`Task deleted.`, "error");
    if (editingTodo?.id === id) {
      setEditingTodo(null);
    }
  };

  const handleAddCategory = (newCatName) => {
    const newCat = {
      name: newCatName,
      emoji: '🔖'
    };
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCatName}" added!`, "success");
  };

  // Bulk Actions
  const handleImportTodos = (importedList) => {
    setTodos((prev) => [...importedList, ...prev]);
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const handleMarkAllComplete = () => {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: true })));
  };

  const handleResetApp = () => {
    setTodos(sampleTodos);
    setCategories(defaultCategories);
    setSearch('');
    setTab('all');
    setCategory('all');
    setPriority('all');
    setSortBy('createdAt-desc');
    setEditingTodo(null);
  };

  // ----------------------------------------------------
  // FILTERING & SORTING LOGIC
  // ----------------------------------------------------
  const filteredTodos = todos
    .filter((todo) => {
      // 1. Search Query
      const titleMatch = todo.title.toLowerCase().includes(search.toLowerCase());
      const descMatch = todo.description ? todo.description.toLowerCase().includes(search.toLowerCase()) : false;
      if (search && !titleMatch && !descMatch) return false;

      // 2. Filter Tab
      if (tab === 'active' && todo.completed) return false;
      if (tab === 'completed' && !todo.completed) return false;
      if (tab === 'starred' && !todo.starred) return false;

      // 3. Category Filter
      if (category !== 'all' && todo.category !== category) return false;

      // 4. Priority Filter
      if (priority !== 'all' && todo.priority !== priority) return false;

      return true;
    })
    .sort((a, b) => {
      // 1. Sort parameter
      switch (sortBy) {
        case 'createdAt-asc':
          return a.createdAt - b.createdAt;
        case 'dueDate-asc':
          const ad1 = a.dueDate || '9999-12-31';
          const bd1 = b.dueDate || '9999-12-31';
          return ad1.localeCompare(bd1);
        case 'dueDate-desc':
          const ad2 = a.dueDate || '0000-01-01';
          const bd2 = b.dueDate || '0000-01-01';
          return bd2.localeCompare(ad2);
        case 'priority-desc':
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'createdAt-desc':
        default:
          return b.createdAt - a.createdAt;
      }
    });

  // Formatted Local Date string
  const getFormattedDate = () => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div id="todo-app-root" className="bg-[#09090b] min-h-screen text-[#fafafa] font-sans py-12 px-4 sm:px-6 custom-scrollbar overflow-y-auto">
      <div className="max-w-xl mx-auto flex flex-col min-h-full">
        {/* Custom Toast Alerts */}
        <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                id={`toast-${toast.id}`}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className={`p-3.5 rounded-xl border shadow-lg flex items-start gap-2.5 pointer-events-auto backdrop-blur-md ${
                  toast.type === 'success'
                    ? 'bg-emerald-950/90 border-emerald-800/40 text-emerald-200'
                    : toast.type === 'error'
                    ? 'bg-rose-950/90 border-rose-800/40 text-rose-200'
                    : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-200'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'success' ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : toast.type === 'error' ? (
                    <AlertCircle size={16} className="text-rose-400" />
                  ) : (
                    <Info size={16} className="text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 text-xs font-semibold leading-relaxed">
                  {toast.message}
                </div>
                <button
                  id={`close-toast-${toast.id}`}
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Brand Header */}
        <header id="todo-header" className="mb-10 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 px-1">
          <div>
            <h1 id="brand-title" className="text-4xl font-semibold tracking-tight text-[#fafafa]">
              Today's Focus
            </h1>
            <p id="brand-subtitle" className="text-zinc-500 mt-2 text-xs sm:text-sm uppercase tracking-widest font-semibold">
              {getFormattedDate()}
            </p>
          </div>
          <div className="text-right flex items-baseline gap-1.5 self-start sm:self-auto">
            <span className="text-3xl font-light text-zinc-300">
              {String(todos.filter(t => t.completed).length).padStart(2, '0')}
            </span>
            <span className="text-sm text-zinc-600">
              / {String(todos.length).padStart(2, '0')}
            </span>
          </div>
        </header>

        {/* Core Sections */}
        <main id="todo-main-content">
          {/* 1. Progress Stats */}
          <TodoProgress todos={todos} />

          {/* 2. Creation Form */}
          <TodoForm
            onAddTodo={handleAddTodo}
            onUpdateTodo={handleUpdateTodo}
            editingTodo={editingTodo}
            setEditingTodo={setEditingTodo}
            categories={categories}
            onAddCategory={handleAddCategory}
          />

          {/* 3. Filters panel */}
          <TodoFilters
            search={search}
            setSearch={setSearch}
            tab={tab}
            setTab={setTab}
            category={category}
            setCategory={setCategory}
            priority={priority}
            setPriority={setPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />

          {/* 4. Task list presentation */}
          <div id="todo-list-wrapper" className="flex flex-col gap-3 min-h-[150px]">
            <AnimatePresence mode="popLayout">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onToggleStar={handleToggleStar}
                    onDelete={handleDeleteTodo}
                    onEdit={(t) => {
                      setEditingTodo(t);
                      // Scroll to top where the edit form is loaded
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      addToast("Task loaded into form. Editing at the top!", "info");
                    }}
                  />
                ))
              ) : (
                <motion.div
                  id="empty-list-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#111113] border border-white/5 rounded-2xl py-12 px-6 text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/5">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 id="empty-state-title" className="text-sm font-bold text-zinc-200">No matching tasks found</h4>
                    <p id="empty-state-text" className="text-xs text-zinc-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                      {todos.length === 0 
                        ? "Your list is empty! Add a new task above or reset the app to populate sample data." 
                        : "Try adjusting your search queries or filter dropdowns to find what you're looking for."}
                    </p>
                  </div>
                  {todos.length > 0 && (
                    <button
                      id="reset-filters-shortcut-btn"
                      onClick={() => {
                        setSearch('');
                        setCategory('all');
                        setPriority('all');
                        setTab('all');
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      Clear all active filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Backups and Reset action panel */}
          <TodoExportImport
            todos={todos}
            onImportTodos={handleImportTodos}
            onClearCompleted={handleClearCompleted}
            onMarkAllComplete={handleMarkAllComplete}
            onResetApp={handleResetApp}
            onAddToast={addToast}
          />
        </main>

        <footer id="todo-footer" className="mt-12 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
          Made with React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
}
