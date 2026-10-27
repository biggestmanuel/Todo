# Code workspace

Multi-project workspace. Each subfolder is an independent project with its own
README and, where present, its own `AGENTS.md`. The root `AGENTS.md` holds
standing working rules that apply across the workspace; it is gitignored and
never committed or pushed.

## Projects

| Project | Description |
|---|---|
| `password-manager/` | Zero-knowledge password manager (Next.js 15, TypeScript, Supabase). Backend API layer migrated to TypeScript; see `password-manager/AGENTS.md` and `password-manager/README.md`. |
| `Bulk-sender/`, `Cavaner/`, `Grayler/`, `kindoku/`, `manuel-portfolio/`, `Qerad/`, `Unimap/`, `vorth/` | Submodules / independent projects. See each subfolder. |

## Root files

- `AGENTS.md` — standing agent working rules (gitignored, never committed)
- `.gitignore` — root-level ignore rules

## Getting started

Work happens on branches, never directly on `main` (see `AGENTS.md`, Rule 1).