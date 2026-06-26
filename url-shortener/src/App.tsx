import React, { useState, useEffect } from "react";
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  Database, 
  AlertTriangle, 
  Sparkles, 
  Info,
  RefreshCw,
  Search
} from "lucide-react";

// interface for our shortened URL object
interface ShortenedUrl {
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
}

// interface for database status info
interface DbStatus {
  isUsingMongoDB: boolean;
  dbError: string | null;
  uriConfigured: boolean;
}

export default function App() {
  // --- STATE VARIABLES (Where React holds our data) ---
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus>({
    isUsingMongoDB: false,
    dbError: null,
    uriConfigured: false
  });
  
  // UI states for loading, errors, and success feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showDbInfo, setShowDbInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- EFFECT HOOK (Runs when the component loads) ---
  useEffect(() => {
    fetchUrls();
    fetchDbStatus();
  }, []);

  // --- API CALLS (Interacting with our Node.js backend) ---

  // 1. Fetch all shortened URLs from backend
  const fetchUrls = async () => {
    try {
      const response = await fetch("/api/urls");
      if (response.ok) {
        const data = await response.json();
        setUrls(data);
      } else {
        console.error("Failed to fetch URLs");
      }
    } catch (err) {
      console.error("Network error while fetching URLs:", err);
    }
  };

  // 2. Check the database connection status
  const fetchDbStatus = async () => {
    try {
      const response = await fetch("/api/db-status");
      if (response.ok) {
        const data = await response.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.error("Error fetching db status:", err);
    }
  };

  // 3. Handle Form Submission to shorten a URL
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessCode(null);

    // Basic Validation
    if (!longUrl.trim()) {
      setError("Please enter a valid URL to shorten.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: longUrl.trim(),
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Success!
        setSuccessCode(data.shortCode);
        setLongUrl("");
        setCustomCode("");
        fetchUrls(); // Refresh the list of URLs
      } else {
        // Handle backend error messages
        setError(data.error || "An error occurred while shortening the URL.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle deleting a shortened URL
  const handleDelete = async (code: string) => {
    if (!window.confirm(`Are you sure you want to delete the short URL /s/${code}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/urls/${code}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from UI state directly for instant feedback
        setUrls(urls.filter((url) => url.shortCode !== code));
        if (successCode === code) {
          setSuccessCode(null);
        }
      } else {
        alert("Failed to delete the URL.");
      }
    } catch (err) {
      console.error("Error deleting URL:", err);
    }
  };

  // --- HELPER UTILITIES ---

  // Generates the full redirect URL to show/copy
  const getFullShortUrl = (code: string) => {
    return `${window.location.origin}/s/${code}`;
  };

  // Safe Copy-to-Clipboard function with an alternative fallback
  const handleCopy = async (code: string) => {
    const fullUrl = getFullShortUrl(code);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        // Fallback for browsers or sandboxed iframes restricting clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      
      // Show "Copied!" feedback state
      setCopiedCode(code);
      // setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Filter URLs based on search query
  const filteredUrls = urls.filter(url => 
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.longUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-16">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100">
              <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
                <LinkIcon className="w-3 h-3 text-white -rotate-45" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Trimly
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-widest">
                  Beginner
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Node, Express, React, and MongoDB app</p>
            </div>
          </div>

          {/* Database Status Pill */}
          <div className="flex items-center gap-2">
            <button 
              id="db-status-btn"
              onClick={() => setShowDbInfo(!showDbInfo)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer border transition-all uppercase tracking-wider ${
                dbStatus.isUsingMongoDB 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-sm" 
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-sm"
              }`}
              title="Click to learn about database setup"
            >
              <Database className={`w-3.5 h-3.5 ${dbStatus.isUsingMongoDB ? "text-emerald-600" : "text-amber-600"}`} />
              <span>{dbStatus.isUsingMongoDB ? "MongoDB: Connected" : "Local Demo Mode"}</span>
              <Info className="w-3 h-3 opacity-60 ml-0.5" />
            </button>
            
            <button 
              id="refresh-btn"
              onClick={() => { fetchUrls(); fetchDbStatus(); }} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white shadow-sm"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* HERO HEADER */}
        <div className="text-center my-6 sm:my-10">
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest border border-indigo-200 shadow-sm">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Geometric Balance
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Shorten your links,<br/><span className="text-indigo-600">expand your reach.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            A simple, beginner-friendly URL shortener built with Node.js and MongoDB. Fast redirection, zero bloat.
          </p>
        </div>

        {/* DATABASE SETUP INFORMATION GUIDE */}
        {showDbInfo && (
          <div id="db-info-panel" className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 shadow-lg shadow-indigo-100/50 relative animate-fadeIn">
            <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2 mb-2 uppercase tracking-wider">
              <Database className="w-4 h-4 text-indigo-700" />
              Database Connection Guide
            </h3>
            <p className="text-xs text-indigo-800 mb-3 leading-relaxed">
              This URL Shortener is configured with a hybrid storage engine:
            </p>
            <ul className="list-disc pl-5 text-xs text-indigo-800 space-y-1.5 mb-3 leading-relaxed">
              <li>
                <strong>Local Demo Mode (Active):</strong> Saves links in the server's temporary RAM. Perfect for testing instantly! Links will reset whenever the server restarts.
              </li>
              <li>
                <strong>MongoDB Mode:</strong> Connects to your real database to persist links permanently.
              </li>
            </ul>
            <div className="bg-white/80 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900">
              <p className="font-semibold mb-1">To connect MongoDB:</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                <li>Create a database cluster on <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold">MongoDB Atlas</a> (Free tier).</li>
                <li>Copy your connection URI (looks like <code>mongodb+srv://username:password@cluster...</code>).</li>
                <li>Go to the <strong>Secrets Panel</strong> in AI Studio and add a variable named <strong>MONGODB_URI</strong>.</li>
                <li>The server will automatically detect the key and switch to durable MongoDB storage!</li>
              </ol>
            </div>
            {dbStatus.dbError && (
              <div className="mt-3 bg-rose-50 border border-rose-200 rounded-lg p-2 text-xs text-rose-800 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Connection Error:</strong> {dbStatus.dbError}</span>
              </div>
            )}
            <button 
              id="close-db-info"
              onClick={() => setShowDbInfo(false)} 
              className="absolute top-4 right-4 text-xs text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* URL SHORTENING MAIN FORM */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-indigo-100/40">
          <form onSubmit={handleShorten} className="space-y-5 max-w-2xl mx-auto">
            {/* Input 1: The Long Destination URL */}
            <div>
              <label htmlFor="long-url-input" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Enter your long destination URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  id="long-url-input"
                  type="text"
                  placeholder="Paste your long URL here (e.g. https://github.com/beginner-projects)"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 font-medium text-slate-800"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Input 2: Custom Alias (Optional) */}
            <div>
              <label htmlFor="custom-code-input" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Custom Short Name <span className="text-slate-300 text-[10px] font-normal lowercase">(Optional)</span>
              </label>
              <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 border-r border-slate-200 text-xs sm:text-sm select-none font-mono">
                  {window.location.host}/s/
                </span>
                <input
                  id="custom-code-input"
                  type="text"
                  placeholder="e.g. guide"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="block w-full px-4 py-3.5 bg-transparent text-sm focus:outline-none placeholder:text-slate-300 font-mono text-slate-800"
                  disabled={isLoading}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Custom codes can only contain letters, numbers, hyphens, and underscores.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div id="error-alert" className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="shorten-submit-btn"
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Shortening Link...
                </>
              ) : (
                "Shorten Now"
              )}
            </button>
          </form>

          {/* ACTIVE SUCCESS DISPLAY */}
          {successCode && (
            <div id="success-panel" className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 animate-fadeIn">
              <div className="flex items-center gap-2 mb-3 text-emerald-800">
                <div className="bg-emerald-500 text-white p-1 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Link shortened successfully!</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-emerald-100 rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Your shortened URL</p>
                  <a 
                    href={getFullShortUrl(successCode)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-indigo-600 hover:underline font-bold text-sm sm:text-base break-all flex items-center gap-1.5"
                  >
                    {getFullShortUrl(successCode)}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                  </a>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="copy-success-btn"
                    onClick={() => handleCopy(successCode)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedCode === successCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <a
                    id="visit-success-btn"
                    href={getFullShortUrl(successCode)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors text-center"
                  >
                    Open Link
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RECENT LINKS LIST */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          {/* List Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Shortened URLs Log</h3>
              <p className="text-xs text-slate-400 font-medium">Track clicks and manage redirect endpoints</p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search-links-input"
                type="text"
                placeholder="Search codes or links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* List Body */}
          {filteredUrls.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                <LinkIcon className="w-6 h-6 text-slate-300" />
              </div>
              <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">No links found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                {searchQuery 
                  ? "We couldn't find any URLs matching your search query." 
                  : "Start by entering a long web address above to create your very first shortened link!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-3.5">Short Code</th>
                    <th className="px-6 py-3.5">Original Destination</th>
                    <th className="px-6 py-3.5 text-center">Clicks</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUrls.map((url) => (
                    <tr id={`url-row-${url.shortCode}`} key={url.shortCode} className="hover:bg-slate-50/50 transition-colors">
                      {/* 1. Short code details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <span className="text-slate-400 font-normal">/s/</span>
                          <span className="text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded text-xs select-all font-mono">
                            {url.shortCode}
                          </span>
                        </div>
                        <a 
                          href={getFullShortUrl(url.shortCode)}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-indigo-600 hover:underline flex items-center gap-0.5 mt-1 font-bold uppercase tracking-wider"
                        >
                          Visit redirect
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>

                      {/* 2. Destination */}
                      <td className="px-6 py-4 max-w-xs sm:max-w-sm md:max-w-md">
                        <div className="truncate text-xs font-semibold text-slate-600" title={url.longUrl}>
                          {url.longUrl}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          Created {new Date(url.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                      </td>

                      {/* 3. Click analytics */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
                          {url.clicks} clicks
                        </span>
                      </td>

                      {/* 4. Actions: Copy / Delete */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link Button */}
                          <button
                            id={`copy-btn-${url.shortCode}`}
                            onClick={() => handleCopy(url.shortCode)}
                            className={`p-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                              copiedCode === url.shortCode
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                            }`}
                            title="Copy short link"
                          >
                            {copiedCode === url.shortCode ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            id={`delete-btn-${url.shortCode}`}
                            onClick={() => handleDelete(url.shortCode)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer shadow-sm"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* BOTTOM RECENT ACTIVITY DIVIDER & METRICS GRID */}
        <div className="w-full mt-12 pt-6">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Live Workspace Performance</h3>
            <div className="h-px flex-1 mx-4 bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <p className="font-black text-slate-900 text-lg">Under 15ms</p>
              <p className="text-[10px] text-slate-400 mt-1">AVG. REDIRECT SPEED</p>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <p className="font-black text-indigo-600 text-lg">{urls.length}</p>
              <p className="text-[10px] text-slate-400 mt-1">TOTAL LINKS GENERATED</p>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <p className="font-black text-emerald-600 text-lg">
                {dbStatus.isUsingMongoDB ? "MONGODB ATLAS" : "IN-MEMORY MEMORY"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">ACTIVE DATABASE STORAGE</p>
            </div>
          </div>
        </div>

      </main>


      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-6 mt-12 text-center text-xs text-slate-400 space-y-2 border-t border-slate-200 pt-8 uppercase tracking-widest font-bold">
        <p>Built for the Fullstack Beginner Program &copy; {new Date().getFullYear()}</p>
        <p className="font-mono text-[9px] opacity-70">React 19 &bull; Express 4 &bull; Mongoose &bull; Tailwind CSS v4</p>
      </footer>
    </div>
  );
}

