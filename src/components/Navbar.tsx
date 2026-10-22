import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Menu, X, BookOpen, ExternalLink, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, mobileMenuOpen }) => {
  const { user, searchQuery, setSearchQuery, setCurrentView, subjects, gateList, tools, theme, toggleTheme } = useApp();
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  // Search filter
  const filteredSubjects = searchQuery.trim()
    ? subjects.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredGate = searchQuery.trim()
    ? gateList.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredTools = searchQuery.trim()
    ? tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const totalResults = filteredSubjects.length + filteredGate.length + filteredTools.length;

  return (
    <header className="h-16 bg-white dark:bg-[#111438] border-b border-slate-200/80 dark:border-slate-800 px-2.5 sm:px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile hamburger & Global Search input */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search subjects, topics, tools, PDFs..."
            className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all"
          />

          {/* Search Dropdown Modal */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-12 left-0 right-0 sm:right-auto sm:w-[480px] bg-white dark:bg-[#151945] border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-3 z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/80 text-xs font-semibold text-slate-400 uppercase">
                <span>Search Results ({totalResults})</span>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              {totalResults === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No matching subjects or resources found for "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {filteredSubjects.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-blue-600 uppercase px-2 mb-1">BOS Academic Subjects</div>
                      {filteredSubjects.map(sub => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            setCurrentView('bos');
                            setShowSearchResults(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50/70 cursor-pointer text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="font-semibold text-slate-800">{sub.name}</div>
                              <div className="text-[10px] text-slate-400">{sub.code} • Year {sub.year} Sem {sub.semester}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-blue-600 font-medium">View in BOS →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredGate.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-indigo-600 uppercase px-2 mb-1">GATE 2028 Subjects</div>
                      {filteredGate.map(g => (
                        <div
                          key={g.id}
                          onClick={() => {
                            setCurrentView('gate');
                            setShowSearchResults(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50/70 cursor-pointer text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-800">{g.name}</div>
                            <div className="text-[10px] text-slate-400">Weightage: {g.weightage}</div>
                          </div>
                          <span className="text-[10px] text-indigo-600 font-medium">View in GATE →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredTools.length > 0 && (
                    <div>
                      {filteredTools.map(tl => {
                        const hasUrl = !!tl.url && (tl.url.startsWith('http://') || tl.url.startsWith('https://'));
                        return hasUrl ? (
                          <a
                            key={tl.id}
                            href={tl.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setShowSearchResults(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50/70 text-xs"
                          >
                            <div>
                              <div className="font-semibold text-slate-800">{tl.name}</div>
                              <div className="text-[10px] text-slate-400">{tl.category}</div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </a>
                        ) : (
                          <button
                            key={tl.id}
                            type="button"
                            onClick={() => {
                              setCurrentView('simulation');
                              setShowSearchResults(false);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-left cursor-pointer transition"
                          >
                            <div>
                              <div className="font-semibold text-slate-800">{tl.name}</div>
                              <div className="text-[10px] text-slate-400">{tl.category} • <span className="text-amber-600 font-medium">Coming soon</span></div>
                            </div>
                            <span className="text-[10px] font-semibold text-blue-600">View →</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications & Profile pill */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 ml-2 sm:ml-4 flex-shrink-0">
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 min-w-[36px] min-h-[36px] rounded-xl border border-slate-200/80 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition flex items-center justify-center text-slate-600 dark:text-slate-300"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          )}
        </button>

        <button
          className="p-2 min-w-[36px] min-h-[36px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5" />
        </button>

        {/* User Pill */}
        <div 
          onClick={() => setCurrentView('profile')}
          className="flex items-center space-x-2 pl-1.5 sm:pl-2 py-1 pr-2 sm:pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition border border-slate-200/60 dark:border-slate-700"
          title="View Profile"
        >
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0 ${
            user?.role === 'admin' 
              ? 'bg-gradient-to-tr from-amber-600 to-rose-600' 
              : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
          }`}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {user?.name || 'Student'}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              user?.role === 'admin' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-cyan-400'
            }`}>
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
