# Architecture Analysis - Tiny RPG Maker

## Overview

The Tiny RPG Maker project is an RPG game editor and runtime developed in TypeScript, demonstrating a well-structured architecture with clear separation between the game editor and execution engine (runtime).

### Main Folder Structure

```
tiny-rpg-maker/
├── src/
│   ├── runtime/          # Game engine (execution)
│   ├── editor/           # Authoring tools
│   ├── types/            # TypeScript type definitions
│   ├── __tests__/        # Unit tests (Vitest)
│   ├── legacy/           # Compatibility layer
│   ├── showcase/         # Demo content
│   └── main.ts           # Entry point
├── public/               # Static assets
├── tests/                # E2E tests (Playwright)
└── dist/                 # Production build
```

---

## Layered Architecture

### 1. Presentation Layer
- **`main.ts`**: Application bootstrap
- **`editor/`**: Editor interface and interactions
- **`adapters/renderer/`**: Rendering modules

### 2. Application Layer
- **`services/GameEngine.ts`**: Game orchestration
- **`services/engine/`**: Engine subsystems (Dialog, Enemy, Interaction, Movement)
- **`editor/EditorManager.ts`**: Editor orchestration

### 3. Domain Layer
- **`domain/state/`**: State management (13 specialized managers)
- **`domain/entities/`**: Domain objects (Enemy, Item, NPC, Skill, Tile)
- **`domain/definitions/`**: Game content catalogs
- **`domain/sprites/`**: Pixel art sprite data

### 4. Infrastructure Layer
- **`infra/share/`**: Serialization system for sharing
- **`infra/TinyRpgApi.ts`**: Global API for editor-runtime communication
- **`adapters/`**: Adapters for external systems

---

## Main Components

### Runtime (Game Engine)

#### GameEngine
**Location**: `src/runtime/services/GameEngine.ts`

Main orchestrator that integrates:
- Dialog system (DialogManager)
- Enemy system (EnemyManager)
- Interaction system (InteractionManager)
- Movement system (MovementManager)
- State management (GameState)
- Rendering (Renderer)

#### GameState
**Location**: `src/runtime/domain/state/GameState.ts`

Central state container composed of 13 specialized managers:
- **StatePlayerManager**: Player stats, lives, level-up, damage
- **StateEnemyManager**: Enemy runtime state
- **StateVariableManager**: Game variables and flags
- **StateObjectManager**: Interactive objects (doors, keys)
- **StateSkillManager**: Skill acquisition
- **StateWorldManager**: Room/world grid
- **StateItemManager**: Item catalog
- **StateDialogManager**: Dialog state
- **GameStateLifecycle**: Pause/resume/game-over logic
- **GameStateScreenManager**: Overlays and transitions
- **GameStateDataFacade**: Facade for import/export
- **GameStateWorldFacade**: Facade for world creation

#### Rendering System
**Location**: `src/runtime/adapters/renderer/`

Modular architecture with 12+ specialized modules:
- **RendererTileRenderer**: Tile/background rendering
- **RendererEntityRenderer**: Player/NPC/enemies/objects
- **RendererDialogRenderer**: Dialog boxes
- **RendererHudRenderer**: HUD and inventory bar
- **RendererEffectsManager**: Visual effects (flashes, indicators)
- **RendererTransitionManager**: Room transitions
- **RendererOverlayRenderer**: Overlays (intro, level-up, pickup, game-over)
- **RendererPalette**: Color palette management
- **RendererSpriteFactory**: Sprite generation

### Editor

#### EditorManager
**Location**: `src/editor/EditorManager.ts`

Central orchestrator that aggregates:
- **EditorEventBinder**: UI event binding
- **EditorInteractionController**: Canvas interaction and shortcuts
- **EditorUIController**: UI and panel synchronization

#### Specialized Services
**Location**: `src/editor/modules/`

- **EditorTileService**: Tile painting and selection
- **EditorNpcService**: NPC placement and editing
- **EditorEnemyService**: Enemy placement
- **EditorObjectService**: Object placement
- **EditorVariableService**: Variable editing
- **EditorWorldService**: Room management
- **EditorShareService**: Save/load and shareable URL generation
- **EditorExportService**: Export to standalone HTML
- **EditorHistoryManager**: Undo/redo

---

## Identified Design Patterns

### 1. **Facade Pattern**
- `GameEngine`: Facade over subsystems
- `EditorManager`: Facade over editor services
- `ShareUtils`: Facade over sharing codecs
- `GameStateDataFacade`, `GameStateWorldFacade`

### 2. **Strategy Pattern**
- Rendering modules implement specific strategies
- Sharing codecs (MatrixCodec, PositionCodec, TextCodec, VariableCodec)

