create table leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  number text not null,
  status text not null,
  created_at timestamp with time zone default now()
);
alter table leads enable row level security;
create policy "User can manage own leads" on leads for all using (true);
