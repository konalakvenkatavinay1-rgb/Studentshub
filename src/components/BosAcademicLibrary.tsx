import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Year, Semester, ResourceType, ResourceItem } from '../types';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Edit3,
  FileText, 
  ExternalLink, 
  Cpu, 
  Tv, 
  Video, 
  Bookmark as BookmarkIcon,
  ChevronRight,
  FolderOpen,
  Folder,
  ShieldAlert,
  UploadCloud,
  FileCheck,
  Link as LinkIcon,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { YEAR_DRIVE_URLS, SEMESTER_DRIVE_URLS } from '../data/driveConfig';

const ALL_SEMESTER_SECTIONS: {
  year: Year;
  semester: Semester;
  label: string;
  badge: string;
}[] = [
  { year: 1, semester: 1, label: 'Year 1 — Semester 1', badge: 'Y1 S1' },
  { year: 1, semester: 2, label: 'Year 1 — Semester 2', badge: 'Y1 S2' },
  { year: 2, semester: 1, label: 'Year 2 — Semester 1', badge: 'Y2 S1' },
  { year: 2, semester: 2, label: 'Year 2 — Semester 2', badge: 'Y2 S2' },
  { year: 3, semester: 1, label: 'Year 3 — Semester 1', badge: 'Y3 S1' },
  { year: 3, semester: 2, label: 'Year 3 — Semester 2', badge: 'Y3 S2' },
  { year: 4, semester: 1, label: 'Year 4 — Semester 1', badge: 'Y4 S1' },
  { year: 4, semester: 2, label: 'Year 4 — Semester 2', badge: 'Y4 S2' },
];

