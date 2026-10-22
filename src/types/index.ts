export type Year = 1 | 2 | 3 | 4;
export type Semester = 1 | 2;
export type UserRole = 'student' | 'admin';

export type ResourceType = 'pdf' | 'notes' | 'syllabus' | 'nptel' | 'youtube' | 'simulation' | 'link';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  fileSize?: string;
  url?: string; // Google Drive link, Supabase storage URL, external link, or local path
  uploadedAt: string;
  isPlaceholder?: boolean;
}

export interface Subject {
  id: string;
  year: Year;
  semester: Semester;
  code: string;
  name: string;
  shortForm?: string;
  description: string;
  syllabusOverview?: string;
  resources: ResourceItem[];
}

export interface SimulationTool {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  url?: string;
  linkedSubjects: string[]; // Subject IDs or codes
  isExternal: true;
}

export interface NptelCourse {
  id: string;
  title: string;
  instructor: string;
  institute: string;
  subjectCode?: string;
  subject: string; // e.g., 'Signals and Systems', 'Analog Circuits', 'Digital Signal Processing'
  url: string;
  lectureCount: number;
}

export interface YouTubeResource {
  id: string;
  channelName: string;
  title: string;
  category: string; // e.g., 'Digital Electronics', 'MATLAB', 'VLSI', 'GATE Preparation'
  subject: string;  // e.g., 'Core ECE', 'Embedded & Arduino', 'VLSI Design'
  url: string;
  recommendedFor: string;
  isPlaylist?: boolean;
}

export interface GateSubject {
  id: string;
  name: string;
  code: string;
  weightage: string;
  icon: string;
  topicsCount: number;
  completedTopics: number;
  syllabus: string[];
  pyqCount: number;
  notesAvailable: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string;
  timeSlot?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  category: 'BOS' | 'GATE' | 'Simulation' | 'NPTEL' | 'YouTube';
  url?: string;
  addedAt: string;
}

export interface StudyActivityRecord {
  id: string;
  date: string; // YYYY-MM-DD local format
  type: 'bos_completed' | 'gate_topic' | 'planner_task' | 'study_session';
  title: string;
  timestamp: number;
  durationMinutes?: number; // actual elapsed minutes studied
  subject?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rguktId?: string;
  branch: string;
  year: Year;
  avatarUrl?: string;
  streakDays: number;
  bestStreakDays?: number;
  completedBosSubjects: number;
  totalBosSubjects: number;
  completedGateTopics: number;
  totalGateTopics: number;
  lastActiveDate?: string;
}

export interface TodoChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoNote {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  checklist_items: TodoChecklistItem[];
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
