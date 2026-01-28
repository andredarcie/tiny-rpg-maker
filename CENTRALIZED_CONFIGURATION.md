# Centralized Configuration - Implementation

> **Portuguese version**: [CONFIGURACAO_CENTRALIZADA.md](./CONFIGURACAO_CENTRALIZADA.md)

## Summary

Architecture improvement #9 has been implemented: **Centralized Configuration**. All constants and "magic numbers" scattered throughout the code have been consolidated into centralized configuration files.

## Created Files

### 1. `src/config/GameConfig.ts`

Centralized configuration file for the game runtime, containing:

#### Canvas Configuration
- `width`, `height`: Canvas dimensions (128x152)
- `minTileSize`: Minimum tile size (8px)
- `minHudHeight`, `hudHeightMultiplier`: HUD configuration
- `minInventoryHeight`, `inventoryHeightMultiplier`: Inventory configuration

#### World Configuration
- `rows`, `cols`: World grid (3x3)
- `roomSize`, `matrixSize`: Room size (8x8 tiles)

#### Player Configuration
- `startX`, `startY`, `startRoomIndex`: Starting position
- `startLevel`, `maxLevel`: Levels (1 starting, 10 maximum)
- `baseMaxLives`, `startLives`: Lives (3)
- `experienceBase`, `experienceGrowth`: XP system (base 6, growth 1.35)
- `maxKeys`: Maximum keys (9)
- `roomChangeDamageCooldown`: Damage cooldown (1000ms)

#### Enemy Configuration
- `movementInterval`: Movement speed (600ms)
- `fallbackMissChance`, `stealthMissChance`: Miss chances (0.25)

#### Animation Configuration
- `tileInterval`: Tile animation interval (320ms)
- `minInterval`: Minimum interval (60ms)
- `iconOverPlayerDuration`: Icon duration (2000ms)
- `overlayFPS`: Frame rate for overlays (30 FPS)
- `blinkInterval`, `blinkMinOpacity`, `blinkMaxOpacity`: Blink configuration

#### Visual Effects Configuration
- `combatIndicatorDuration`: Combat indicator duration (600ms)
- `screenFlashMinDuration`, `screenFlashDuration`: Screen flash (16ms min, 140ms default)
- `edgeFlashMinDuration`, `edgeFlashDuration`: Edge flash (32ms min, 220ms default)

#### Transitions Configuration
- `roomMinDuration`, `roomDuration`: Room transition (120ms min, 320ms default)
- `blockedMovementDuration`: Blocked movement (240ms)

#### Timing Configuration
- `resetAfterIntro`: Time after intro (2000ms)
- `resetAfterGameOver`: Time after game over (2000ms)
- `levelUpCelebration`: Celebration duration (3000ms)
- `celebrationMinDuration`, `celebrationMaxDuration`: Celebration limits

#### Input Configuration
- `maxDuration`: Maximum input duration (600ms)

#### HUD Configuration
- `padding`: Internal padding (4px)
- `gap`: Spacing between elements (6px)
- `backgroundColor`: Background color ('#000000')

#### Tiles Configuration
- `legacyMax`: Legacy maximum value (15)
- `valueMax`: Maximum value (255)

#### Color Palette
- `colors`: Array of 16 colors in PICO-8 style

### 2. `src/config/EditorConfig.ts`

Configuration file for the editor, containing:

#### Editor Canvas Configuration
- `width`, `height`: Editor canvas dimensions (384x384)

#### Preview Configuration
- `npcSize`, `enemySize`, `objectSize`, `tileSize`: Preview sizes (48-64px)

#### Grid Configuration
- `cellSize`: Cell size (48px)
- `lineColor`, `lineWidth`: Grid appearance

#### History Configuration
- `maxStates`: Maximum number of states in history (50)

#### Export Configuration
- `defaultFileName`: Default file name ('my-rpg-game.html')
- `mimeType`: MIME type ('text/html')

## Refactored Files

### Runtime

1. **`src/runtime/adapters/Renderer.ts`**
   - Replaced magic numbers 8, 28, 1.75, 40, 2, 2000, 320, 60
   - Uses: `GameConfig.canvas.*`, `GameConfig.world.roomSize`, `GameConfig.animation.*`

2. **`src/runtime/domain/state/StatePlayerManager.ts`**
   - Replaced values 10, 3, 6, 1.35, 9, 1000
   - Uses: `GameConfig.player.*`

3. **`src/runtime/services/engine/EnemyManager.ts`**
   - Replaced values 600, 0.25
   - Uses: `GameConfig.enemy.*`