### 3. **Manager Pattern**
- "Manager" classes to manage lifecycle:
  - GameEngine, EditorManager
  - StatePlayerManager, StateEnemyManager
  - DialogManager, EnemyManager, MovementManager

### 4. **Module Pattern**
- Renderer divided into specialized modules
- Editor divided into specialized services
- Each module has single, clear responsibility

### 5. **Composition over Inheritance**
- GameEngine composes multiple managers
- EditorManager composes services
- Renderer composes rendering modules

### 6. **Service Layer Pattern**
- Clear service layer in `runtime/services/`
- Services encapsulate business logic
- Clean APIs for state manipulation

### 7. **Adapter Pattern**
- `adapters/` folder for external concerns
- Renderer adapts Canvas API
- InputManager adapts DOM events
- TextResources adapts i18n

### 8. **Event-Driven Architecture**
- Custom events for tab switching
- Events for language changes
- Events for animation frames
- Decoupling between components

### 9. **Builder Pattern**
- `StateWorldManager.createWorldRooms` builds world structure
- `SpriteFactory` builds sprites
- `ShareEncoder` builds share codes

### 10. **State Pattern (implicit)**
- Game states: playing, paused, game-over, level-up, pickup
- `GameStateLifecycle` and `GameStateScreenManager` manage transitions

---

## Architecture Strengths

### ✅ Separation of Concerns
- Runtime and Editor completely separated
- Runtime doesn't depend on Editor
- Editor depends on Runtime through clear interface (TinyRpgApi)

### ✅ Modularity
- Renderer divided into 12+ specialized modules
- 13 specialized state managers
- Well-segregated editor services

### ✅ Type Safety
- Migration to modern TypeScript
- Well-defined types in `src/types/`
- Strict type checking

### ✅ Testability
- Test structure mirroring source code
- Unit tests with Vitest
- E2E tests with Playwright

### ✅ Sophisticated Sharing System
- Optimized serialization/deserialization
- Multiple specialized codecs
- Data compression for URLs

### ✅ Single Responsibility
- Each manager/service has clear responsibility
- Rendering modules focused on one aspect
- Facilitates maintenance and testing

### ✅ Well-Defined Layers
- Domain separated from infrastructure
- Business logic isolated from presentation
- Facilitates changes and evolution

---

## Possible Improvements

### 🔄 1. Dependency Inversion

**Problem**: Some services know concrete implementations instead of interfaces.

**Solution**:
```typescript
// Create interfaces for main managers
interface IDialogManager {
  show(text: string, npcId?: number): void;
  update(): void;
  isActive(): boolean;
}

// GameEngine depends on interface, not implementation
class GameEngine {
  constructor(
    private dialogManager: IDialogManager,
    private enemyManager: IEnemyManager,
    // ...
  ) {}
}
```

**Benefits**:
- Facilitates unit testing with mocks
- Allows swapping implementations
- Reduces coupling

### 🔄 2. Dependency Injection

**Problem**: Many classes create their own dependencies internally.

**Solution**:
```typescript
// Create a simple DI container
class ServiceContainer {
  private services = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory());
  }

  resolve<T>(key: string): T {
    return this.services.get(key);
  }
}

// Usage
const container = new ServiceContainer();
container.register('dialogManager', () => new DialogManager(gameState));
container.register('gameEngine', () => new GameEngine(
  container.resolve('dialogManager'),
  container.resolve('enemyManager')
));
```

**Benefits**:
- Facilitates configuration and testing
- Centralizes object creation
- Makes dependencies explicit

### 🔄 3. Event Bus Pattern

**Problem**: Direct communication between components in some places.

**Solution**:
```typescript
// Centralized event system
class EventBus {
  private listeners = new Map<string, Set<Function>>();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  emit(event: string, data?: any): void {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}

// Usage
eventBus.emit('player:damaged', { amount: 10 });
eventBus.on('player:damaged', (data) => {
  // Update health UI
});
```

**Benefits**:
- Total decoupling between components
- Easy to add new listeners
- Event history for debugging

### 🔄 4. Command Pattern for Undo/Redo

**Problem**: `EditorHistoryManager` stores complete states (memory heavy).

**Solution**:
```typescript
interface ICommand {
  execute(): void;
  undo(): void;
}

class PlaceTileCommand implements ICommand {
  constructor(
    private x: number,
    private y: number,
    private newTile: number,
    private oldTile: number,
    private worldManager: StateWorldManager
  ) {}

  execute(): void {
    this.worldManager.setTile(this.x, this.y, this.newTile);
  }

  undo(): void {
    this.worldManager.setTile(this.x, this.y, this.oldTile);
  }
}

class CommandHistory {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];

  execute(command: ICommand): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo(): void {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }
}
```

**Benefits**:
- Uses much less memory
- Unlimited history
- Easy to add new commands

### 🔄 5. State Machine for Game States

