import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import type { TodoNote, TodoChecklistItem } from '../types';
import {
  ListTodo,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Square,
  CheckSquare,
  Trash2,
  Save,
  Clock,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';

type FilterType = 'all' | 'pending' | 'completed';
type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export const TodoListView: React.FC = () => {
  const { user, todoNotes, saveTodoNote, deleteTodoNote } = useApp();

  // Selected note ID
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    return todoNotes.length > 0 ? todoNotes[0].id : null;
  });

  // Local active note draft for immediate responsiveness and debounced autosave
  const [activeDraft, setActiveDraft] = useState<TodoNote | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  // Mobile navigation state: show list or editor on small screens
  const [mobileShowEditor, setMobileShowEditor] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // New checklist item input
  const [newChecklistText, setNewChecklistText] = useState('');

  // Inline delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Debounce autosave timer ref
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeDraftRef = useRef<TodoNote | null>(null);
  activeDraftRef.current = activeDraft;

  // Sync draft when selectedNoteId changes or initial load
  useEffect(() => {
    if (selectedNoteId) {
      const found = todoNotes.find((n) => n.id === selectedNoteId);
      if (found) {
        setActiveDraft(found);
        setSaveStatus('saved');
        setLastSavedTime(new Date(found.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        return;
      }
    }
    if (todoNotes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(todoNotes[0].id);
      setActiveDraft(todoNotes[0]);
    } else if (todoNotes.length === 0) {
      setSelectedNoteId(null);
      setActiveDraft(null);
    }
  }, [selectedNoteId, todoNotes]);

  // Flush pending autosave immediately
  const flushAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    if (activeDraftRef.current) {
      try {
        setSaveStatus('saving');
        saveTodoNote(activeDraftRef.current);
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {
        setSaveStatus('error');
      }
    }
  }, [saveTodoNote]);

  // Clean up timer and flush on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      if (activeDraftRef.current) {
        saveTodoNote(activeDraftRef.current);
      }
    };
  }, [saveTodoNote]);

  // Schedule debounced autosave (600ms)
  const scheduleAutosave = useCallback(
    (updatedNote: TodoNote) => {
      setActiveDraft(updatedNote);
      setSaveStatus('unsaved');

      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      autosaveTimerRef.current = setTimeout(() => {
        try {
          setSaveStatus('saving');
          saveTodoNote(updatedNote);
          setSaveStatus('saved');
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch {
          setSaveStatus('error');
        }
      }, 600);
    },
    [saveTodoNote]
  );

  // Switch note with safe save flush
  const handleSelectNote = (noteId: string) => {
    if (noteId === selectedNoteId) return;
    flushAutosave();
    setSelectedNoteId(noteId);
    setMobileShowEditor(true);
    setConfirmDeleteId(null);
  };

  // Create new note
  const handleCreateNewNote = () => {
    flushAutosave();
    const newNote: TodoNote = {
      id: `note-${Date.now()}`,
      user_id: user?.id,
      title: 'Untitled Note',
      content: '',
      checklist_items: [],
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveTodoNote(newNote);
    setSelectedNoteId(newNote.id);
    setActiveDraft(newNote);
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setMobileShowEditor(true);
    setConfirmDeleteId(null);
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    deleteTodoNote(noteId);
    setConfirmDeleteId(null);

    const remaining = todoNotes.filter((n) => n.id !== noteId);
    if (remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
      setActiveDraft(remaining[0]);
    } else {
      setSelectedNoteId(null);
      setActiveDraft(null);
      setMobileShowEditor(false);
    }
  };

  // Title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDraft) return;
    const updated = { ...activeDraft, title: e.target.value };
    scheduleAutosave(updated);
  };

  // Content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeDraft) return;
    const updated = { ...activeDraft, content: e.target.value };
    scheduleAutosave(updated);
  };

  // Toggle overall note completion (independent of checklist)
  const handleToggleNoteCompletion = () => {
    if (!activeDraft) return;
    const updated = { ...activeDraft, is_completed: !activeDraft.is_completed };
    setActiveDraft(updated);
    saveTodoNote(updated);
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Add checklist item
  const handleAddChecklistItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeDraft || !newChecklistText.trim()) return;

    const newItem: TodoChecklistItem = {
      id: `chk-${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false
    };

    const updated = {
      ...activeDraft,
      checklist_items: [...activeDraft.checklist_items, newItem]
    };

    setActiveDraft(updated);
    saveTodoNote(updated);
    setNewChecklistText('');
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Toggle single checklist item
  const handleToggleChecklistItem = (itemId: string) => {
    if (!activeDraft) return;
    const updatedItems = activeDraft.checklist_items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updated = { ...activeDraft, checklist_items: updatedItems };
    setActiveDraft(updated);
    saveTodoNote(updated);
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Edit checklist item text
  const handleEditChecklistItem = (itemId: string, newText: string) => {
    if (!activeDraft) return;
    const updatedItems = activeDraft.checklist_items.map((item) =>
      item.id === itemId ? { ...item, text: newText } : item
    );
    const updated = { ...activeDraft, checklist_items: updatedItems };
    scheduleAutosave(updated);
  };

  // Delete checklist item
  const handleDeleteChecklistItem = (itemId: string) => {
    if (!activeDraft) return;
    const updatedItems = activeDraft.checklist_items.filter((item) => item.id !== itemId);
    const updated = { ...activeDraft, checklist_items: updatedItems };
    setActiveDraft(updated);
    saveTodoNote(updated);
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Reorder checklist item
  const handleMoveChecklistItem = (index: number, direction: 'up' | 'down') => {
    if (!activeDraft) return;
    const items = [...activeDraft.checklist_items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const updated = { ...activeDraft, checklist_items: items };
    setActiveDraft(updated);
    saveTodoNote(updated);
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Filtered and searched notes
  const filteredNotes = useMemo(() => {
    return todoNotes.filter((note) => {
      // Filter tab check
      if (filter === 'pending' && note.is_completed) return false;
      if (filter === 'completed' && !note.is_completed) return false;

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesChecklist = note.checklist_items.some((item) =>
          item.text.toLowerCase().includes(query)
        );
        return matchesTitle || matchesContent || matchesChecklist;
      }
      return true;
    });
  }, [todoNotes, filter, searchQuery]);

  // Counts for tabs
  const allCount = todoNotes.length;
  const pendingCount = todoNotes.filter((n) => !n.is_completed).length;
  const completedCount = todoNotes.filter((n) => n.is_completed).length;

  // Active note checklist metrics
  const activeChecklistTotal = activeDraft?.checklist_items.length || 0;
  const activeChecklistDone = activeDraft?.checklist_items.filter((i) => i.completed).length || 0;

  return (
    <div className="space-y-4 animate-fadeIn pb-8">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ListTodo className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">
              Todo List & Academic Notebook
            </h1>
            <p className="text-xs text-slate-500">
              Desktop-style notes editor, actionable task checklists, and plans for {user?.name || 'Student'}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateNewNote}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Two-Panel Notebook Layout */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        {/* ========================================================================= */}
        {/* LEFT PANEL: NOTES LIST                                                    */}
        {/* ========================================================================= */}
        <div
          className={`w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col flex-shrink-0 bg-slate-50/50 ${
            mobileShowEditor ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top of Left Panel: Search & Filters */}
          <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes or tasks..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-1 px-2 rounded-lg transition text-center ${
                  filter === 'all'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                All ({allCount})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`flex-1 py-1 px-2 rounded-lg transition text-center ${
                  filter === 'pending'
                    ? 'bg-white text-amber-700 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`flex-1 py-1 px-2 rounded-lg transition text-center ${
                  filter === 'completed'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>
          </div>

          {/* Notes Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold text-slate-600">No notes found</p>
                <p className="text-[11px] mt-1 text-slate-400">
                  {searchQuery || filter !== 'all'
                    ? 'Try clearing your filter or search query.'
                    : 'Click "+ New Note" above to write your first entry.'}
                </p>
                {searchQuery || filter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                    }}
                    className="mt-3 px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <button
                    onClick={handleCreateNewNote}
                    className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    + Create Note
                  </button>
                )}
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                const checklistDone = note.checklist_items.filter((i) => i.completed).length;
                const checklistTotal = note.checklist_items.length;
                const previewText =
                  note.content.trim() ||
                  (checklistTotal > 0
                    ? `${checklistTotal} checklist task${checklistTotal > 1 ? 's' : ''}`
                    : 'Empty note content...');

                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition border text-left group relative ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-2xs ring-1 ring-blue-300'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs md:text-sm font-bold truncate flex-1 ${
                          note.is_completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {note.title.trim() || 'Untitled Note'}
                      </h4>

                      {/* Status indicator */}
                      {note.is_completed ? (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Done</span>
                        </span>
                      ) : (
                        checklistTotal > 0 && (
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {checklistDone}/{checklistTotal}
                          </span>
                        )
                      )}
                    </div>

                    {/* Preview snippet */}
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {previewText}
                    </p>

                    {/* Date / timestamp footer */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(note.updated_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </span>

                      {isSelected && (
                        <span className="text-blue-600 font-bold uppercase text-[9px] tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Left panel footer notice */}
          <div className="p-3 border-t border-slate-200/80 bg-white text-[10px] text-slate-400 text-center">
            💾 Local storage persistence active for this device.
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: LARGE NOTE EDITOR                                            */}
        {/* ========================================================================= */}
        <div
          className={`flex-1 min-w-0 flex flex-col bg-white ${
            !mobileShowEditor ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeDraft ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Editor Top Toolbar */}
              <div className="px-4 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => {
                      flushAutosave();
                      setMobileShowEditor(false);
                    }}
                    className="md:hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Notes</span>
                  </button>

                  {/* Note Completion Toggle */}
                  <button
                    onClick={handleToggleNoteCompletion}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeDraft.is_completed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {activeDraft.is_completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed Note</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span>Mark as Complete</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right actions: Save Status, Manual Save, Delete */}
                <div className="flex items-center space-x-2.5">
                  {/* Autosave Indicator */}
                  <div className="text-[11px] font-medium flex items-center space-x-1.5">
                    {saveStatus === 'saving' && (
                      <span className="text-blue-600 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                        <span>Saving...</span>
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="text-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="hidden sm:inline">Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}</span>
                        <span className="sm:hidden">Saved</span>
                      </span>
                    )}
                    {saveStatus === 'unsaved' && (
                      <span className="text-amber-600 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Unsaved</span>
                      </span>
                    )}
                    {saveStatus === 'error' && (
                      <span className="text-rose-600 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Save failed</span>
                      </span>
                    )}
                  </div>

                  {/* Immediate Manual Save Button */}
                  <button
                    onClick={flushAutosave}
                    title="Save immediately"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
                  >
                    <Save className="w-4 h-4" />
                  </button>

                  {/* Delete Note with Confirmation */}
                  {confirmDeleteId === activeDraft.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl text-xs">
                      <span className="text-rose-800 text-[11px] font-semibold">Delete note?</span>
                      <button
                        onClick={() => handleDeleteNote(activeDraft.id)}
                        className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px] hover:bg-rose-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(activeDraft.id)}
                      title="Delete note"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Editor Writing Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {/* Note Title Input */}
                <div>
                  <input
                    type="text"
                    value={activeDraft.title}
                    onChange={handleTitleChange}
                    placeholder="Note Title..."
                    className="w-full text-2xl md:text-3xl font-black text-slate-800 placeholder-slate-300 border-none outline-none focus:ring-0 bg-transparent"
                  />
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Created:{' '}
                        {new Date(activeDraft.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      {activeChecklistDone}/{activeChecklistTotal} checklist tasks completed
                    </span>
                  </div>
                </div>

                {/* Multiline Notes / Plan Editor */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Notes & Work Plans
                  </label>
                  <textarea
                    value={activeDraft.content}
                    onChange={handleContentChange}
                    rows={8}
                    placeholder="Write detailed study plans, reminders, lecture summaries, instructions, or exam strategy notes here..."
                    className="w-full p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80 text-sm md:text-base text-slate-700 leading-relaxed placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-y font-normal"
                  />
                </div>

                {/* Actionable Checklist Section */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-800">Actionable Checklist</h3>
                    </div>
                    {activeChecklistTotal > 0 && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                        {activeChecklistDone} of {activeChecklistTotal} completed
                      </span>
                    )}
                  </div>

                  {/* Add Checklist Item Input */}
                  <form onSubmit={handleAddChecklistItem} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      placeholder="Add an actionable checklist task (Press Enter)..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                    />
                    <button
                      type="submit"
                      disabled={!newChecklistText.trim()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </form>

                  {/* Checklist Items Rows */}
                  {activeDraft.checklist_items.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No checklist tasks added to this note yet. Use the input above to list actionable milestones.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeDraft.checklist_items.map((item, index) => {
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition ${
                              item.completed
                                ? 'bg-slate-50/70 border-slate-200/60 text-slate-400'
                                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {/* Checkbox */}
                              <button
                                type="button"
                                onClick={() => handleToggleChecklistItem(item.id)}
                                className="text-slate-400 hover:text-blue-600 transition flex-shrink-0"
                              >
                                {item.completed ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                ) : (
                                  <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                                )}
                              </button>

                              {/* Editable Text */}
                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleEditChecklistItem(item.id, e.target.value)}
                                className={`w-full bg-transparent border-none outline-none text-xs md:text-sm focus:ring-0 ${
                                  item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}
                              />
                            </div>

                            {/* Item Actions: Up, Down, Delete */}
                            <div className="flex items-center space-x-1 flex-shrink-0 text-slate-400">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveChecklistItem(index, 'up')}
                                title="Move up"
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 hover:text-slate-600"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === activeDraft.checklist_items.length - 1}
                                onClick={() => handleMoveChecklistItem(index, 'down')}
                                title="Move down"
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 hover:text-slate-600"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteChecklistItem(item.id)}
                                title="Remove task"
                                className="p-1 rounded hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 shadow-xs">
                <ListTodo className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">No Note Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
                Select an existing note from the list on the left, or create a brand new note to organize study milestones.
              </p>
              <button
                onClick={handleCreateNewNote}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
