import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Search, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Video, 
  Award,
  ChevronDown,
  ChevronUp,
  StickyNote,
  X,
  Folder,
  Clock
} from 'lucide-react';
import { GATE_RESOURCES_URL } from '../data/driveConfig';

export const GatePreparationView: React.FC = () => {
  const { 
    gateList, 
    toggleGateTopic, 
    tasks, 
    addTask, 
    updateTaskNotes,
    toggleTask, 
    deleteTask,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'planner' | 'pyq' | 'links'>('syllabus');
  const [showGatePlaceholderModal, setShowGatePlaceholderModal] = useState(false);

  const hasGateUrl = typeof GATE_RESOURCES_URL === 'string' && GATE_RESOURCES_URL.trim().length > 0;

  // Task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Network Theory');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [editingTaskNotesId, setEditingTaskNotesId] = useState<string | null>(null);
  const [activeNotesText, setActiveNotesText] = useState('');

  const filteredSubjects = searchFilter.trim()
    ? gateList.filter(
        (g) =>
          g.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          g.code.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : gateList;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), newTaskSubject, newTaskPriority, 'Today', newTaskNotes.trim() || undefined);
    setNewTaskTitle('');
    setNewTaskNotes('');
  };

  const totalGateCompleted = gateList.reduce((acc, curr) => acc + curr.completedTopics, 0);
  const totalGateTopics = gateList.reduce((acc, curr) => acc + curr.topicsCount, 0);
  const overallProgressPercentage = Math.round((totalGateCompleted / totalGateTopics) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* GATE 2028 Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white p-6 md:p-8">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1500&q=80')`,
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <TrendingUp className="w-5 h-5 text-indigo-300" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">GATE 2028 Preparation</h1>
            </div>
            <p className="text-indigo-200/90 text-xs md:text-sm mb-6">
              Plan • Learn • Practice • Analyze • Succeed | ECE Target: Top Rank & PSU Qualification
            </p>

            {/* Quick Search */}
            <div className="relative max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search topics, formulas, or PYQs..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Quick GATE Resources CTA in Banner */}
          <div className="flex-shrink-0 self-start md:self-center">
            {hasGateUrl ? (
              <a
                href={GATE_RESOURCES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-white hover:bg-indigo-50 text-indigo-950 font-bold rounded-2xl text-xs transition shadow-md"
              >
                <Folder className="w-4 h-4 text-indigo-600" />
                <span>GATE Resources</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setShowGatePlaceholderModal(true)}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl text-xs border border-white/25 transition cursor-pointer"
                title="Click to view GATE Resources configuration"
              >
                <Folder className="w-4 h-4 text-indigo-300" />
                <span>GATE Resources</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">Coming soon</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Tabs inside GATE */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'syllabus' ? 'bg-white/20 text-white' : 'bg-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            Syllabus & Subjects
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'planner' ? 'bg-white/20 text-white' : 'bg-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            Private Study Planner ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('pyq')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'pyq' ? 'bg-white/20 text-white' : 'bg-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            Previous Year Questions (PYQs)
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'links' ? 'bg-white/20 text-white' : 'bg-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            Official Links & Lectures
          </button>
        </div>
      </div>

      {/* Official GATE Resources & Study Drive Card */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50 dark:from-[#181C4B] dark:via-[#1B1E4A] dark:to-[#13163A] border border-indigo-200/80 dark:border-[#2B3070] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs bos-drive-link">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0 ${
              hasGateUrl ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Folder className="w-5 h-5 fill-current/20" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                GATE 2028 Official Resources & Study Drive
              </h4>
              {hasGateUrl ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full">
                  Active Link
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                  Coming soon • Awaiting URL
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {hasGateUrl
                ? 'Access official ECE GATE formula sheets, reference textbooks, topic notes, and question banks.'
                : 'Central repository for official GATE 2028 study materials. Configure URL in src/data/driveConfig.ts.'}
            </p>
          </div>
        </div>

        {hasGateUrl ? (
          <a
            href={GATE_RESOURCES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex-shrink-0"
          >
            <span>Open GATE Resources</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setShowGatePlaceholderModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition border border-slate-200/80 dark:border-slate-700 cursor-pointer flex-shrink-0"
            title="Click to view GATE Resources configuration"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>GATE Resources (Coming soon)</span>
          </button>
        )}
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#151945] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            {gateList.length}
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Core GATE Subjects</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">100% ECE Syllabus Covered</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151945] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            {overallProgressPercentage}%
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Overall Topics Mastered</span>
              <span className="font-bold text-slate-800 dark:text-white">{totalGateCompleted}/{totalGateTopics}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151945] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Exam Year</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">GATE 2028 (February)</div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Subjects (ECE – GATE)</h2>
            <span className="text-xs text-slate-500">Click a subject to expand topic details and syllabus checklist</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((sub) => {
              const isExpanded = selectedSubjectId === sub.id;
              const percent = Math.round((sub.completedTopics / sub.topicsCount) * 100);

              return (
                <div
                  key={sub.id}
                  className={`bg-white dark:bg-[#151945] rounded-2xl border transition-all ${
                    isExpanded ? 'border-indigo-400 ring-2 ring-indigo-50 dark:ring-indigo-950/40 shadow-md' : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div 
                    onClick={() => setSelectedSubjectId(isExpanded ? null : sub.id)}
                    className="p-5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-100 dark:border-indigo-900/60">
                        {sub.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {sub.weightage}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{sub.name}</h3>

                    {/* Topic progress slider */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>Topics Completed</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{sub.completedTopics}/{sub.topicsCount} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{sub.pyqCount} PYQ Problems</span>
                      <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium space-x-1">
                        <span>{isExpanded ? 'Collapse' : 'Syllabus'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded view showing syllabus & topic controls */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181C4B] rounded-b-2xl space-y-3">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Syllabus Breakdown
                      </div>
                      <div className="space-y-1.5">
                        {sub.syllabus.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-200">
                            <span className="text-indigo-500 dark:text-indigo-400 font-bold mt-0.5">•</span>
                            <span className="leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Interactive completion counter buttons */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Update completed topics:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleGateTopic(sub.id, -1); }}
                            disabled={sub.completedTopics === 0}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            -
                          </button>
                          <span className="font-bold text-slate-800 dark:text-white text-xs">{sub.completedTopics}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleGateTopic(sub.id, 1); }}
                            disabled={sub.completedTopics === sub.topicsCount}
                            className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold disabled:opacity-40 hover:bg-indigo-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Private Study Planner Tab */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Tasks & Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 text-base">Private Study Checklist & Timetable</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {tasks.filter(t => t.completed).length} of {tasks.length} done
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No active tasks. Add your daily preparation goals below!
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl border transition ${
                        task.completed
                          ? 'bg-slate-50/80 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition flex-shrink-0 ${
                              task.completed
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 hover:border-indigo-500'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <div className="min-w-0 truncate">
                            <p
                              className={`text-xs font-semibold truncate ${
                                task.completed ? 'line-through text-slate-500' : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                              <span>{task.subject}</span>
                              <span>•</span>
                              <span>{task.timeSlot}</span>
                              <span>•</span>
                              <span
                                className={`font-semibold uppercase ${
                                  task.priority === 'high'
                                    ? 'text-rose-500'
                                    : task.priority === 'medium'
                                    ? 'text-amber-500'
                                    : 'text-slate-500'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {/* Notes indicator / edit button */}
                          <button
                            onClick={() => {
                              setEditingTaskNotesId(task.id);
                              setActiveNotesText(task.notes || '');
                            }}
                            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 transition ${
                              task.notes
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                            title={task.notes ? 'View / Edit Task Notes' : 'Add Note to Task'}
                          >
                            <StickyNote className="w-3.5 h-3.5" />
                            {task.notes && <span className="text-[10px] font-bold">Notes</span>}
                          </button>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-300 hover:text-rose-500 p-1.5 transition rounded-lg"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Notes snippet preview if notes exist */}
                      {task.notes && (
                        <div 
                          onClick={() => {
                            setEditingTaskNotesId(task.id);
                            setActiveNotesText(task.notes || '');
                          }}
                          className="mt-2 text-[11px] bg-amber-50/70 border border-amber-100 rounded-xl px-2.5 py-1.5 text-amber-900 cursor-pointer hover:bg-amber-100/70 transition line-clamp-2"
                        >
                          <span className="font-semibold text-amber-800 mr-1">📝 Notes:</span>
                          {task.notes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Add Task Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-3">Add Study Goal / To-Do</h4>
              <form onSubmit={handleCreateTask} className="space-y-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Practice 20 questions on Nyquist Stability & Bode Plot"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                <textarea
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Add optional notes (topics to cover, doubts, formulas to revise, links)..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    {gateList.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                    <option value="General Aptitude">General Aptitude</option>
                  </select>

                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Timetable</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Weekly Schedule Strategy */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-3">Recommended Weekly Schedule</h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <span className="font-bold text-indigo-900 block mb-0.5">Mon - Wed: Core Theory</span>
                  <p className="text-slate-600">Complete standard textbook concepts & NPTEL video lectures.</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="font-bold text-blue-900 block mb-0.5">Thu - Fri: Problem Solving</span>
                  <p className="text-slate-600">Solve 30+ PYQs per subject and analyze common mistakes.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-0.5">Sat - Sun: Mock Tests & Revision</span>
                  <p className="text-slate-600">Timed 65-question practice & short notes formula revision.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PYQ Tab */}
      {activeTab === 'pyq' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Previous Year Questions (PYQs) Repository</h3>
            <span className="text-xs text-slate-400">Authentic GATE ECE Papers (2015-2024)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { year: '2024', session: 'IISc Bangalore', questions: 65, link: 'https://gate2024.iisc.ac.in/' },
              { year: '2023', session: 'IIT Kanpur', questions: 65, link: 'https://gate.iitk.ac.in/' },
              { year: '2022', session: 'IIT Kharagpur', questions: 65, link: 'https://gate.iitkgp.ac.in/' },
              { year: '2021', session: 'IIT Bombay', questions: 65, link: 'https://gate.iitb.ac.in/' },
            ].map((paper) => (
              <div
                key={paper.year}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    {paper.year}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">GATE ECE {paper.year} Question Paper</h4>
                    <p className="text-[11px] text-slate-400">Organized by {paper.session} • 65 Questions</p>
                  </div>
                </div>

                <a
                  href={paper.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs flex items-center space-x-1"
                >
                  <span>Download</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Links & YouTube Lectures Tab */}
      {activeTab === 'links' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Important Verified Links */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Official GATE Portals</h3>
            <div className="space-y-2.5">
              {/* GATE Resources Link Card */}
              {hasGateUrl ? (
                <a
                  href={GATE_RESOURCES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 transition text-xs font-semibold text-indigo-900"
                >
                  <div className="flex items-center space-x-2.5">
                    <Folder className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Official GATE Resources Drive</p>
                      <p className="text-[10px] text-slate-500">Curated formulas, question banks, study notes</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600">
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGatePlaceholderModal(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 transition text-xs text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Folder className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-slate-800">GATE Resources</p>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">Coming soon</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Awaiting URL in src/data/driveConfig.ts</p>
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                </button>
              )}
              {[
                { name: 'Official GATE Website', desc: 'Central application portal & updates', url: 'https://gate.iisc.ac.in' },
                { name: 'NPTEL GATE Portal', desc: 'Free official practice question bank by IITs', url: 'https://gate.nptel.ac.in' },
                { name: 'Previous Year Papers Archive', desc: 'Official question keys & answer sheets', url: 'https://gate.iitk.ac.in/previous_year_papers.html' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-transparent hover:border-indigo-200 transition text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800">{link.name}</p>
                    <p className="text-[10px] text-slate-400">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* GATE YouTube Recommendations */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Recommended GATE YouTube Channels</h3>
            <div className="space-y-2.5">
              {[
                { name: 'Gate Smashers', desc: 'Fast concept revision & exam problem shortcuts', url: 'https://www.youtube.com/@GateSmashers' },
                { name: 'ECE MADE EASY', desc: 'In-depth conceptual lectures and previous year walkthroughs', url: 'https://www.youtube.com' },
                { name: 'Neso Academy - ECE', desc: 'Foundational electronics and signal analysis', url: 'https://www.youtube.com/@nesoacademy' },
              ].map((ch, idx) => (
                <a
                  key={idx}
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-red-50/60 border border-transparent hover:border-red-200 transition text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <Video className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{ch.name}</p>
                      <p className="text-[10px] text-slate-400">{ch.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Notes View/Edit Modal */}
      {editingTaskNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-7 max-w-md w-full shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <StickyNote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Task Study Notes</h3>
                  <p className="text-[11px] text-slate-400">
                    {tasks.find(t => t.id === editingTaskNotesId)?.title || 'Selected Task'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingTaskNotesId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Add revision notes, important formulas, references, textbook page numbers, or questions to clarify:
            </p>

            <textarea
              value={activeNotesText}
              onChange={(e) => setActiveNotesText(e.target.value)}
              placeholder="e.g. Formula: Transfer function poles must lie in LHP. Revise NPTEL Lecture 12."
              rows={5}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed"
            />

            <div className="flex space-x-2.5 mt-4">
              <button
                type="button"
                onClick={() => setEditingTaskNotesId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateTaskNotes(editingTaskNotesId, activeNotesText);
                  setEditingTaskNotesId(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition active:scale-95"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GATE Resources URL Configuration Info Modal */}
      {showGatePlaceholderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-7 max-w-lg w-full shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">GATE Resources Setup</h3>
                  <p className="text-[11px] text-slate-400">Easy configuration for GATE 2028 Drive Link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGatePlaceholderModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                The <strong>GATE Resources</strong> link has been prepared and cleanly wired into the interface. When you have your official Google Drive / resources URL ready, simply paste it in:
              </p>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] border border-slate-800">
                <div className="text-slate-400 text-[10px] mb-1">// File: src/data/driveConfig.ts</div>
                <div><span className="text-purple-400">export const</span> <span className="text-amber-300">GATE_RESOURCES_URL</span> = <span className="text-emerald-400">'https://drive.google.com/...'</span>;</div>
              </div>
              <p className="text-[11px] text-slate-500">
                Once saved, all GATE Resources buttons on this page will automatically light up and navigate directly to your resources in a safe new tab.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGatePlaceholderModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition active:scale-95"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
