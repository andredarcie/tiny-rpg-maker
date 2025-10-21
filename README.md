# Tiny RPG Maker Engine

Tiny RPG Maker is a modular 8x8 tile adventure engine with a clear split between the runtime and the editor UI.

## Project Structure

```
tiny-rpg-maker/
|-- index.html            # Application shell and tab layout
|-- styles.css            # Global styling for the game and editor
|-- js/
|   |-- main.js           # App bootstrap and tab coordination
|   |-- core/
|   |   |-- GameEngine.js
|   |   |-- GameState.js
|   |   |-- InputManager.js
|   |   |-- NPCManager.js
|   |   |-- Renderer.js
|   |   `-- TileManager.js
|   `-- editor/
|       `-- EditorManager.js
|-- engine.js             # Standalone build used by the editor HTML export
`-- README.md
```

## Features

### Game Runtime
- 8x8 tile grid with customizable pixel art tiles
- NPC support with interactive dialog boxes
- Wall and tile collision, room exits, and collectible items
- Room switching and palette management

### Editor
- Pixel-perfect tile editor
- Map painting with ground and overlay layers
- NPC manager with placement and dialog editing
- Undo and redo history, JSON import or export, and HTML export helper

## Getting Started

### 1. Run a Local Server

```bash
python -m http.server 8000
```

### 2. Open the App

Visit `http://localhost:8000` in your browser.

### 3. Build Your Game

1. Select the **Editor** tab.
2. Draw tiles in the tile editor.
3. Paint the overworld map with your tiles.
4. Add NPCs, items, and exits.
5. Switch to the **Game** tab to play-test using the arrow keys.

## Module Overview

### GameState.js
Stores the entire game definition:
- Game metadata (title, palette, rooms)
- Player position and dialog state
- Tileset map, sprites, exits, and items

### TileManager.js
Manages tiles and tile maps:
- Creates blank tiles
- Adds, removes, and updates tiles
- Updates ground and overlay layers
- Seeds default ground tiles when the world is empty

### NPCManager.js
Handles NPC creation and dialog updates:
- Generates IDs
- Adds and updates NPCs
- Filters NPCs per room
- Stores dialog text

### InputManager.js
Processes keyboard and editor pointer input:
- Player movement and interaction keys
- Dialog dismissal shortcuts
- Canvas painting helpers for the editor

### Renderer.js
Draws every frame:
- Ground, overlay tiles, and walls
- Items, NPCs, and the player sprite
- Dialog box rendering
- Tile previews for the editor UI

### GameEngine.js
Coordinates the runtime:
- Boots all core modules
- Owns movement, collision, and interaction checks
- Synchronizes the document title with the game

### EditorManager.js
Controls the editor UI:
- DOM binding and resize handling
- History stack management
- Import, export, and HTML generation
- Canvas interactions for map and tile editing

## Public API

The engine exposes a runtime API on `window.TinyRPGMaker`:

```javascript
// Game data
TinyRPGMaker.exportGameData();      // Export current game as JSON
TinyRPGMaker.importGameData(data);  // Load a game definition
TinyRPGMaker.getState();            // Read-only access to internal state
TinyRPGMaker.draw();                // Force a render pass
TinyRPGMaker.resetGame();           // Reset player position and dialog

// Tiles
TinyRPGMaker.addTile(tile);
TinyRPGMaker.updateTile(id, data);
TinyRPGMaker.createBlankTile(name);
TinyRPGMaker.setMapTile(x, y, id);
TinyRPGMaker.getTiles();
TinyRPGMaker.getTileMap();

// NPCs
TinyRPGMaker.addSprite(npc);
TinyRPGMaker.getSprites();
```

## Customization

### Colors
Update the palette in `GameState.js`:

```javascript
palette: ['#0e0f13', '#2e3140', '#f4f4f8']
```

### Map Size
The grid defaults to 8x8. Adjust the constants in the core modules if you need larger rooms.

## Implementation Notes

1. Single responsibility: each module focuses on one concern.
2. Encapsulation: shared state lives in `GameState`, while managers expose intent-based methods.
3. Modularity: the editor talks to the engine exclusively through public APIs.
4. Naming: functions and variables favor descriptive identifiers.
5. Documentation: comments describe non-obvious behavior where helpful.
6. Compatibility: the runtime API remains stable for editor integrations.

## Troubleshooting

### Editor does not respond
- Ensure every JavaScript file listed in `index.html` is being served.
- Check the browser console for runtime errors.
- Confirm the development server is running.

### Tiles are invisible
- Verify that at least one tile exists in the tileset.
- Use "Add Tile" to create a starter tile.
- Make sure the tile is selected before painting the map.

### NPCs do not interact
- Confirm the NPC is placed in the correct room.
- Add dialog text in the NPC panel.
- Stand on the NPC and press `Z` or `Enter` to trigger dialog.

## License

This project is released for educational purposes. Use it freely in your own experiments and prototypes.
