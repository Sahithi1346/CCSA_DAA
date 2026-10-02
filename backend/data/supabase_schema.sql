-- ====================================================================
-- SUPABASE SCHEMA FOR ALL CANDIDATES, COLLEGES & CUTOFFS
-- Copy and run this in Supabase Dashboard -> SQL Editor -> Run
-- ====================================================================

-- 1. DROP OLD TABLES IF ANY INCOMPLETE ONES EXIST
drop table if exists public.cutoffs cascade;
drop table if exists public.students cascade;
drop table if exists public.colleges cascade;
drop table if exists public.allocations cascade;

-- 2. COLLEGES TABLE (213 TS Engineering Institutes)
create table public.colleges (
  inst_code text primary key,
  institute_name text not null,
  place text,
  district text,
  coed text,
  institute_type text,
  year_of_estb text,
  affiliated text
);

-- 3. CUTOFFS TABLE (Official 2021 Final Phase Cutoffs)
create table public.cutoffs (
  id bigint generated always as identity primary key,
  inst_code text references public.colleges(inst_code) on delete cascade,
  branch_code text not null,
  branch_name text not null,
  tuition_fee numeric,
  oc_boys integer,
  oc_girls integer,
  bc_a_boys integer,
  bc_a_girls integer,
  bc_b_boys integer,
  bc_b_girls integer,
  bc_c_boys integer,
  bc_c_girls integer,
  bc_d_boys integer,
  bc_d_girls integer,
  bc_e_boys integer,
  bc_e_girls integer,
  sc_boys integer,
  sc_girls integer,
  st_boys integer,
  st_girls integer,
  ews_gen integer,
  ews_girls integer
);

-- 4. STUDENTS TABLE (1,000 Real EAMCET Students)
create table public.students (
  student_id text primary key,
  student_name text not null,
  inter_marks integer,
  eamcet_marks integer,
  eamcet_rank integer not null,
  category text not null,
  preference_1 text,
  preference_2 text,
  preference_3 text,
  preference_4 text,
  preference_5 text
);

-- 5. ALLOCATION RESULTS TABLE (Stores live allocation runs)
create table public.allocations (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  student_name text not null,
  eamcet_rank integer not null,
  category text not null,
  allocated_college text,
  allocated_branch text,
  status text not null,
  preference_number integer,
  algorithm text default 'Greedy',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and grant permissions for reading and inserting
alter table public.colleges enable row level security;
alter table public.cutoffs enable row level security;
alter table public.students enable row level security;
alter table public.allocations enable row level security;

create policy "Allow read on colleges" on public.colleges for select using (true);
create policy "Allow insert on colleges" on public.colleges for all using (true);

create policy "Allow read on cutoffs" on public.cutoffs for select using (true);
create policy "Allow insert on cutoffs" on public.cutoffs for all using (true);

create policy "Allow read on students" on public.students for select using (true);
create policy "Allow insert on students" on public.students for all using (true);

create policy "Allow read on allocations" on public.allocations for select using (true);
create policy "Allow insert on allocations" on public.allocations for all using (true);
