import React from 'react';
import { Search, SlidersHorizontal, Calendar, X, AlertCircle } from 'lucide-react';

export default function TodoFilters({
  search,
  setSearch,
  tab,
  setTab,
  category,
  setCategory,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  categories
}) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'starred', label: 'Starred' }
  ];

  return (
    <div id="todo-filters-container" className="bg-[#111113] rounded-2xl p-5 border border-white/5 mb-6 shadow-xl flex flex-col gap-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
            <Search size={18} />
          </span>
          <input
            id="todo-search-input"
            type="text"
            className="w-full pl-10 pr-9 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-100 font-medium input-dark-focus"
            placeholder="Search tasks, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              id="clear-search-btn"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="todo-sort-select" className="text-xs font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap hidden sm:inline">
            Sort By
          </label>
          <select
            id="todo-sort-select"
            className="px-3 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-300 font-medium cursor-pointer input-dark-focus"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt-desc">Newest Added</option>
            <option value="createdAt-asc">Oldest Added</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="title-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="border-t border-white/5 pt-3 flex flex-col gap-3">
        {/* Tabs and Advanced Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick Filter Tabs */}
          <div className="flex bg-[#18181b] p-1 rounded-xl border border-white/5">
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`filter-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tab === t.id
                    ? 'bg-zinc-800 text-white border border-white/5 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick Badges indicators / Resets */}
          {(category !== 'all' || priority !== 'all') && (
            <button
              id="clear-all-filters-btn"
              onClick={() => {
                setCategory('all');
                setPriority('all');
              }}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Secondary Category & Priority Select Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs">
              <SlidersHorizontal size={14} />
            </span>
            <select
              id="filter-category-select"
              className="w-full px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium cursor-pointer input-dark-focus"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs">
              <AlertCircle size={14} />
            </span>
            <select
              id="filter-priority-select"
              className="w-full px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium cursor-pointer input-dark-focus"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">🔥 High Priority</option>
              <option value="medium">⚡ Medium Priority</option>
              <option value="low">💤 Low Priority</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
