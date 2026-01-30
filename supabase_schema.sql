-- Users Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('admin', 'teacher', 'parent', 'student')),
  name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Students Table
create table public.students (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id), -- If student has a login
  coach_id uuid references public.profiles(id),
  parent_id uuid references public.profiles(id),
  student_number text,
  name text not null,
  class_grade text,
  exam_goal text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Results Table
create table public.results (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id),
  lesson text,
  topic text,
  source_name text,
  correct integer,
  incorrect integer,
  empty integer,
  date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Report Cards Table
create table public.report_cards (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id),
  month text,
  year integer,
  total_score integer,
  badge text,
  coach_comment text,
  data jsonb, -- Stores lesson breakdown snapshot
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES --

alter table public.students enable row level security;
alter table public.results enable row level security;
alter table public.report_cards enable row level security;

-- Policy: Coaches can view/edit all students they are assigned to
create policy "Coaches view assigned students" on public.students
  for all using ( auth.uid() = coach_id );

-- Policy: Parents can view only their children
create policy "Parents view own children" on public.students
  for select using ( auth.uid() = parent_id );

-- Policy: Students can view themselves
create policy "Students view self" on public.students
  for select using ( auth.uid() = profile_id );
  
-- Result Policies
create policy "Coaches manage results" on public.results
  for all using ( exists ( select 1 from public.students where id = results.student_id and coach_id = auth.uid() ) );

create policy "Students/Parents view results" on public.results
  for select using ( 
    exists ( select 1 from public.students where id = results.student_id and (profile_id = auth.uid() or parent_id = auth.uid()) )
  );
