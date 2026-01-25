# Tiny RPG Studio

Tiny RPG Studio is a browser-native RPG maker. Paint tiles, build rooms, drop NPCs/enemies/objects, and play instantly in the same page. It is intentionally small and constrained to spark creativity: build micro-stories in minutes and share everything as a single URL.

## Features
- Side-by-side Editor/Game tabs for instant iteration.
- Shareable games: one URL encodes the full game state.
- Lightweight runtime: fast load, no heavy framework dependencies.
- Editor tools for tiles, NPCs, enemies, objects, variables, and worlds.

## Requirements
- Node.js 18+ (recommended)
- npm

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build
```bash
npm run build
```

## Preview Production Build
```bash
npm run preview
```

## Tests
```bash
npm test
```

### E2E (Playwright)
```bash
npx playwright install
npm run test:e2e
```

## Project Structure
```
src/
  core/              Core game systems (engine, renderer, tiles, share, etc.)
  editor/            Editor UI logic and services
  state/             Game state facades and managers
  __tests__/         Vitest unit tests
public/
  js/                Legacy JS assets kept for reference
  styles.css         Global styles
index.html           Main entry (Vite)
vite.config.ts       Vite config
```

## Share Codes
- The app serializes game data into compact share codes.
- Codes can be shared as a URL hash (e.g. `#v1...`) and decoded on load.

## Export Mode
Some editor flows render exports with flags set on `window` (e.g. `__TINY_RPG_EXPORT_MODE`).
When exporting, the app can open a new tab and generate a static HTML payload.

## Contributing
- Keep changes small and focused.
- Add tests for new logic when possible.
- Run `npm test` before opening a PR.

## License
See the repository license file.
