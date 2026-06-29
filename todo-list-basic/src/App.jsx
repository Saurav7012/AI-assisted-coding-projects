import React, { useState, useEffect } from 'react';
import { Pin, Trash2, Plus, Sparkles, CheckCircle2, ListTodo, ClipboardCopy } from 'lucide-react';

export default function App() {



  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('todo_tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
      console.error("Failed to parse tasks from localStorage:", e);
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');

  // Sync tasks state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle adding a new task
  const addTask = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

 

    const newTask = {
      id: Date.now().toString(),
      text: inputValue,
      pinned: false
    };

    setTasks([...tasks, newTask]);
    
    setInputValue('');
  };

  // Handle deleting a task
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Handle toggling the pinned state of a task
  const togglePinTask = (id) => {
    // setTasks((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === id ? { ...task, pinned: !task.pinned } : task
    //   )
    // );
    const newTasks = tasks.map(obj => obj.id===id ? {...obj, pinned: !obj.pinned} : obj);
    setTasks(newTasks);

  };

  const handleCopy = async (id) => {
    const reqTask = tasks.filter((task) => task.id===id);
    await navigator.clipboard.writeText(reqTask[0].text);
  }


  // Sort tasks dynamically: pinned tasks always stay at the top
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div id="todo-app-container" className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div id="todo-card" className="card w-full max-w-[50rem] bg-slate-900/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 rounded-[2rem] overflow-hidden transition-all duration-300">
        <div className="card-body p-6 sm:p-8 md:p-10">
          
          {/* Header Area */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                <ListTodo size={24} />
              </div>
              <div>
                <h1 id="app-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Tasks
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                  Organized & pinned automatically
                </p>
              </div>
            </div>
            
            <div className="badge badge-lg bg-slate-800 text-slate-300 border-slate-700 font-semibold px-4 py-2 text-xs flex items-center gap-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </div>
          </div>

          {/* Combined Search/Add Bar (Modern Floating Layout) */}
          <form id="todo-form" onSubmit={addTask} className="relative flex items-center mb-8">
            <input
              id="todo-input"
              type="text"
              placeholder="What would you like to achieve today?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="input w-full bg-slate-950 border border-slate-800 h-14 pl-5 pr-16 rounded-2xl text-slate-200 placeholder:text-slate-500 font-medium focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-inner"
              maxLength={120}
            />
            <button
              id="todo-add-btn"
              type="submit"
              className="absolute right-2 btn btn-circle btn-md bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-md hover:shadow-indigo-500/30 transition-all hover:scale-105"
              title="Add task"
            >
              <Plus size={20} />
            </button>
          </form>

          {/* Tasks List */}
          <div id="todo-list" className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {sortedTasks.length === 0 ? (
              <div id="empty-state" className="flex flex-col items-center justify-center py-14 px-6 bg-slate-950/40 rounded-[2rem] border-2 border-dashed border-slate-800 text-center">
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4">
                  <Sparkles size={28} className="animate-pulse" />
                </div>
                <h3 className="text-slate-200 font-bold text-lg">No tasks for today</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-[240px]">
                  Add a brand new task above to begin your journey.
                </p>
              </div>
            ) : (
              sortedTasks.map((task) => (
                <div
                  key={task.id}
                  id={`task-item-${task.id}`}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    task.pinned
                      ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.02)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                    {task.pinned ? (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Pin size={15} className="fill-current rotate-45" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                    <span className={`font-semibold truncate text-sm sm:text-base ${
                      task.pinned ? 'text-amber-200 font-bold' : 'text-slate-300'
                    }`}>
                      {task.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">


                    <button
                      type="button"
                      onClick={() => handleCopy(task.id)}
                      className="btn btn-xs sm:btn-sm btn-circle bg-slate-900 text-slate-500"
                    >
                      <ClipboardCopy size={14} />
                    </button>

                    {/* Pin/Unpin Button */}
                    <button
                      id={`pin-btn-${task.id}`}
                      type="button"
                      onClick={() => togglePinTask(task.id)}
                      className={`btn btn-xs sm:btn-sm btn-circle border-0 transition-all duration-300 ${
                        task.pinned
                          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                          : 'bg-slate-900 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'
                      }`}
                      title={task.pinned ? 'Unpin Task' : 'Pin Task'}
                    >
                      <Pin size={14} className={task.pinned ? 'fill-current' : ''} />
                    </button>

                    {/* Delete Button */}
                    <button
                      id={`delete-btn-${task.id}`}
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="btn btn-xs sm:btn-sm btn-circle bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border-0 transition-all duration-300"
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary Bar */}
          {tasks.length > 0 && (
            <div id="todo-footer" className="flex justify-between items-center mt-8 pt-5 border-t border-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Pinned: {tasks.filter(t => t.pinned).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Total: {tasks.length}</span>
              </div>
            </div>
          )}

        </div>
      </div>

   
    </div>
  );
}
