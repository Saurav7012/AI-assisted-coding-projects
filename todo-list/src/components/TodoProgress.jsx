import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Star, ListTodo } from 'lucide-react';

export default function TodoProgress({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const starred = todos.filter(t => t.starred).length;
  const active = total - completed;
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Motivational message based on percentage
  const getMotivationalMessage = () => {
    if (total === 0) return "Ready to start your day? Add some tasks!";
    if (percentage === 0) return "Let's get some things done today!";
    if (percentage < 40) return "Great start! Keep the momentum going.";
    if (percentage < 70) return "You're doing fantastic! Over halfway there.";
    if (percentage < 100) return "Almost done! Just a few more to go.";
    return "Amazing! You completed all your tasks! 🎉";
  };

  return (
    <div id="todo-progress-container" className="bg-[#111113] rounded-2xl p-6 border border-white/5 mb-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 id="progress-heading" className="text-lg font-semibold text-zinc-100">Your Progress</h2>
          <p id="motivational-text" className="text-sm text-zinc-400 font-medium transition-all duration-300">
            {getMotivationalMessage()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-mono">{percentage}%</span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-800/50 h-2.5 rounded-full overflow-hidden mb-6 border border-white/5">
        <motion.div 
          id="progress-bar-fill"
          className="accent-gradient-bg h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-zinc-900 rounded-xl p-3 text-center border border-white/5 hover:border-zinc-800 transition-colors">
          <div className="flex justify-center mb-1 text-zinc-400">
            <ListTodo size={18} />
          </div>
          <span className="block text-lg font-bold text-zinc-200 font-mono">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Total</span>
        </div>

        <div className="bg-indigo-950/20 rounded-xl p-3 text-center border border-indigo-900/30 hover:border-indigo-800/40 transition-colors">
          <div className="flex justify-center mb-1 text-indigo-400">
            <Circle size={18} />
          </div>
          <span className="block text-lg font-bold text-indigo-300 font-mono">{active}</span>
          <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold">Active</span>
        </div>

        <div className="bg-emerald-950/20 rounded-xl p-3 text-center border border-emerald-900/30 hover:border-emerald-800/40 transition-colors">
          <div className="flex justify-center mb-1 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <span className="block text-lg font-bold text-emerald-300 font-mono">{completed}</span>
          <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold">Done</span>
        </div>

        <div className="bg-amber-950/20 rounded-xl p-3 text-center border border-amber-900/30 hover:border-amber-800/40 transition-colors">
          <div className="flex justify-center mb-1 text-amber-400">
            <Star size={18} />
          </div>
          <span className="block text-lg font-bold text-amber-300 font-mono">{starred}</span>
          <span className="text-[10px] uppercase tracking-wider text-amber-500 font-semibold">Starred</span>
        </div>
      </div>
    </div>
  );
}
