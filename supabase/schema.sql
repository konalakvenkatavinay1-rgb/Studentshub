-- ==============================================================================
-- Supabase Schema Migration: Role-Based Access Control (RBAC) + Private User Isolation
-- System: Student Learning Hub — BOS Academic Library & GATE 2028
-- ==============================================================================

-- 1. App Roles Enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('student', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table with Secure Role Assignment
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'student',
  rgukt_id TEXT,
  branch TEXT DEFAULT 'Electronics and Communication Engineering',
  year INT DEFAULT 2 CHECK (year BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security Helper Function: check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their initial profile as student" ON public.profiles;
CREATE POLICY "Users can insert their initial profile as student"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id AND role = 'student' -- NEVER allow self-elevation to admin at signup
  );

DROP POLICY IF EXISTS "Users can update their personal profile info except role" ON public.profiles;
CREATE POLICY "Users can update their personal profile info except role"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Only existing admins or superuser can promote another user to admin role
DROP POLICY IF EXISTS "Admins can update user roles" ON public.profiles;
CREATE POLICY "Admins can update user roles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- 3. Subjects Table (Curriculum BOS Structure: Year 1-4, Sem 1-2)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INT NOT NULL CHECK (year BETWEEN 1 AND 4),
  semester INT NOT NULL CHECK (semester BETWEEN 1 AND 2),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Everyone can view academic subjects
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can insert, update, or delete subjects
DROP POLICY IF EXISTS "Only admins can insert subjects" ON public.subjects;
CREATE POLICY "Only admins can insert subjects"
  ON public.subjects FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update subjects" ON public.subjects;
CREATE POLICY "Only admins can update subjects"
  ON public.subjects FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete subjects" ON public.subjects;
CREATE POLICY "Only admins can delete subjects"
  ON public.subjects FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. Shared Academic Resources Table (PDFs, Notes, Syllabi, NPTEL, YouTube, Sim Tools)
CREATE TABLE IF NOT EXISTS public.academic_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'notes', 'syllabus', 'nptel', 'youtube', 'simulation', 'link')),
  url TEXT, -- Google Drive link, Supabase Storage public URL, or external link
  file_size TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;

-- Students and public can view all shared academic resources
DROP POLICY IF EXISTS "Anyone can view academic resources" ON public.academic_resources;
CREATE POLICY "Anyone can view academic resources"
  ON public.academic_resources FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only verified admins can insert new resources
DROP POLICY IF EXISTS "Only admins can insert resources" ON public.academic_resources;
CREATE POLICY "Only admins can insert resources"
  ON public.academic_resources FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Only verified admins can update or replace resources
DROP POLICY IF EXISTS "Only admins can update resources" ON public.academic_resources;
CREATE POLICY "Only admins can update resources"
  ON public.academic_resources FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only verified admins can delete resources
DROP POLICY IF EXISTS "Only admins can delete resources" ON public.academic_resources;
CREATE POLICY "Only admins can delete resources"
  ON public.academic_resources FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 5. Private GATE 2028 Study Planner (STRICT USER ISOLATION)
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  date TEXT DEFAULT 'Today',
  time_slot TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

-- User Isolation: Students can only view their own study tasks
DROP POLICY IF EXISTS "Users can only view their own study tasks" ON public.study_tasks;
CREATE POLICY "Users can only view their own study tasks" 
  ON public.study_tasks FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- User Isolation: Students can only insert tasks for themselves
DROP POLICY IF EXISTS "Users can create their own study tasks" ON public.study_tasks;
CREATE POLICY "Users can create their own study tasks" 
  ON public.study_tasks FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Isolation: Students can only update their own tasks
DROP POLICY IF EXISTS "Users can update their own study tasks" ON public.study_tasks;
CREATE POLICY "Users can update their own study tasks" 
  ON public.study_tasks FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Isolation: Students can only delete their own tasks
DROP POLICY IF EXISTS "Users can delete their own study tasks" ON public.study_tasks;
CREATE POLICY "Users can delete their own study tasks" 
  ON public.study_tasks FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Private User Bookmarks (STRICT USER ISOLATION)
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('BOS', 'GATE', 'Simulation', 'NPTEL', 'YouTube')),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only view their own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users can only view their own bookmarks" 
  ON public.user_bookmarks FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users can insert their own bookmarks" 
  ON public.user_bookmarks FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. Private Study Activity Records (For 60-min streak tracking)
CREATE TABLE IF NOT EXISTS public.study_activity_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  subject TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.study_activity_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own activity records" ON public.study_activity_records;
CREATE POLICY "Users can view their own activity records" 
  ON public.study_activity_records FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activity records" ON public.study_activity_records;
CREATE POLICY "Users can insert their own activity records" 
  ON public.study_activity_records FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Storage Bucket Setup for Document Uploads (If Supabase Storage is configured)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('academic_materials', 'academic_materials', true)
-- ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Public Access to Academic Materials"
-- ON storage.objects FOR SELECT TO authenticated, anon USING (bucket_id = 'academic_materials');

-- CREATE POLICY "Admin-Only Upload to Academic Materials"
-- ON storage.objects FOR INSERT TO authenticated WITH CHECK (
--   bucket_id = 'academic_materials' AND public.is_admin()
-- );
