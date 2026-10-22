import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  UserProfile,
  Subject,
  ResourceItem,
  ResourceType,
  SimulationTool,
  NptelCourse,
  YouTubeResource,
  GateSubject,
  StudyTask,
  Bookmark,
  StudyActivityRecord,
  TodoNote
} from '../types';
import {
  sampleSubjects,
  simulationTools,
  nptelCourses,
  youtubeResources,
  gateSubjects,
  SUBJECTS_DATA_VERSION
} from '../data/mockData';
import {
  calculateStudyStreakStats,
  formatLocalDate,
  getLast7DaysActivity,
  DAILY_STREAK_GOAL_MINUTES
} from '../utils/dateAndStreak';
import type { DayActivityStatus } from '../utils/dateAndStreak';

export type HubView =
  | 'welcome'
  | 'dashboard'
  | 'bos'
  | 'gate'
  | 'simulation'
  | 'nptel'
  | 'youtube'
  | 'bookmarks'
  | 'planner'
  | 'profile'
  | 'academic-calendar'
  | 'todo';

interface AppContextType {
  user: UserProfile;
  isAdmin: boolean;

  currentView: HubView;
  setCurrentView: (view: HubView) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // BOS Academic Management
  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id' | 'resources'>) => { success: boolean; error?: string };
  deleteSubject: (id: string) => { success: boolean; error?: string };
  addResourceToSubject: (
    subjectId: string,
    title: string,
    type: ResourceType,
    url?: string,
    fileSize?: string
  ) => { success: boolean; error?: string };
  editResource: (
    subjectId: string,
    resourceId: string,
    updates: Partial<Pick<ResourceItem, 'title' | 'type' | 'url' | 'fileSize'>>
  ) => { success: boolean; error?: string };
  deleteResource: (subjectId: string, resourceId: string) => { success: boolean; error?: string };

  // BOS Subject Completion
  completedBosSubjectIds: string[];
  toggleBosSubjectCompletion: (subjectId: string) => void;
  isBosSubjectCompleted: (subjectId: string) => boolean;

  // External Academic Tools & Courses
  tools: SimulationTool[];
  nptelList: NptelCourse[];
  ytList: YouTubeResource[];

  // GATE Preparation
  gateList: GateSubject[];
  toggleGateTopic: (subjectId: string, delta: number) => void;

  // Private Student Study Planner (Local Storage)
  tasks: StudyTask[];
  addTask: (title: string, subject: string, priority: 'low' | 'medium' | 'high', timeSlot?: string, notes?: string) => void;
  updateTaskNotes: (id: string, notes: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notebook-Style Todo Notes (Local Storage)
  todoNotes: TodoNote[];
  saveTodoNote: (note: TodoNote) => void;
  deleteTodoNote: (id: string) => void;

  // Bookmarks (Local Storage)
  bookmarks: Bookmark[];
  toggleBookmark: (title: string, category: Bookmark['category'], url?: string) => void;
  isBookmarked: (title: string) => boolean;

  // Study Activities & Streak Tracking (60-min daily threshold)
  studyActivities: StudyActivityRecord[];
  currentStreak: number;
  bestStreak: number;
  activeToday: boolean;
  todayStudyMinutes: number;
  remainingMinutesToday: number;
  dailyStreakGoalMinutes: number;
  last7DaysActivity: DayActivityStatus[];
  logStudySession: (subjectTitle: string, durationMinutes: number, notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'public-student',
  name: 'Student Learner',
  email: 'student@learning.hub',
  role: 'student',
  branch: 'Electronics and Communication Engineering',
  year: 2,
  completedBosSubjects: 0,
  totalBosSubjects: 30,
  completedGateTopics: 0,
  totalGateTopics: 65,
  streakDays: 0,
  bestStreakDays: 0
};

// Helper to migrate or read from localStorage
const getInitialStoredData = <T,>(primaryKey: string, fallbackKeyPrefix: string, defaultValue: T): T => {
  try {
    const direct = localStorage.getItem(primaryKey);
    if (direct) {
      return JSON.parse(direct);
    }
    // Check if an earlier user-scoped key exists and migrate it
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(fallbackKeyPrefix)) {
        const val = localStorage.getItem(key);
        if (val) {
          const parsed = JSON.parse(val);
          localStorage.setItem(primaryKey, val);
          return parsed;
        }
      }
    }
  } catch {
    // fallback
  }
  return defaultValue;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / View State: default to 'welcome' for fresh sessions, preserve on refresh
  const [currentView, setCurrentView] = useState<HubView>(() => {
    try {
      const saved = sessionStorage.getItem('slh_current_view');
      if (saved && saved !== 'undefined') {
        return saved as HubView;
      }
      return 'welcome';
    } catch {
      return 'welcome';
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('slh_current_view', currentView);
    } catch {
      // ignore
    }
  }, [currentView]);

  const [searchQuery, setSearchQuery] = useState('');