4. **`src/runtime/adapters/renderer/RendererEffectsManager.ts`**
   - Replaced values 600, 16, 140, 32, 220
   - Uses: `GameConfig.effects.*`

5. **`src/runtime/adapters/renderer/RendererTransitionManager.ts`**
   - Replaced values 120, 320
   - Uses: `GameConfig.transitions.*`

6. **`src/runtime/domain/GameState.ts`**
   - Replaced values 3, 8, 1, 3, 0, 2000, 3000
   - Uses: `GameConfig.world.*`, `GameConfig.player.*`, `GameConfig.timing.*`

7. **`src/runtime/services/GameEngine.ts`**
   - Replaced value 2000
   - Uses: `GameConfig.timing.resetAfterIntro`

8. **`src/runtime/services/engine/MovementManager.ts`**
   - Replaced value 240
   - Uses: `GameConfig.transitions.blockedMovementDuration`

9. **`src/runtime/adapters/InputManager.ts`**
   - Replaced value 600
   - Uses: `GameConfig.input.maxDuration`

10. **`src/runtime/adapters/renderer/RendererHudRenderer.ts`**
    - Replaced values 4, 6, '#000000'
    - Uses: `GameConfig.hud.*`

11. **`src/runtime/adapters/renderer/RendererOverlayRenderer.ts`**
    - Replaced values 500, 0.3, 0.95, 30
    - Uses: `GameConfig.animation.*`

12. **`src/runtime/infra/share/ShareConstants.ts`**
    - Replaced values 8, 3, 15, 255, color palette
    - Uses: `GameConfig.world.*`, `GameConfig.tiles.*`, `GameConfig.palette.colors`

## Implementation Benefits

### 1. Maintainability
- ✅ All configurations in a single place
- ✅ Easy to adjust values without searching code
- ✅ Inline documentation for each configuration

### 2. Documentation
- ✅ Each value has explanatory comment
- ✅ Logical grouping by category
- ✅ Type safety with TypeScript

### 3. Consistency
- ✅ Duplicate values consolidated
- ✅ Single source of truth for all modules
- ✅ Prevents desynchronization

### 4. Testability
- ✅ Easy to create test configurations
- ✅ Can mock entire GameConfig
- ✅ Isolated configurations facilitate testing

### 5. Flexibility
- ✅ Easy to create different profiles (dev, prod, test)
- ✅ Possibility of future dynamic configuration
- ✅ Foundation for mods/customization system

## Usage Example

### Before
```typescript
// Values scattered throughout code
this.maxLevel = 10;
this.baseMaxLives = 3;
this.tileAnimationInterval = 320;
const duration = 600;
```

### After
```typescript
import { GameConfig } from '../../config/GameConfig';

this.maxLevel = GameConfig.player.maxLevel;
this.baseMaxLives = GameConfig.player.baseMaxLives;
this.tileAnimationInterval = GameConfig.animation.tileInterval;
const duration = GameConfig.effects.combatIndicatorDuration;
```

## Type Safety

Both configuration files export types:

```typescript
export type GameConfigType = typeof GameConfig;
export type EditorConfigType = typeof EditorConfig;
```

This ensures:
- Autocomplete in IDE
- Compile-time type checking
- Documentation via IntelliSense

## Statistics

- **2 files created**: GameConfig.ts, EditorConfig.ts
- **12 files refactored**: Runtime and adapters
- **50+ centralized values**: Magic numbers eliminated
- **100% compatibility**: Build passes without errors
- **0 breaking changes**: Identical behavior

## Next Steps (Optional)

### Possible Future Improvements

1. **Environment-based Configuration**
   ```typescript
   export const GameConfig = process.env.NODE_ENV === 'development'
     ? DevGameConfig
     : ProdGameConfig;
   ```

2. **Configuration Validation**
   ```typescript
   function validateConfig(config: GameConfigType): void {
     if (config.player.maxLevel < 1) {
       throw new Error('maxLevel must be >= 1');
     }
   }
   ```

3. **Dynamic Configuration**
   ```typescript
   class ConfigManager {
     private config = GameConfig;

     override(path: string, value: any): void {
       // Allow runtime override
     }
   }
   ```

4. **Difficulty Profiles**
   ```typescript
   export const EasyConfig = { ...GameConfig, player: { ...GameConfig.player, startLives: 5 } };
   export const HardConfig = { ...GameConfig, player: { ...GameConfig.player, startLives: 1 } };
   ```

## Conclusion

The centralized configuration implementation has been completed successfully. All constants have been consolidated, the code is cleaner and more maintainable, and there were no compatibility breaks. The project now follows configuration best practices, facilitating future maintenance and evolution.