**Problem**: State logic scattered across multiple places.

**Solution**:
```typescript
enum GameStateEnum {
  PLAYING = 'playing',
  PAUSED = 'paused',
  DIALOG = 'dialog',
  LEVEL_UP = 'level_up',
  GAME_OVER = 'game_over'
}

class GameStateMachine {
  private currentState: GameStateEnum = GameStateEnum.PLAYING;
  private transitions = new Map<string, Set<GameStateEnum>>();

  constructor() {
    this.defineTransitions();
  }

  private defineTransitions(): void {
    this.allow(GameStateEnum.PLAYING, [
      GameStateEnum.PAUSED,
      GameStateEnum.DIALOG,
      GameStateEnum.LEVEL_UP,
      GameStateEnum.GAME_OVER
    ]);
    // ...
  }

  canTransitionTo(state: GameStateEnum): boolean {
    return this.transitions.get(this.currentState)?.has(state) ?? false;
  }

  transitionTo(state: GameStateEnum): void {
    if (this.canTransitionTo(state)) {
      this.onExit(this.currentState);
      this.currentState = state;
      this.onEnter(state);
    }
  }
}
```

**Benefits**:
- Explicit state transitions
- Prevents invalid states
- Easier debugging

### 🔄 6. Repository Pattern for Data

**Problem**: Direct access to GameState in multiple places.

**Solution**:
```typescript
interface IGameRepository {
  getPlayer(): Player;
  savePlayer(player: Player): void;
  getEnemies(): Enemy[];
  addEnemy(enemy: Enemy): void;
}

class GameStateRepository implements IGameRepository {
  constructor(private gameState: GameState) {}

  getPlayer(): Player {
    return {
      x: this.gameState.player.x,
      y: this.gameState.player.y,
      lives: this.gameState.player.lives,
      // ...
    };
  }

  savePlayer(player: Player): void {
    this.gameState.player.setPosition(player.x, player.y);
    this.gameState.player.setLives(player.lives);
    // ...
  }
}
```

**Benefits**:
- Encapsulates data access
- Easy to swap persistence
- Separates domain model from storage

### 🔄 7. Observer Pattern for UI Updates

**Problem**: Renderer needs to actively check for changes.

**Solution**:
```typescript
interface IObserver {
  update(data: any): void;
}

class Observable {
  private observers: Set<IObserver> = new Set();

  subscribe(observer: IObserver): void {
    this.observers.add(observer);
  }

  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

class StatePlayerManager extends Observable {
  takeDamage(amount: number): void {
    this.lives -= amount;
    this.notify({ type: 'damage', lives: this.lives });
  }
}

class HudRenderer implements IObserver {
  update(data: any): void {
    if (data.type === 'damage') {
      this.renderLives(data.lives);
    }
  }
}
```

**Benefits**:
- UI updates automatically
- Reduces coupling
- Better performance (no polling)

### 🔄 8. Consolidated Factory Pattern

**Problem**: Entity creation scattered.

**Solution**:
```typescript
class GameEntityFactory {
  static createEnemy(type: string, x: number, y: number): Enemy {
    const definition = EnemyDefinitions[type];
    return new Enemy(
      x,
      y,
      definition.sprite,
      definition.lives,
      definition.damage,
      type
    );
  }

  static createNPC(type: string, x: number, y: number): NPC {
    const definition = NPCDefinitions[type];
    return new NPC(x, y, definition.sprite, definition.dialog, type);
  }

  // ...
}
```

**Benefits**:
- Centralizes creation logic
- Facilitates validation
- Ensures consistency

### ✅ 9. Centralized Configuration (IMPLEMENTED)

**Problem**: Constants and configurations scattered across multiple files.

> **Status**: ✅ Implemented - See [CENTRALIZED_CONFIGURATION.md](./CENTRALIZED_CONFIGURATION.md) for complete details

**Solution**:
```typescript
// config/GameConfig.ts
export const GameConfig = {
  canvas: {
    width: 320,
    height: 240,
    tileSize: 16
  },
  player: {
    startingLives: 3,
    maxLives: 5,
    baseDamage: 10
  },
  world: {
    gridWidth: 5,
    gridHeight: 5,
    roomWidth: 20,
    roomHeight: 15
  },
  rendering: {
    fps: 60,
    animationSpeed: 200
  }
} as const;
```

**Benefits**:
- Easy to adjust values
- Centralized documentation
- Avoids magic numbers

### 🔄 10. Centralized Error Handling

**Problem**: Try/catch scattered without uniform strategy.

**Solution**:
```typescript
class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = 'GameError';
  }
}

class ErrorHandler {
  static handle(error: Error): void {
    if (error instanceof GameError) {
      console.error(`[${error.code}] ${error.message}`, error.context);
      // Show friendly message to user
    } else {
      console.error('Unexpected error:', error);
      // Report to monitoring service
    }
  }
}

// Usage
try {
  gameEngine.loadGame(data);
} catch (error) {
  ErrorHandler.handle(error);
}
```