  // Theme Management (Light / Dark mode persisted in localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('slh_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('slh_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Shared academic curriculum subjects
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('slh_subjects');
      const savedVersion = localStorage.getItem('slh_subjects_version');
      if (saved && savedVersion && Number(savedVersion) === SUBJECTS_DATA_VERSION) {
        const parsed: Subject[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem('slh_subjects_version', String(SUBJECTS_DATA_VERSION));
      return sampleSubjects;
    } catch {
      return sampleSubjects;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('slh_subjects', JSON.stringify(subjects));
    } catch {
      // ignore
    }
  }, [subjects]);

  const [tools] = useState<SimulationTool[]>(simulationTools);
  const [nptelList] = useState<NptelCourse[]>(nptelCourses);
  const [ytList] = useState<YouTubeResource[]>(youtubeResources);

  // --- Student Personal Data States (Stored locally in localStorage) ---
  const [completedBosSubjectIds, setCompletedBosSubjectIds] = useState<string[]>(() =>
    getInitialStoredData<string[]>('slh_bos_completed', 'slh_bos_completed_', [])
  );

  const [gateList, setGateList] = useState<GateSubject[]>(() =>
    getInitialStoredData<GateSubject[]>('slh_gate', 'slh_gate_', gateSubjects)
  );

  const [tasks, setTasks] = useState<StudyTask[]>(() =>
    getInitialStoredData<StudyTask[]>('slh_tasks', 'slh_tasks_', [])
  );

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    getInitialStoredData<Bookmark[]>('slh_bookmarks', 'slh_bookmarks_', [])
  );

  const [studyActivities, setStudyActivities] = useState<StudyActivityRecord[]>(() =>
    getInitialStoredData<StudyActivityRecord[]>('slh_activity', 'slh_activity_', [])
  );

  const [todoNotes, setTodoNotes] = useState<TodoNote[]>(() =>
    getInitialStoredData<TodoNote[]>('slh_todo_notes', 'slh_todo_notes_', [])
  );

  // Sync personal state to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('slh_bos_completed', JSON.stringify(completedBosSubjectIds));
    } catch {
      // ignore
    }
  }, [completedBosSubjectIds]);

  useEffect(() => {
    try {
      localStorage.setItem('slh_gate', JSON.stringify(gateList));
    } catch {
      // ignore
    }
  }, [gateList]);

  useEffect(() => {
    try {
      localStorage.setItem('slh_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('slh_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('slh_activity', JSON.stringify(studyActivities));
    } catch {
      // ignore
    }
  }, [studyActivities]);

  useEffect(() => {
    try {
      localStorage.setItem('slh_todo_notes', JSON.stringify(todoNotes));
    } catch {
      // ignore
    }
  }, [todoNotes]);

  // Todo Notes operations
  const saveTodoNote = useCallback((noteToSave: TodoNote) => {
    setTodoNotes(prev => {
      const index = prev.findIndex(n => n.id === noteToSave.id);
      const updated: TodoNote = {
        ...noteToSave,
        updated_at: new Date().toISOString()
      };
      if (index >= 0) {
        const next = [...prev];
        next[index] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  }, []);

  const deleteTodoNote = useCallback((id: string) => {
    setTodoNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // Streak calculations derived from recorded study activities (60-min daily threshold)
  const streakStats = useMemo(() => {
    return calculateStudyStreakStats(studyActivities, DAILY_STREAK_GOAL_MINUTES);
  }, [studyActivities]);

  const last7DaysActivity = useMemo(() => {
    return getLast7DaysActivity(studyActivities, DAILY_STREAK_GOAL_MINUTES);
  }, [studyActivities]);

  const recordActivity = useCallback((
    type: StudyActivityRecord['type'],
    title: string,
    durationMinutes?: number,
    subject?: string,
    notes?: string
  ) => {
    const today = formatLocalDate(new Date());
    const newRecord: StudyActivityRecord = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: today,
      type,
      title,
      timestamp: Date.now(),
      durationMinutes,
      subject,
      notes
    };
    setStudyActivities(prev => [newRecord, ...prev]);
  }, []);

  // Public user profile computed dynamically
  const user = useMemo<UserProfile>(() => {
    const totalGateCompleted = gateList.reduce((acc, curr) => acc + curr.completedTopics, 0);
    const totalGateTopics = gateList.reduce((acc, curr) => acc + curr.topicsCount, 0);

    return {
      ...DEFAULT_USER_PROFILE,
      completedBosSubjects: completedBosSubjectIds.length,
      totalBosSubjects: subjects.length,
      completedGateTopics: totalGateCompleted,
      totalGateTopics,
      streakDays: streakStats.currentStreak,
      bestStreakDays: streakStats.bestStreak,
      lastActiveDate: streakStats.lastActiveDate || undefined
    };
  }, [completedBosSubjectIds.length, subjects.length, gateList, streakStats]);

  // BOS Subject Completion
  const toggleBosSubjectCompletion = (subjectId: string) => {
    setCompletedBosSubjectIds(prev => {
      const isCompleted = prev.includes(subjectId);
      if (isCompleted) {
        return prev.filter(id => id !== subjectId);
      } else {
        const sub = subjects.find(s => s.id === subjectId);
        recordActivity('bos_completed', `Completed BOS subject: ${sub?.name || subjectId}`);
        return [...prev, subjectId];
      }
    });
  };

  const isBosSubjectCompleted = (subjectId: string) => {
    return completedBosSubjectIds.includes(subjectId);
  };

  // GATE Subject & Topic Progress
  const toggleGateTopic = (subjectId: string, delta: number) => {
    setGateList(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const nextCompleted = Math.max(0, Math.min(s.topicsCount, s.completedTopics + delta));
      if (delta > 0 && nextCompleted > s.completedTopics) {
        recordActivity('gate_topic', `Completed topic in ${s.name} (${nextCompleted}/${s.topicsCount})`);
      }
      return { ...s, completedTopics: nextCompleted };
    }));
  };

  // Study Planner
  const addTask = (title: string, subject: string, priority: 'low' | 'medium' | 'high', timeSlot?: string, notes?: string) => {
    const newTask: StudyTask = {
      id: `tsk-${Date.now()}`,
      title,
      subject,
      priority,
      timeSlot: timeSlot || 'Today',
      date: 'Today',
      completed: false,
      notes: notes?.trim() || undefined
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskNotes = (id: string, notes: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, notes: notes.trim() };
    }));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextCompleted = !t.completed;
      if (nextCompleted) {
        recordActivity('planner_task', `Completed task: ${t.title}`);
      }
      return { ...t, completed: nextCompleted };
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Study Session Logger
  const logStudySession = (subjectTitle: string, durationMinutes: number, notes?: string) => {
    const noteText = notes ? ` — ${notes}` : '';
    recordActivity(
      'study_session',
      `Studied ${subjectTitle} (${durationMinutes} mins)${noteText}`,
      durationMinutes,
      subjectTitle,
      notes
    );
  };

  // Bookmarks
  const toggleBookmark = (title: string, category: Bookmark['category'], url?: string) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.title === title);
      if (exists) {
        return prev.filter(b => b.title !== title);
      } else {
        return [
          { id: `bm-${Date.now()}`, title, category, url, addedAt: formatLocalDate(new Date()) },
          ...prev
        ];
      }
    });
  };

  const isBookmarked = (title: string) => {
    return bookmarks.some(b => b.title === title);
  };

  // BOS Operations
  const addSubject = (newSub: Omit<Subject, 'id' | 'resources'>): { success: boolean; error?: string } => {
    const created: Subject = {
      ...newSub,
      id: `sub-${Date.now()}`,
      resources: []
    };
    setSubjects(prev => [created, ...prev]);
    return { success: true };
  };

  const deleteSubject = (id: string): { success: boolean; error?: string } => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    return { success: true };
  };

  const addResourceToSubject = (
    subjectId: string,
    title: string,
    type: ResourceType,
    url?: string,
    fileSize?: string
  ): { success: boolean; error?: string } => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const resItem: ResourceItem = {
        id: `res-${Date.now()}`,
        title: title.trim(),
        type,
        url: url?.trim() || (type === 'pdf' ? '/ECE.pdf' : undefined),
        fileSize: fileSize || (type === 'link' || type === 'youtube' || type === 'nptel' || type === 'simulation' ? undefined : '2.4 MB'),
        uploadedAt: formatLocalDate(new Date()),
      };
      return { ...s, resources: [...s.resources, resItem] };
    }));
    return { success: true };
  };

  const editResource = (
    subjectId: string,
    resourceId: string,
    updates: Partial<Pick<ResourceItem, 'title' | 'type' | 'url' | 'fileSize'>>
  ): { success: boolean; error?: string } => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        resources: s.resources.map(r => r.id === resourceId ? { ...r, ...updates } : r)
      };
    }));
    return { success: true };
  };

  const deleteResource = (subjectId: string, resourceId: string): { success: boolean; error?: string } => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        resources: s.resources.filter(r => r.id !== resourceId)
      };
    }));
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin: false,
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        subjects,
        addSubject,
        deleteSubject,
        addResourceToSubject,
        editResource,
        deleteResource,
        completedBosSubjectIds,
        toggleBosSubjectCompletion,
        isBosSubjectCompleted,
        tools,
        nptelList,
        ytList,
        gateList,
        toggleGateTopic,
        tasks,
        addTask,
        updateTaskNotes,
        toggleTask,
        deleteTask,
        todoNotes,
        saveTodoNote,
        deleteTodoNote,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        studyActivities,
        currentStreak: streakStats.currentStreak,
        bestStreak: streakStats.bestStreak,
        activeToday: streakStats.activeToday,
        todayStudyMinutes: streakStats.todayMinutes,
        remainingMinutesToday: streakStats.remainingMinutesToday,
        dailyStreakGoalMinutes: DAILY_STREAK_GOAL_MINUTES,
        last7DaysActivity,
        logStudySession
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
