import React from 'react';
import { useApp } from '../context/AppContext';
import type { HubView } from '../context/AppContext';
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Cpu,
  CalendarDays,
  ListTodo,
  Bookmark,
  Sparkles,
  Layers,
  Play,
  Lightbulb,
  ChevronRight,
  Rocket,
  Folder,
  Code2
} from 'lucide-react';
import './WelcomePage.css';

interface WelcomePageProps {
  onEnter?: () => void;
  onNavigate?: (view: HubView) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter, onNavigate }) => {
  const { setCurrentView } = useApp();

  // Instant direct navigation function
  const handleNav = (view: HubView = 'dashboard') => {
    if (onNavigate) {
      onNavigate(view);
    } else if (onEnter && view === 'dashboard') {
      onEnter();
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="cosmic-hub-root relative w-full overflow-hidden select-none">
      {/* =========================================================================
          1. COSMIC NEBULAE & SUNSET TWILIGHT GLOWS
          ========================================================================= */}
      <div className="cosmic-nebula nebula-top-cyan" />
      <div className="cosmic-nebula nebula-top-magenta" />
      <div className="cosmic-nebula nebula-center-ring" />
      <div className="sunset-horizon-wash" />

      {/* Luminous Cosmic Dual Energy Rings */}
      <div className="cosmic-ring-outer" />
      <div className="cosmic-ring-inner" />

      {/* =========================================================================
          2. TOP NAVIGATION HEADER
          ========================================================================= */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Department Title */}
        <div
          onClick={() => handleNav('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/40 border border-white/30 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base sm:text-lg tracking-tight block drop-shadow-md">
              Student Learning Hub
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-cyan-300 -mt-0.5 block tracking-wide">
              Department of Electronics & Communication Engineering
            </span>
          </div>
        </div>

        {/* Center Status Pill */}
        <div className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-950/75 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Public Academic Portal • Open to All Students</span>
        </div>

        {/* Right Navigation Links & Enter CTA */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-5 text-xs font-bold text-slate-300">
            <button
              onClick={() => handleNav('bos')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Learn
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNav('simulation')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Explore
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNav('gate')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Build
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNav('planner')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Grow
            </button>
          </nav>

          <button
            id="header-enter-hub-btn"
            onClick={() => handleNav('dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 transition shadow-lg shadow-pink-500/30 border border-white/30 cursor-pointer"
          >
            <span>Enter Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          3. MAIN HERO STAGE & FLANKING CARD WINGS (LEFT, CENTER, RIGHT)
          ========================================================================= */}
      <main className="relative z-20 flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 pt-2 pb-4 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* ------------------- LEFT WING CARDS ------------------- */}
          <div className="hidden xl:flex flex-col gap-3 w-[295px] shrink-0 z-20">
            {/* Card 1: YouTube Resources */}
            <div
              onClick={() => handleNav('youtube')}
              className="cosmic-glass-card card-red cosmic-float-1 p-3.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/40 group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">YouTube Resources</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Signals, VLSI & Embedded Playlists</p>
            </div>

            {/* Card 2: BOS Materials */}
            <div
              onClick={() => handleNav('bos')}
              className="cosmic-glass-card card-cyan cosmic-float-2 p-3.5 group cursor-pointer ml-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                  <Folder className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">BOS Materials</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">All 8 Semesters Syllabi & Notes</p>
            </div>

            {/* Card 3: GATE 2028 Preparation */}
            <div
              onClick={() => handleNav('gate')}
              className="cosmic-glass-card card-violet cosmic-float-3 p-3.5 group cursor-pointer ml-1"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-700 text-white flex items-center justify-center shadow-md shadow-violet-500/40 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">GATE 2028 Preparation</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">65 Topics, PYQ Trackers & Strategy</p>
            </div>

            {/* Card 4: Academic Calendar */}
            <div
              onClick={() => handleNav('academic-calendar')}
              className="cosmic-glass-card card-amber cosmic-float-4 p-3.5 group cursor-pointer ml-4"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/40 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">Academic Calendar</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Semester Milestones & Exam Dates</p>
            </div>
          </div>

          {/* ------------------- CENTER STAGE ------------------- */}
          <div className="flex-1 max-w-2xl mx-auto text-center space-y-3.5 relative z-10 px-2">
            {/* Mobile Badge */}
            <div className="inline-block lg:hidden">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-950/70 text-cyan-300 border border-cyan-500/40">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Public Academic Portal
              </span>
            </div>

            <h1 className="cosmic-hero-heading">
              One Connected <br />
              <span className="cosmic-gradient-span">Academic Ecosystem</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Explore all 8 semesters of BOS curriculum materials, GATE 2028 preparation tracks,
              interactive simulation tools, academic calendar, study planner and much more — all in one place.
            </p>

            {/* Large Central Glowing "Enter Student Learning Hub" Button */}
            <div className="pt-2 pb-1 flex justify-center">
              <button
                id="enter-student-learning-hub"
                onClick={() => handleNav('dashboard')}
                className="cosmic-enter-btn group cursor-pointer"
              >
                <Rocket className="w-5 h-5 text-cyan-300 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
                <span>Enter Student Learning Hub</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-2" />
              </button>
            </div>

            {/* 4-Pillar Glass Dock (Beneath Main Button) */}
            <div className="pt-1 flex justify-center">
              <div className="cosmic-four-dock p-2 flex items-center gap-1 sm:gap-4 text-xs font-bold text-slate-200">
                <button
                  onClick={() => handleNav('bos')}
                  className="cosmic-dock-btn hover:text-cyan-300"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Learn Better</span>
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => handleNav('simulation')}
                  className="cosmic-dock-btn hover:text-amber-300"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Explore Deeper</span>
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => handleNav('gate')}
                  className="cosmic-dock-btn hover:text-violet-300"
                >
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span>Build Skills</span>
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => handleNav('planner')}
                  className="cosmic-dock-btn hover:text-emerald-300"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Grow Further</span>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------- RIGHT WING CARDS ------------------- */}
          <div className="hidden xl:flex flex-col gap-3 w-[295px] shrink-0 z-20">
            {/* Card 1: Simulation Tools */}
            <div
              onClick={() => handleNav('simulation')}
              className="cosmic-glass-card card-blue cosmic-float-2 p-3.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/40 group-hover:scale-110 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">Simulation Tools</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">14 Virtual Labs & Maths Lab</p>
            </div>

            {/* Card 2: Study Planner & Todo List */}
            <div
              onClick={() => handleNav('planner')}
              className="cosmic-glass-card card-emerald cosmic-float-1 p-3.5 group cursor-pointer mr-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                  <ListTodo className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">Study Planner & Todo List</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Daily Goals, Task Checklists & Streaks</p>
            </div>

            {/* Card 3: Bookmarks & Notes */}
            <div
              onClick={() => handleNav('bookmarks')}
              className="cosmic-glass-card card-magenta cosmic-float-4 p-3.5 group cursor-pointer mr-1"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-fuchsia-600 text-white flex items-center justify-center shadow-md shadow-pink-500/40 group-hover:scale-110 transition-transform">
                  <Bookmark className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">Bookmarks & Notes</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Instant Access to Saved Resources</p>
            </div>

            {/* Card 4: and Beyond... */}
            <div
              onClick={() => handleNav('nptel')}
              className="cosmic-glass-card card-indigo cosmic-float-3 p-3.5 group cursor-pointer mr-4"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/40 group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">and Beyond...</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">NPTEL, Projects & Faculty Hub</p>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Stacked Cards */}
        <div className="block xl:hidden mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleNav('bos')}
            className="cosmic-glass-card card-cyan p-3 rounded-xl text-left cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
                <Folder className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">BOS Materials</div>
                <div className="text-[10px] text-cyan-200">8 Semesters Curricula</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => handleNav('gate')}
            className="cosmic-glass-card card-violet p-3 rounded-xl text-left cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">GATE 2028</div>
                <div className="text-[10px] text-violet-200">65 Topics & PYQs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-violet-400" />
          </button>

          <button
            onClick={() => handleNav('simulation')}
            className="cosmic-glass-card card-blue p-3 rounded-xl text-left cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">Simulation Tools</div>
                <div className="text-[10px] text-blue-200">14 Virtual Labs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </button>

          <button
            onClick={() => handleNav('planner')}
            className="cosmic-glass-card card-emerald p-3 rounded-xl text-left cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <ListTodo className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">Study Planner</div>
                <div className="text-[10px] text-emerald-200">Tasks & Streaks</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* =========================================================================
            4. SUNSET CITY SKYLINE, SCHOLAR ILLUSTRATION & STUDENT LEARNING HUB
            ========================================================================= */}
        <div className="relative w-full h-[180px] sm:h-[220px] mt-2 overflow-hidden rounded-3xl pointer-events-none">
          <svg
            viewBox="0 0 1440 220"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1346" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ff7043" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffd54f" stopOpacity="0.65" />
              </linearGradient>

              <linearGradient id="cityBuildings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#251b54" />
                <stop offset="100%" stopColor="#0b0e26" />
              </linearGradient>

              <linearGradient id="neonSignGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00D9FF" />
                <stop offset="50%" stopColor="#E638FF" />
                <stop offset="100%" stopColor="#245BFF" />
              </linearGradient>
            </defs>

            {/* Sunset Sun & Warm Glow */}
            <circle cx="680" cy="180" r="120" fill="url(#sunsetSky)" opacity="0.85" />
            <circle cx="680" cy="180" r="50" fill="#FFE082" opacity="0.9" filter="blur(15px)" />

            {/* City Skyline Silhouettes */}
            <path
              d="M0,220 L0,170 L50,170 L50,140 L80,140 L80,180 L140,180 L140,110 L180,110 L180,190 L250,190 L250,130 L290,130 L290,200 L380,200 L380,120 L440,120 L440,210 L550,210 L550,100 L590,100 L590,190 L660,190 L660,150 L720,150 L720,200 L820,200 L820,110 L860,110 L860,180 L950,180 L950,130 L990,130 L990,190 L1100,190 L1100,90 L1160,90 L1160,170 L1260,170 L1260,120 L1300,120 L1300,220 Z"
              fill="url(#cityBuildings)"
            />

            {/* Building Windows */}
            <rect x="155" y="125" width="4" height="6" rx="1" fill="#FFD166" opacity="0.9" />
            <rect x="165" y="125" width="4" height="6" rx="1" fill="#00D9FF" opacity="0.9" />
            <rect x="155" y="140" width="4" height="6" rx="1" fill="#E638FF" opacity="0.8" />
            <rect x="565" y="115" width="5" height="7" rx="1" fill="#00D9FF" opacity="0.9" />
            <rect x="575" y="115" width="5" height="7" rx="1" fill="#FFD166" opacity="0.9" />
            <rect x="835" y="125" width="4" height="6" rx="1" fill="#E638FF" opacity="0.9" />

            {/* Left Balcony Railing with Dream Learn Achieve */}
            <path d="M0,200 L450,200 L450,220 L0,220 Z" fill="#0b0e26" />

            {/* Student Silhouette sitting on ledge with laptop & backpack */}
            <g transform="translate(420, 120)">
              {/* Backpack */}
              <ellipse cx="20" cy="55" rx="14" ry="18" fill="#1b1542" />
              {/* Torso & Hoodie */}
              <path d="M26,38 Q42,32 50,48 L56,80 L22,80 Z" fill="#2d2260" />
              {/* Head */}
              <circle cx="48" cy="24" r="12" fill="#1b1542" />
              {/* Laptop Screen & Glow */}
              <polygon points="70,55 95,45 92,68 67,78" fill="#38bdf8" opacity="0.95" />
              <polygon points="65,77 92,68 100,75 73,84" fill="#0284c7" />
              {/* Books Stack */}
              <rect x="-10" y="70" width="28" height="6" rx="2" fill="#f43f5e" />
              <rect x="-8" y="64" width="24" height="6" rx="2" fill="#06b6d4" />
              <rect x="-6" y="58" width="20" height="6" rx="2" fill="#8b5cf6" />
            </g>

            {/* Right Illuminated University Building with Neon Marquee */}
            <g transform="translate(1080, 80)">
              <rect
                x="0"
                y="0"
                width="320"
                height="140"
                rx="14"
                fill="#101438"
                stroke="url(#neonSignGrad)"
                strokeWidth="3"
              />
              {/* Large Neon Sign */}
              <rect
                x="15"
                y="15"
                width="290"
                height="75"
                rx="10"
                fill="#070a22"
                stroke="#FFD166"
                strokeWidth="1.5"
              />
              <text
                x="160"
                y="46"
                textAnchor="middle"
                fill="#FFD166"
                fontSize="18"
                fontWeight="900"
                letterSpacing="3"
                filter="drop-shadow(0 0 10px rgba(255, 209, 102, 0.9))"
              >
                STUDENT
              </text>
              <text
                x="160"
                y="72"
                textAnchor="middle"
                fill="#00D9FF"
                fontSize="18"
                fontWeight="900"
                letterSpacing="3"
                filter="drop-shadow(0 0 12px rgba(0, 217, 255, 0.9))"
              >
                LEARNING HUB
              </text>

              {/* Lit Architecture Windows on building */}
              <rect x="25" y="100" width="40" height="25" rx="3" fill="#00D9FF" opacity="0.75" />
              <rect x="80" y="100" width="40" height="25" rx="3" fill="#E638FF" opacity="0.75" />
              <rect x="135" y="100" width="40" height="25" rx="3" fill="#FFD166" opacity="0.75" />
              <rect x="190" y="100" width="40" height="25" rx="3" fill="#00D9FF" opacity="0.75" />
              <rect x="245" y="100" width="40" height="25" rx="3" fill="#E638FF" opacity="0.75" />
            </g>
          </svg>

          {/* Dream Learn Achieve Cursive Script on left */}
          <div className="absolute bottom-6 left-8 sm:left-14 dream-script-text">
            <div>Dream</div>
            <div className="-mt-1">Learn</div>
            <div className="-mt-1">Achieve</div>
          </div>
        </div>

        {/* =========================================================================
            5. WIDE LUMINOUS BOTTOM PANEL (7 ACADEMIC CATEGORIES)
            ========================================================================= */}
        <div className="mt-2 w-full">
          <div className="cosmic-bottom-panel p-3 sm:p-3.5">
            <div className="text-center text-[11px] font-extrabold uppercase tracking-widest text-cyan-300/90 mb-2.5 flex items-center justify-center gap-3">
              <span className="w-12 h-px bg-cyan-500/40" />
              <span>Curated Academic Pillars for Engineering Excellence</span>
              <span className="w-12 h-px bg-cyan-500/40" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleNav('bos')}
                className="cosmic-pillar-btn hover:border-cyan-400 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>BOS Academic Library</span>
              </button>

              <button
                onClick={() => handleNav('gate')}
                className="cosmic-pillar-btn hover:border-violet-400 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <span>GATE 2028 Preparation</span>
              </button>

              <button
                onClick={() => handleNav('simulation')}
                className="cosmic-pillar-btn hover:border-blue-400 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Interactive Simulation Tools</span>
              </button>

              <button
                onClick={() => handleNav('academic-calendar')}
                className="cosmic-pillar-btn hover:border-amber-400 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <span>Academic Calendar</span>
              </button>

              <button
                onClick={() => handleNav('planner')}
                className="cosmic-pillar-btn hover:border-emerald-400 cursor-pointer"
              >
                <ListTodo className="w-4 h-4 text-emerald-400" />
                <span>Study Planner & Todo List</span>
              </button>

              <button
                onClick={() => handleNav('bookmarks')}
                className="cosmic-pillar-btn hover:border-pink-400 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-pink-400" />
                <span>Bookmarks & Notes</span>
              </button>

              <button
                onClick={() => handleNav('youtube')}
                className="cosmic-pillar-btn hover:border-red-400 cursor-pointer"
              >
                <Play className="w-4 h-4 text-red-400 fill-current" />
                <span>YouTube Resources</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
