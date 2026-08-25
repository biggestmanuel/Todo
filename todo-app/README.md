# Todo App with Deadlines

Minimal CRUD todo app. Next.js API routes + Supabase (Postgres) for
persistence. Zero cost on free tiers.

## 1. Create a Supabase project

1. Go to supabase.com, sign in with GitHub, create a new project (free tier).
2. Wait for it to finish provisioning (~2 min).
3. Go to the SQL Editor in the Supabase dashboard and run this to create
   the table:

```sql
create table todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  deadline timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security: since this is a single-user learning project,
-- the simplest policy is "allow everything" for now. In a real
-- multi-user app you'd scope this to auth.uid().
alter table todos enable row level security;

create policy "Allow all access to todos"
on todos for all
using (true)
with check (true);
```

4. Go to Project Settings -> API and copy the "Project URL" and the
   "anon public" key.

## 2. Configure the app

```bash
cp .env.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 4. Deploy (optional, still free)

Push to GitHub, import the repo in Vercel, add the same two env vars
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the
Vercel project settings, deploy.

## What's actually happening (read this before you say it's done)

- **Persistence**: every create/edit/delete/toggle hits a Next.js API
  route (`app/api/todos/...`), which talks to Supabase's Postgres over
  their client library. Nothing lives in React state alone — refresh
  the page and `loadTodos()` re-fetches from the DB on mount.
- **IDs**: Postgres generates a `uuid` per row (`gen_random_uuid()`),
  not an auto-increment int — this is what you'd use in any real
  multi-service system, since UUIDs don't collide across services.
- **RLS policy**: the "allow all" policy above is intentionally wide
  open — fine for a solo learning project, but in anything real you'd
  scope reads/writes to the authenticated user. Worth understanding
  *why* this policy is a shortcut, not a pattern to copy elsewhere.
- **Overdue logic**: computed client-side (`isOverdue`), by comparing
  `deadline` to `new Date()` at render time — not stored as a field,
  since "overdue" is a derived fact, not real data.

## Folder structure

```
app/
  api/todos/route.js         GET (list), POST (create)
  api/todos/[id]/route.js    PATCH (update/toggle), DELETE
  page.js                    UI — form, filters, list
  layout.js, globals.css
lib/supabase.js              shared Supabase client
```
