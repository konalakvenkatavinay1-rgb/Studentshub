import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  TrendingUp,
  Cpu,
  Tv,
  Video,
  ArrowRight,
  FileText,
  Flame,
  ExternalLink,
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Sparkles,
  Award,
  StickyNote,
  X
} from 'lucide-react';
import { StudyTimerModal } from './StudyTimerModal';

export const DashboardView: React.FC = () => {
  const {
    user,
    setCurrentView,
    subjects,
    gateList,
    completedBosSubjectIds,
    tasks,
    toggleTask,
    updateTaskNotes,
    currentStreak,
    bestStreak,
    activeToday,
    todayStudyMinutes,
    remainingMinutesToday,
    dailyStreakGoalMinutes,
    last7DaysActivity,
    studyActivities,
    logStudySession,
    tools
  } = useApp();

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [editingTaskNotesId, setEditingTaskNotesId] = useState<string | null>(null);
  const [activeNotesText, setActiveNotesText] = useState('');

  // BOS Metrics
  const completedBosCount = completedBosSubjectIds.length;
  const totalBosCount = subjects.length || 30;
  const bosPercent = totalBosCount > 0 ? Math.round((completedBosCount / totalBosCount) * 100) : 0;

  // GATE Metrics
  const completedGateCount = gateList.reduce((acc, curr) => acc + curr.completedTopics, 0);
  const totalGateCount = gateList.reduce((acc, curr) => acc + curr.topicsCount, 0) || 65;
  const gatePercent = totalGateCount > 0 ? Math.round((completedGateCount / totalGateCount) * 100) : 0;

  // Pending tasks for today
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  const subjectNames = subjects.map(s => s.name);

  const handleTimerSave = (subject: string, elapsedMinutes: number, notes?: string) => {
    logStudySession(subject, elapsedMinutes, notes);
  };

  const openTaskNotes = (taskId: string, currentNotes: string) => {
    setEditingTaskNotesId(taskId);
    setActiveNotesText(currentNotes || '');
  };

  const saveTaskNotes = () => {
    if (editingTaskNotesId) {
      updateTaskNotes(editingTaskNotesId, activeNotesText);
      setEditingTaskNotesId(null);
      setActiveNotesText('');
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner with Date & Fast Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=80')`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>{todayFormatted}</span>
            <span>•</span>
            <span className="flex items-center text-emerald-300">
              {activeToday ? '🔥 Active Today' : '⏳ Pending Today\'s Study'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-blue-100/80 text-xs md:text-sm mt-1 max-w-xl">
            Track your real curriculum progress, study streak, and ECE exam preparation in one unified workspace.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3">
          <button
            onClick={() => setShowTimerModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/25 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Study Session</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards: BOS, GATE, Study Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Metric 1: BOS Academic Progress */}
        <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                {bosPercent}% Done
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">BOS Academic Progress</h3>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{completedBosCount}</span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">/ {totalBosCount} Subjects</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(bosPercent, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {completedBosCount === 0
                ? 'No subjects marked completed yet. Open BOS library to track completed courses.'
                : `${completedBosCount} of ${totalBosCount} academic subjects verified.`}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('bos')}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center justify-between group"
          >
            <span>View BOS Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Metric 2: GATE 2028 Preparation */}
        <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                {gatePercent}% Covered
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">GATE 2028 Preparation</h3>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{completedGateCount}</span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">/ {totalGateCount} Topics</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(gatePercent, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {completedGateCount === 0
                ? 'Target: 65 ECE syllabus topics. Update topics as you prepare.'
                : `${completedGateCount} topics mastered across 9 core ECE GATE sections.`}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('gate')}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center justify-between group"
          >
            <span>View GATE Tracker</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Metric 3: Study Streak & Consistency */}
        <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-500/50 transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 flex items-center space-x-1">
                <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Best: {bestStreak}d</span>
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Study Streak</h3>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{currentStreak}</span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Consecutive Days</span>
            </div>

            {/* Today's 60-min Progress */}
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                <span className="text-amber-800 dark:text-amber-300">Today's Study Time</span>
                <span className="text-amber-600 dark:text-amber-400">
                  {todayStudyMinutes} / {dailyStreakGoalMinutes} min
                </span>
              </div>
              <div className="w-full bg-amber-100 dark:bg-amber-900/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.round((todayStudyMinutes / dailyStreakGoalMinutes) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] mt-1 font-medium">
                {remainingMinutesToday > 0 ? (
                  <span className="text-amber-700 dark:text-amber-300">{remainingMinutesToday} min left for today's streak</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">Daily 60m goal achieved! 🔥</span>
                )}
              </p>
            </div>

            {/* 7-Day Consistency Dot Trail */}
            <div className="flex items-center justify-between mt-3 px-1 py-1.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
              {last7DaysActivity.map((day) => (
                <div key={day.date} className="flex flex-col items-center">
                  <span className="text-[9px] font-semibold text-slate-400 mb-1">{day.dayLabel[0]}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                      day.active
                        ? 'bg-amber-500 text-white shadow-xs'
                        : day.isToday
                        ? 'border-2 border-dashed border-amber-400 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                    title={`${day.date}: ${day.minutes} min${day.active ? ' ≥60 ✓' : ''}`}
                  >
                    {day.active ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {currentStreak === 0
                ? 'Study ≥60 min today to start a streak.'
                : activeToday
                ? 'Streak active today! Keep the momentum going tomorrow.'
                : 'Study ≥60 min today to maintain your current streak.'}
            </p>
          </div>
          <button
            onClick={() => setShowTimerModal(true)}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center justify-between group"
          >
            <span>+ Log Study Activity</span>
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 columns has Hero Cards, Today's Tasks & Quick Access; Right has Resources & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Two Hero Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1: BOS Academic Library */}
            <div className="bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 dark:from-[#181B44] dark:via-[#1B1E4A] dark:to-[#13163A] rounded-3xl p-6 border border-blue-100 dark:border-[#2B3070] shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-[#3E4592] transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-rose-500/15 text-blue-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6 text-blue-700 dark:text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">BOS Academic Library</h2>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
                  Year-wise and semester-wise study materials, notes, official syllabus, and curriculum resources.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('bos')}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-[#D21319] dark:hover:bg-[#E0242A] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition active:scale-[0.99]"
              >
                <span>Go to BOS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: GATE 2028 Preparation */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 dark:from-[#181B44] dark:via-[#1B1E4A] dark:to-[#13163A] rounded-3xl p-6 border border-indigo-100 dark:border-[#2B3070] shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-[#3E4592] transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">GATE 2028 Preparation</h2>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
                  ECE syllabus breakdown, subject notes, previous year questions (PYQs), strategy, and private planner.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('gate')}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#4338CA] dark:hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition active:scale-[0.99]"
              >
                <span>Go to GATE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Today's Study Priorities (Live Actionable Planner) */}
          <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Today's Study Priorities</h3>
              </div>
              <button
                onClick={() => setCurrentView('planner')}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                Open Full Planner ({tasks.filter(t => !t.completed).length} pending)
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-[#181C4B] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">All planned tasks completed for today!</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                  Great work! You can add new goals in your Study Planner or log a dedicated study session.
                </p>
                <button
                  onClick={() => setCurrentView('planner')}
                  className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                >
                  + Add Study Task
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#181C4B] hover:bg-blue-50/50 dark:hover:bg-blue-900/30 border border-slate-200/60 dark:border-slate-700/80 transition group"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-slate-400 hover:text-emerald-600 transition flex-shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center"
                        title="Mark task completed and keep streak active"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-medium text-blue-600 dark:text-cyan-400">{task.subject}</span>
                          <span>•</span>
                          <span>{task.timeSlot || 'Today'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {/* Notes indicator badge */}
                      <button
                        onClick={() => openTaskNotes(task.id, task.notes || '')}
                        className={`p-1.5 rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center ${
                          task.notes
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100'
                            : 'text-slate-300 dark:text-slate-500 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={task.notes ? 'View/edit notes' : 'Add notes'}
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                      </button>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'high'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access Strip */}
          <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Quick Access Hub</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
              <button
                onClick={() => setCurrentView('simulation')}
                className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181C4B] hover:bg-blue-50/60 dark:hover:bg-blue-900/30 border border-slate-200/60 dark:border-slate-700/80 hover:border-blue-200 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Simulation Tools</span>
              </button>

              <button
                onClick={() => setCurrentView('nptel')}
                className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181C4B] hover:bg-purple-50/60 dark:hover:bg-purple-900/30 border border-slate-200/60 dark:border-slate-700/80 hover:border-purple-200 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100/70 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Tv className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">NPTEL</span>
              </button>

              <button
                onClick={() => setCurrentView('youtube')}
                className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181C4B] hover:bg-red-50/60 dark:hover:bg-red-900/30 border border-slate-200/60 dark:border-slate-700/80 hover:border-red-200 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100/70 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">YouTube Links</span>
              </button>

              <button
                onClick={() => setCurrentView('academic-calendar')}
                className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181C4B] hover:bg-emerald-50/60 dark:hover:bg-emerald-900/30 border border-slate-200/60 dark:border-slate-700/80 hover:border-emerald-200 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Academic Calendar</span>
              </button>
            </div>
          </div>

          {/* Simulation Tools Quick Showcase */}
          <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Simulation Laboratory Tools</h3>
              </div>
              <button
                onClick={() => setCurrentView('simulation')}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>View All Tools ({tools.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tools.slice(0, 6).map((tl) => (
                <div
                  key={tl.id}
                  onClick={() => setCurrentView('simulation')}
                  className="p-3 bg-slate-50 dark:bg-[#181C4B] hover:bg-blue-50/60 dark:hover:bg-blue-900/30 border border-slate-200/60 dark:border-slate-700/80 rounded-2xl flex flex-col justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {tl.category}
                    </span>
                    <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-1.5 py-0.2 rounded-full">
                      {tl.url ? 'Online' : 'Coming soon'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {tl.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity & Recent Resources */}
        <div className="space-y-6">
          {/* Recent Real Activity Log */}
          <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Log</span>
            </div>

            {studyActivities.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-medium">No study activity recorded yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Complete a BOS subject, GATE topic, or log a session to build your activity history.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studyActivities.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-100 dark:border-slate-700/80 text-xs transition">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">{act.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access Curated Resources */}
          <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Quick Study Files</h3>
              <button
                onClick={() => setCurrentView('bos')}
                className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Signals and Systems Notes.pdf', section: 'BOS • Sem 2', type: 'pdf', view: 'bos' as const },
                { title: 'Control Systems PYQs (2015-2024).pdf', section: 'GATE 2028', type: 'pdf', view: 'gate' as const },
                { title: 'Simulation Tools (14 Lab & Industry Suites)', section: 'Tinkercad, MATLAB, Proteus, LTspice, MOSFET, Maths Lab', type: 'link', view: 'simulation' as const },
                { title: 'NPTEL - Analog Electronics IITM', section: 'NPTEL Course', type: 'link', view: 'nptel' as const },
              ].map((res, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentView(res.view)}
                  className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#181C4B] transition cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {res.type === 'pdf' ? <FileText className="w-4 h-4 text-rose-500" /> : <ExternalLink className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{res.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{res.section}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Study Timer Modal */}
      <StudyTimerModal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        onSaveSession={handleTimerSave}
        subjects={subjectNames}
      />

      {/* Task Notes View/Edit Modal */}
      {editingTaskNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <StickyNote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Task Notes</h3>
                  <p className="text-[10px] text-slate-400">
                    {tasks.find(t => t.id === editingTaskNotesId)?.title || 'Study Task'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setEditingTaskNotesId(null); setActiveNotesText(''); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={activeNotesText}
              onChange={(e) => setActiveNotesText(e.target.value)}
              placeholder="Topics to cover, formulas to revise, doubts, resources..."
              rows={5}
              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
            />

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => { setEditingTaskNotesId(null); setActiveNotesText(''); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTaskNotes}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/25 transition active:scale-95"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