export const BosAcademicLibrary: React.FC = () => {
  const { 
    subjects, 
    isAdmin,
    addSubject, 
    deleteSubject, 
    addResourceToSubject, 
    editResource,
    deleteResource,
    setCurrentView,
    toggleBookmark,
    isBookmarked,
    tools,
    nptelList,
    ytList,
    toggleBosSubjectCompletion,
    isBosSubjectCompleted,
    completedBosSubjectIds
  } = useApp();

  const [selectedYear, setSelectedYear] = useState<Year>(2);
  const [selectedSem, setSelectedSem] = useState<Semester>(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal states for adding subject (admin only)
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  // Modal states for adding resource (admin only)
  const [activeSubjectForResource, setActiveSubjectForResource] = useState<string | null>(null);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState<ResourceType>('pdf');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceFileSize, setNewResourceFileSize] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');

  // Modal states for editing resource (admin only)
  const [editingResourceData, setEditingResourceData] = useState<{
    subjectId: string;
    resource: ResourceItem;
  } | null>(null);

  // Filter subjects for active year & sem
  const semesterSubjects = subjects.filter(
    (s) => s.year === selectedYear && s.semester === selectedSem
  );

  const displayedSubjects = searchFilter.trim()
    ? semesterSubjects.filter((s) =>
        s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        s.code.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : semesterSubjects;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!newSubName.trim() || !newSubCode.trim()) return;

    const res = addSubject({
      year: selectedYear,
      semester: selectedSem,
      code: newSubCode.trim().toUpperCase(),
      name: newSubName.trim(),
      description: newSubDesc.trim() || 'Core ECE curriculum subject.',
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create subject.');
      return;
    }

    setNewSubName('');
    setNewSubCode('');
    setNewSubDesc('');
    setShowAddSubjectModal(false);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!activeSubjectForResource || !newResourceTitle.trim()) return;

    const res = addResourceToSubject(
      activeSubjectForResource, 
      newResourceTitle.trim(), 
      newResourceType,
      newResourceUrl.trim() || undefined,
      newResourceFileSize.trim() || (simulatedFileName ? '3.2 MB' : undefined)
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to add resource.');
      return;
    }

    setNewResourceTitle('');
    setNewResourceUrl('');
    setNewResourceFileSize('');
    setSimulatedFileName('');
    setActiveSubjectForResource(null);
  };

  const handleSaveEditedResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResourceData) return;

    const res = editResource(
      editingResourceData.subjectId,
      editingResourceData.resource.id,
      {
        title: editingResourceData.resource.title,
        type: editingResourceData.resource.type,
        url: editingResourceData.resource.url,
        fileSize: editingResourceData.resource.fileSize
      }
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update resource.');
      return;
    }

    setEditingResourceData(null);
  };

  const handleDeleteResource = (subjectId: string, resourceId: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    const res = deleteResource(subjectId, resourceId);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to delete resource.');
    }
  };

  const handleDeleteSubject = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject and all its resources?')) return;
    const res = deleteSubject(id);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to delete subject.');
    }
  };

  // Helper icon for resource type
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />;
      case 'nptel':
        return <Tv className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />;
      case 'youtube':
        return <Video className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
      case 'simulation':
        return <Cpu className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />;
      default:
        return <LinkIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-8 bos-page-entrance">
      {/* Role Notice Banner */}
      {isAdmin ? (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold">Faculty Administrator Mode Active</span>
            <span className="text-amber-700 hidden sm:inline">— You have authorization to add, edit, and delete curriculum resources and subjects.</span>
          </div>
          <span className="px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded font-semibold text-[10px]">
            Role: Admin
          </span>
        </div>
      ) : (
        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Student Read-Only Portal — Shared academic resources are curated and managed by verified faculty admins.</span>
          </div>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold text-[10px]">
            Role: Student
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="font-bold text-rose-800 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* BOS Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1500&q=80')`,
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">BOS Academic Library</h1>
          </div>
          <p className="text-blue-200/90 text-xs md:text-sm mb-6">
            Year-wise • Semester-wise • Subjects • Tools • NPTEL • Simulations
          </p>

          {/* Quick Search within BOS */}
          <div className="relative max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search subjects, notes, or course codes..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400 bos-search-input"
            />
          </div>
        </div>

        {/* Section Quick Jump Filter Tabs */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          <button 
            className="px-3.5 py-1.5 rounded-lg bg-white/20 font-semibold backdrop-blur-sm transition hover:bg-white/30"
          >
            All Subjects
          </button>
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center space-x-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Progress: {completedBosSubjectIds.length}/{subjects.length} Completed</span>
          </div>
          <button 
            onClick={() => setCurrentView('simulation')} 
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 flex items-center space-x-1.5 transition"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulation Tools</span>
          </button>
          <button 
            onClick={() => setCurrentView('nptel')} 
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 flex items-center space-x-1.5 transition"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>NPTEL Resources</span>
          </button>
          <button 
            onClick={() => setCurrentView('youtube')} 
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 flex items-center space-x-1.5 transition"
          >
            <Video className="w-3.5 h-3.5" />
            <span>YouTube Lectures</span>
          </button>
        </div>
      </div>

      {/* All 8 Semesters Navigation Bar */}
      <div className="bg-white dark:bg-[#151945] p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Academic Semester Navigation (All 8 Semesters)</span>
          </span>
          <span className="text-[11px] font-semibold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-cyan-800/60 self-start sm:self-auto">
            Active: Year {selectedYear} — Semester {selectedSem}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {ALL_SEMESTER_SECTIONS.map((sec) => {
            const isActive = selectedYear === sec.year && selectedSem === sec.semester;
            const hasDriveLink = sec.year === 2 && sec.semester === 1;

            return (
              <button
                key={`${sec.year}-${sec.semester}`}
                onClick={() => {
                  setSelectedYear(sec.year);
                  setSelectedSem(sec.semester);
                }}
                className={`p-2.5 rounded-xl text-center transition-all flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs scale-[1.02] ring-2 ring-blue-400/40 font-bold'
                    : 'bg-slate-50 dark:bg-[#181C4B] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-extrabold">{sec.badge}</span>
                <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  Sem {sec.semester}
                </span>
                {hasDriveLink ? (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-1 ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'}`}>
                    Drive ✓
                  </span>
                ) : (
                  <span className={`text-[9px] mt-1 ${isActive ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    Ready
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Selection Cards (Year 1 to Year 4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as Year[]).map((yr) => {
          const isSelected = selectedYear === yr;
          const colors = [
            'hover:border-purple-300 dark:hover:border-purple-500/50',
            'hover:border-blue-300 dark:hover:border-blue-500/50',
            'hover:border-emerald-300 dark:hover:border-emerald-500/50',
            'hover:border-indigo-300 dark:hover:border-indigo-500/50'
          ];
          const activeBg = [
            'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200',
            'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200',
            'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
            'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
          ][yr - 1];

          return (
            <div
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`p-4 rounded-2xl border cursor-pointer bos-year-card ${
                isSelected ? `${activeBg} shadow-sm ring-1 ring-blue-500` : `bg-white dark:bg-[#151945] border-slate-200/80 dark:border-slate-800 ${colors[yr - 1]}`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl bg-white dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700 shadow-xs flex items-center justify-center font-bold text-sm transition-transform duration-200 ${isSelected ? 'scale-105 text-blue-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  Y{yr}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Year {yr}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sem 1 & 2</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Semester Switcher Tabs & Add Subject Button (Admin Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#151945] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase px-2">Semester:</span>
          {([1, 2] as Semester[]).map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-4 py-2 rounded-xl text-xs font-bold bos-sem-btn ${
                selectedSem === sem
                  ? 'bg-blue-600 text-white shadow-xs active'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        {/* Admin only: Add Subject button */}
        {isAdmin && (
          <button
            onClick={() => setShowAddSubjectModal(true)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject (Admin)</span>
          </button>
        )}
      </div>

      {/* Subject Cards for Year & Semester */}
      <div key={`subjects-y${selectedYear}-s${selectedSem}`} className="space-y-4 bos-fade-in">
        {displayedSubjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">No subjects listed yet for Year {selectedYear} Semester {selectedSem}</h3>
            <p className="text-slate-400 text-xs mt-1 mb-4">
              {isAdmin 
                ? 'Use the Add Subject button above to create curriculum course units and link study resources.' 
                : 'No course materials have been posted by the administration for this semester yet.'}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                + Add First Subject
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedSubjects.map((sub, index) => {
              // Compute bracketed short form: use sub.shortForm if available, or generate from acronym / extract from name
              let shortForm = sub.shortForm;
              if (!shortForm) {
                // If name has brackets, extract it
                const match = sub.name.match(/\(([^)]+)\)/);
                if (match) {
                  shortForm = match[1];
                } else {
                  // Fallback: acronym of words
                  shortForm = sub.name
                    .split(/\s+/)
                    .filter((w) => w.length > 2 && !['and', 'for', 'the', 'with'].includes(w.toLowerCase()))
                    .map((w) => w[0].toUpperCase())
                    .join('');
                }
              }

              // Clean name: remove existing bracketed abbreviation if already in name so it doesn't repeat
              const cleanName = sub.name.replace(/\s*\([^)]*\)\s*/, ' ').trim();

              return (
                <div
                  key={sub.id}
                  style={{ animationDelay: `${Math.min(index * 40, 360)}ms` }}
                  className="bg-white dark:bg-[#151945] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 hover:border-blue-200 dark:hover:border-blue-700/60 flex flex-col justify-between bos-subject-item"
                >
                  <div>
                    {/* Subject Code badge and delete button (Admin Only) */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-cyan-400 font-mono text-[11px] font-bold border border-blue-100 dark:border-blue-900/60">
                          {sub.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleBosSubjectCompletion(sub.id)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition border cursor-pointer active:scale-95 ${
                            isBosSubjectCompleted(sub.id)
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 shadow-2xs'
                              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
                          }`}
                          title={isBosSubjectCompleted(sub.id) ? 'Mark as In Progress' : 'Mark as Completed'}
                        >
                          {isBosSubjectCompleted(sub.id) ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Mark Completed</span>
                            </>
                          )}
                        </button>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-rose-500 transition p-1"
                          title="Delete subject (Admin)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Subject Title formatted as: Code — Full Subject Name (Short Form) */}
                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1 leading-snug">
                      <span className="font-mono text-blue-900 dark:text-cyan-400">{sub.code}</span>
                      <span className="text-slate-400 font-normal mx-1.5">—</span>
                      <span>{cleanName}</span>
                      {shortForm && (
                        <span className="ml-1.5 text-blue-600 dark:text-cyan-400 font-semibold text-sm">
                          ({shortForm})
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{sub.description}</p>

                    {/* Resources / Notes Section */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Curated Resources ({sub.resources.length})</span>
                        {isAdmin && (
                          <button
                            onClick={() => setActiveSubjectForResource(sub.id)}
                            className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Resource</span>
                          </button>
                        )}
                      </div>

                      {sub.resources.length === 0 ? (
                        <div className="p-3 bg-slate-50 dark:bg-[#181C4B] rounded-xl text-center text-xs text-slate-400 italic">
                          Empty state: No resources added yet.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {sub.resources.map((res) => (
                            <div
                              key={res.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#181C4B] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition"
                            >
                              <div className="flex items-center space-x-2 truncate pr-2">
                                {getResourceIcon(res.type)}
                                <span className="text-slate-700 dark:text-slate-200 truncate font-medium">{res.title}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-mono">
                                  [{res.type}]
                                </span>
                                {res.fileSize && (
                                  <span className="text-[10px] text-slate-400">({res.fileSize})</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                <button
                                  onClick={() => toggleBookmark(res.title, 'BOS', res.url)}
                                  className={`p-1 rounded hover:bg-white text-xs ${
                                    isBookmarked(res.title) ? 'text-amber-500' : 'text-slate-400'
                                  }`}
                                  title="Bookmark resource"
                                >
                                  <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                                </button>

                                {/* Admin edit & delete controls */}
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => setEditingResourceData({ subjectId: sub.id, resource: res })}
                                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition"
                                      title="Edit Resource (Admin)"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteResource(sub.id, res.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                      title="Delete Resource (Admin)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                <a
                                  href={res.url || '/ECE.pdf'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700 flex items-center space-x-0.5"
                                >
                                  <span>View</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer link to simulation/nptel */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px]">Year {sub.year} • Semester {sub.semester}</span>
                    <button
                      onClick={() => setCurrentView('simulation')}
                      className="font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>Lab tools</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Semester Resource & Drive Section */}
      {(() => {
        const semKey = `Y${selectedYear}_S${selectedSem}`;
        const driveUrl = SEMESTER_DRIVE_URLS?.[semKey] || (selectedYear === 2 && selectedSem === 1 ? YEAR_DRIVE_URLS.YEAR_2_DRIVE_URL : '');
        const hasWorkingLink = !!driveUrl && driveUrl.trim().length > 0;

        return (
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs bos-drive-link">
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0 ${
                  hasWorkingLink ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Folder className="w-5 h-5 fill-current/20" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800">
                    Year {selectedYear} — Semester {selectedSem} Official Drive Folder
                  </h4>
                  {hasWorkingLink ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                      Active Link
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-600 rounded-full">
                      Links will be added later
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {hasWorkingLink
                    ? `Access full Year ${selectedYear} Semester ${selectedSem} curriculum notes, reference drives, and lecture archives.`
                    : `Links will be added later.`}
                </p>
              </div>
            </div>

            {hasWorkingLink ? (
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs flex-shrink-0"
              >
                <Folder className="w-4 h-4" />
                <span>Open Year {selectedYear} — Semester {selectedSem} Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5 arrow-icon" />
              </a>
            ) : (
              <div className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 font-medium text-xs border border-slate-200/80 flex-shrink-0">
                <Folder className="w-4 h-4 text-slate-400" />
                <span>Links will be added later</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Connected Simulation Tools strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Simulation Tools (Linked)</h3>
          </div>
          <button
            onClick={() => setCurrentView('simulation')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tools.map((tl) => {
            const hasValidUrl = !!tl.url && (tl.url.startsWith('http://') || tl.url.startsWith('https://'));
            return hasValidUrl ? (
              <a
                key={tl.id}
                href={tl.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 rounded-2xl flex flex-col items-center text-center transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Cpu className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{tl.name}</span>
                <span className="text-[10px] text-slate-400 truncate w-full">{tl.category}</span>
              </a>
            ) : (
              <button
                key={tl.id}
                type="button"
                onClick={() => setCurrentView('simulation')}
                className="p-3 bg-slate-50 hover:bg-amber-50/40 border border-slate-200/60 rounded-2xl flex flex-col items-center text-center transition group cursor-pointer"
                title={`${tl.name} — Coming soon. View details in Simulation Tools.`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Cpu className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{tl.name}</span>
                <span className="text-[9px] font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-full mt-0.5">Coming soon</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connected NPTEL & YouTube Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NPTEL Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tv className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">NPTEL (Subject-wise)</h3>
              </div>
              <button
                onClick={() => setCurrentView('nptel')}
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {nptelList.slice(0, 4).map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 transition border border-transparent hover:border-purple-200 text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 truncate">{c.title}</p>
                    <p className="text-[10px] text-slate-400">{c.institute} • {c.instructor}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* YouTube Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-800">Recommended YouTube Channels</h3>
              </div>
              <button
                onClick={() => setCurrentView('youtube')}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {ytList.slice(0, 4).map((yt) => (
                <a
                  key={yt.id}
                  href={yt.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-red-50/50 transition border border-transparent hover:border-red-200 text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 truncate">{yt.channelName}</p>
                    <p className="text-[10px] text-slate-400">{yt.category}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Subject (Admin Only) */}
      {isAdmin && showAddSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-1">Add Subject to Year {selectedYear} Sem {selectedSem}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Admin action. This subject will be visible across the academic curriculum.
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Subject Name</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Communication Systems"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Course Code</label>
                <input
                  type="text"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="e.g. EC2203"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Brief Description</label>
                <textarea
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  rows={2}
                  placeholder="Overview of syllabus, modules and topics covered"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Resource (Admin Only) */}
      {isAdmin && activeSubjectForResource && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-1">Add Academic Resource (Admin)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a PDF, Google Drive link, NPTEL course, YouTube lecture, or Simulation link.
            </p>

            <form onSubmit={handleAddResource} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Resource Title</label>
                <input
                  type="text"
                  value={newResourceTitle}
                  onChange={(e) => setNewResourceTitle(e.target.value)}
                  placeholder="e.g. Unit 3 State Machines Hand-notes.pdf"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Resource Type</label>
                  <select
                    value={newResourceType}
                    onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="notes">Lecture Notes</option>
                    <option value="syllabus">Official Syllabus</option>
                    <option value="nptel">NPTEL Course Link</option>
                    <option value="youtube">YouTube Video/Playlist</option>
                    <option value="simulation">Simulation Tool Link</option>
                    <option value="link">Other External Link</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">File Size (Optional)</label>
                  <input
                    type="text"
                    value={newResourceFileSize}
                    onChange={(e) => setNewResourceFileSize(e.target.value)}
                    placeholder="e.g. 3.4 MB"
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  PDF / Google Drive / External URL
                </label>
                <input
                  type="url"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/... or https://..."
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Tip: Leave blank to link to local default PDF viewer (/ECE.pdf).
                </span>
              </div>

              {/* Local File Upload Picker (Admin only) */}
              <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UploadCloud className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-700">Attach Document File</span>
                  </div>
                  <label className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-slate-50 cursor-pointer">
                    Browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSimulatedFileName(file.name);
                          if (!newResourceTitle) setNewResourceTitle(file.name);
                          setNewResourceFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                        }
                      }}
                    />
                  </label>
                </div>
                {simulatedFileName && (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold mt-2">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Attached: {simulatedFileName}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubjectForResource(null);
                    setSimulatedFileName('');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Resource (Admin Only) */}
      {isAdmin && editingResourceData && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-1">Edit Academic Resource (Admin)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Update title, resource type, or Google Drive / external URL.
            </p>

            <form onSubmit={handleSaveEditedResource} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Resource Title</label>
                <input
                  type="text"
                  value={editingResourceData.resource.title}
                  onChange={(e) => setEditingResourceData({
                    ...editingResourceData,
                    resource: { ...editingResourceData.resource, title: e.target.value }
                  })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Resource Type</label>
                  <select
                    value={editingResourceData.resource.type}
                    onChange={(e) => setEditingResourceData({
                      ...editingResourceData,
                      resource: { ...editingResourceData.resource, type: e.target.value as ResourceType }
                    })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="notes">Lecture Notes</option>
                    <option value="syllabus">Official Syllabus</option>
                    <option value="nptel">NPTEL Course Link</option>
                    <option value="youtube">YouTube Video/Playlist</option>
                    <option value="simulation">Simulation Tool Link</option>
                    <option value="link">Other External Link</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">File Size</label>
                  <input
                    type="text"
                    value={editingResourceData.resource.fileSize || ''}
                    onChange={(e) => setEditingResourceData({
                      ...editingResourceData,
                      resource: { ...editingResourceData.resource, fileSize: e.target.value }
                    })}
                    placeholder="e.g. 2.1 MB"
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Resource URL</label>
                <input
                  type="url"
                  value={editingResourceData.resource.url || ''}
                  onChange={(e) => setEditingResourceData({
                    ...editingResourceData,
                    resource: { ...editingResourceData.resource, url: e.target.value }
                  })}
                  placeholder="https://drive.google.com/..."
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResourceData(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
