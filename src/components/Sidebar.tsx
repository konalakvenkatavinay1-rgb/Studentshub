import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Home,
  BookOpen,
  TrendingUp,
  Cpu,
  Tv,
  Bookmark as BookmarkIcon,
  User,
  Settings,
  Sparkles,
  CalendarDays,
  ListTodo,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, bookmarks, tasks, todoNotes, theme, toggleTheme } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'bos', label: 'BOS', icon: BookOpen },
    { id: 'gate', label: 'GATE 2028', icon: TrendingUp },
    { id: 'simulation', label: 'Simulation Tools', icon: Cpu },
    { id: 'nptel', label: 'NPTEL', icon: Tv },
    { id: 'youtube', label: 'YouTube Resources', icon: Tv },
    { id: 'academic-calendar', label: 'Academic Calendar', icon: CalendarDays },
    { id: 'planner', label: 'Study Planner', icon: CalendarDays, badge: tasks.filter(t => !t.completed).length },
    { id: 'todo', label: 'Todo List', icon: ListTodo, badge: todoNotes.filter(n => !n.is_completed).length },
    { id: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon, badge: bookmarks.length },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-[#111438] border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 shadow-xl lg:shadow-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">Student Hub</span>
        </div>

        {/* Mobile-only Close X Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <span className="text-xl font-bold leading-none">×</span>
          </button>
        )}
      </div>

      {/* Nav list */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom utility */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        <button
          onClick={() => handleNavClick('profile')}
          className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => handleNavClick('welcome')}
          className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
          title="Return to Welcome Page"
        >
          <Sparkles className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
          <span>Welcome Page</span>
        </button>
      </div>
    </aside>
  );
};
