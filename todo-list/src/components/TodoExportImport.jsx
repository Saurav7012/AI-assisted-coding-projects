import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, CheckSquare, RefreshCw, AlertTriangle } from 'lucide-react';

export default function TodoExportImport({
  todos,
  onImportTodos,
  onClearCompleted,
  onMarkAllComplete,
  onResetApp,
  onAddToast
}) {
  const fileInputRef = useRef(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Export todos to JSON
  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todos, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `todo_list_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onAddToast("Backup exported successfully!", "success");
    } catch (err) {
      onAddToast("Failed to export backup", "error");
    }
  };

  // Import todos from JSON file
  const handleImport = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsedTodos = JSON.parse(event.target.result);
        if (Array.isArray(parsedTodos)) {
          // Basic validation of fields
          const validated = parsedTodos.map((item, idx) => ({
            id: item.id || `imported-${Date.now()}-${idx}`,
            title: item.title || 'Untitled imported task',
            description: item.description || '',
            completed: !!item.completed,
            priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
            category: item.category || 'Personal',
            dueDate: item.dueDate || '',
            starred: !!item.starred,
            createdAt: item.createdAt || Date.now()
          }));
          onImportTodos(validated);
          onAddToast(`Successfully imported ${validated.length} tasks!`, "success");
        } else {
          onAddToast("Invalid file format. Must be a JSON array of tasks.", "error");
        }
      } catch (error) {
        onAddToast("Failed to read JSON file. Corrupt backup.", "error");
      }
    };
    fileReader.readAsText(file);
    // Reset file value so same file can be imported again
    e.target.value = '';
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="todo-export-import-container" className="bg-[#111113] rounded-2xl p-5 border border-white/5 shadow-xl mt-6 flex flex-col gap-4">
      <h3 id="bulk-actions-heading" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Bulk Actions & Data Management
      </h3>

      {/* Main Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Quick Bulk Actions */}
        <div className="flex flex-col gap-2">
          <button
            id="mark-all-completed-btn"
            onClick={() => {
              onMarkAllComplete();
              onAddToast("All tasks marked as completed!", "success");
            }}
            disabled={todos.length === 0 || todos.every(t => t.completed)}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-950/20 text-zinc-300 hover:text-indigo-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 disabled:hover:text-zinc-300 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <CheckSquare size={14} />
            Mark All Completed
          </button>

          <button
            id="clear-completed-btn"
            onClick={() => {
              onClearCompleted();
              onAddToast("Cleared all completed tasks!", "success");
            }}
            disabled={todos.filter(t => t.completed).length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-rose-500/40 hover:bg-rose-950/20 text-zinc-300 hover:text-rose-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 disabled:hover:text-zinc-300 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            Clear Completed
          </button>
        </div>

        {/* Portability Controls */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              id="export-backup-btn"
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-3 py-2 border border-white/10 hover:border-indigo-500/40 hover:bg-[#18181b] text-zinc-300 hover:text-indigo-400 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Download backup"
            >
              <Download size={14} />
              Export
            </button>

            <button
              id="import-backup-btn"
              onClick={triggerImport}
              className="flex items-center justify-center gap-1.5 px-3 py-2 border border-white/10 hover:border-indigo-500/40 hover:bg-[#18181b] text-zinc-300 hover:text-indigo-400 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Upload backup"
            >
              <Upload size={14} />
              Import
            </button>
          </div>
          <input
            id="import-backup-file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />

          {/* Reset App */}
          {!showConfirmReset ? (
            <button
              id="reset-app-btn"
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 justify-center px-4 py-2 border border-rose-900/30 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              Reset To Demo Data
            </button>
          ) : (
            <div className="bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-xl flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-start gap-1.5 text-rose-400">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <span className="text-[10px] font-bold leading-normal">
                  Are you sure? This will delete all current tasks and load sample ones!
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  id="confirm-reset-app-btn"
                  onClick={() => {
                    onResetApp();
                    setShowConfirmReset(false);
                    onAddToast("App reset with sample data!", "success");
                  }}
                  className="bg-rose-700 hover:bg-rose-600 text-white rounded-lg py-1 px-2 text-[10px] font-bold transition-colors cursor-pointer text-center"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  id="cancel-reset-app-btn"
                  onClick={() => setShowConfirmReset(false)}
                  className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 rounded-lg py-1 px-2 text-[10px] font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