**Benefits**:
- Consistent handling
- Easier logging
- Better user experience

---

## Proposed Code Organization

### Improved Structure

```
src/
├── core/                          # Framework core
│   ├── di/                        # Dependency Injection
│   │   └── ServiceContainer.ts
│   ├── events/                    # Event Bus
│   │   └── EventBus.ts
│   ├── state-machine/             # State Machine
│   │   └── GameStateMachine.ts
│   └── errors/                    # Error Handling
│       └── ErrorHandler.ts
│
├── config/                        # Configuration
│   ├── GameConfig.ts
│   └── EditorConfig.ts
│
├── shared/                        # Shared code
│   ├── interfaces/                # Common interfaces
│   ├── utils/                     # Utilities
│   └── types/                     # TypeScript types
│
├── runtime/                       # Game engine
│   ├── domain/                    # Domain layer
│   │   ├── entities/              # Entities
│   │   ├── value-objects/         # Value Objects
│   │   ├── repositories/          # Repositories (interfaces)
│   │   └── services/              # Domain services
│   │
│   ├── application/               # Application layer
│   │   ├── use-cases/             # Use cases
│   │   ├── commands/              # Commands (CQRS)
│   │   └── queries/               # Queries (CQRS)
│   │
│   ├── infrastructure/            # Infrastructure layer
│   │   ├── repositories/          # Repository implementations
│   │   ├── persistence/           # Persistence
│   │   └── external/              # External services
│   │
│   └── presentation/              # Presentation layer
│       ├── renderers/             # Renderers
│       └── controllers/           # Controllers
│
├── editor/                        # Editor
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│
└── main.ts                        # Entry point
```

---

## Metrics and Analysis

### Current Statistics
- **149 TypeScript files** in src/
- **33 directories** organizing code by concern
- **~1,470 lines** in core engine logic
- Structured test coverage

### Complexity
- **Good modularization**: Small, focused files
- **Low coupling**: Well-managed dependencies
- **High cohesion**: Modules with clear responsibilities

---

## Suggested Refactoring Roadmap

### Phase 1: Foundation (2-3 weeks)
1. Create interfaces for main managers
2. Implement basic EventBus
3. Centralize configurations in GameConfig
4. Add centralized ErrorHandler

### Phase 2: Core Patterns (3-4 weeks)
1. Implement Dependency Injection container
2. Refactor HistoryManager to Command Pattern
3. Implement State Machine for game states
4. Create Repository Pattern for data access

### Phase 3: Decoupling (2-3 weeks)
1. Migrate communication to EventBus
2. Implement Observer Pattern for UI updates
3. Consolidate factories in GameEntityFactory
4. Apply Dependency Inversion in managers

### Phase 4: Documentation and Tests (2 weeks)
1. Document architecture with diagrams
2. Add integration tests
3. Create development guides
4. Code review and refinement

---

## Conclusion

Tiny RPG Maker demonstrates a solid and well-thought-out architecture, with excellent separation of concerns and appropriate use of design patterns. The current foundation is very good for evolution.

### Main Strengths
- Clear Runtime/Editor separation
- Excellent modularity
- Type safety with TypeScript
- Well-applied design patterns

### Main Opportunities
- Dependency inversion for better testability
- More robust event-driven architecture
- More explicit state management
- ~~Centralized configuration~~ ✅ **IMPLEMENTED**

---

## Completed Implementations

### ✅ Centralized Configuration (2026-01-28)

Improvement #9 was successfully implemented:

- **Files created**: `src/config/GameConfig.ts` and `src/config/EditorConfig.ts`
- **Files refactored**: 12 runtime and adapter files
- **Centralized values**: 50+ constants and magic numbers
- **Result**: Build passes without errors, 100% compatibility

**Complete details**: See [CENTRALIZED_CONFIGURATION.md](./CENTRALIZED_CONFIGURATION.md)

> **Portuguese version**: [ARQUITETURA.md](./ARQUITETURA.md)

**Benefits achieved**:
- ✅ All configurations in a single place
- ✅ Inline documentation for each value
- ✅ Complete type safety with TypeScript
- ✅ Facilitates testing and future maintenance
- ✅ Foundation for profiles/mods system

---

### Recommendation

**Don't do a big bang rewrite**. The current architecture works well. Suggested improvements should be applied gradually:

1. Start with low-risk changes (centralized configuration, error handling)
2. Refactor isolated modules one at a time
3. Keep tests passing with each change
4. Document patterns as they are applied

The architecture already demonstrates maturity. The proposed improvements are evolutions, not fixes for critical problems.
