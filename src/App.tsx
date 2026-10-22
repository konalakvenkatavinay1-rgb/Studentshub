import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { WelcomePage } from './components/WelcomePage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BosAcademicLibrary } from './components/BosAcademicLibrary';
import { GatePreparationView } from './components/GatePreparationView';
import { SimulationToolsView, NptelView, YouTubeView, BookmarksView, ProfileView } from './components/SecondaryViews';
import AcademicCalendar from './pages/AcademicCalendar';
import { TodoListView } from './components/TodoListView';

export const App: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in 'welcome' mode, render the public welcome entry point
  if (currentView === 'welcome') {
    return (
      <WelcomePage
        onEnter={() => setCurrentView('dashboard')}
        onNavigate={(view) => setCurrentView(view)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F1128] text-slate-900 dark:text-[#F8F9FA] flex transition-colors duration-200">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'academic-calendar' && <AcademicCalendar />}
          {currentView === 'bos' && <BosAcademicLibrary />}
          {currentView === 'gate' && <GatePreparationView />}
          {currentView === 'simulation' && <SimulationToolsView />}
          {currentView === 'nptel' && <NptelView />}
          {currentView === 'youtube' && <YouTubeView />}
          {currentView === 'planner' && <GatePreparationView />}
          {currentView === 'todo' && <TodoListView />}
          {currentView === 'bookmarks' && <BookmarksView />}
          {currentView === 'profile' && <ProfileView />}
        </main>
      </div>
    </div>
  );
};

export default App;
