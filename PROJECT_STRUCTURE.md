# Project Structure Notes

## Context
This repo houses a new Vite/TypeScript runtime (`src/…`) plus the legacy build artifacts (`public/js/**` and `legacy/**`). The goal of the migration is to keep the runtime/editor logic in `src/` while preserving reference copies of the old bundle for export/backward compatibility.

## Key areas
- `src/runtime`: modern TypeScript domain/adapters/services for the engine, renderer and share system.
- `src/editor`: the editor UI/services now rewritten in TypeScript; prefer this over the legacy `public/editor` logic.
- `src/__tests__`: Vitest suite covering runtime + editor behavior; keep updates here synchronized with the new code.
- `public/js` + `public/styles.css`: legacy output that gets referenced by the runtime export flow; avoid editing unless you are updating the legacy bundle.
- `src/legacy`: static typings and glue (e.g., `globals.d.ts`) needed during the incremental migration; once the conversion completes you can remove the folder.

## Migration mindset
- Make changes under `src/` first.
- Only touch `public/js` if you are regenerating the legacy bundle for browser export.
- Keep `PROJECT_STRUCTURE.md` updated if you add new folders or move key pieces.
