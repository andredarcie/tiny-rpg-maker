import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EnemyDefinitions } from '../../core/EnemyDefinitions';
import { EnemyManager } from '../../core/engine/EnemyManager';
import { MovementManager } from '../../core/engine/MovementManager';
import { TextResources } from '../../core/TextResources';

describe('EnemyManager', () => {
  const getSpy = vi.spyOn(TextResources, 'get');
  const formatSpy = vi.spyOn(TextResources, 'format');
  const normalizeSpy = vi.spyOn(EnemyDefinitions, 'normalizeType');
  const getDefinitionSpy = vi.spyOn(EnemyDefinitions, 'getEnemyDefinition');
  const getExperienceSpy = vi.spyOn(EnemyDefinitions, 'getExperienceReward');
  const getMissChanceSpy = vi.spyOn(EnemyDefinitions, 'getMissChance');

  const renderer = {
    draw: vi.fn(),
    flashScreen: vi.fn(),
    showCombatIndicator: vi.fn(),
  };

  const tileManager = {
    getTileMap: vi.fn(() => ({ ground: [], overlay: [] })),
    getTile: vi.fn(() => null),
  };

  const baseGameState = () => ({
    playing: true,
    getEnemyDefinitions: vi.fn(() => []),
    getEnemies: vi.fn(() => []),
    addEnemy: vi.fn(() => 'enemy-1'),
    removeEnemy: vi.fn(),
    getGame: vi.fn(() => ({ rooms: [] })),
    getPlayer: vi.fn(() => ({ roomIndex: 0, x: 0, y: 0 })),
    isPlayerOnDamageCooldown: vi.fn(() => false),
    damagePlayer: vi.fn(() => 1),
    consumeLastDamageReduction: vi.fn(() => 0),
    handleEnemyDefeated: vi.fn(() => null),
    isVariableOn: vi.fn(() => false),
    normalizeVariableId: vi.fn((id: string | null) => id),
    setVariableValue: vi.fn(() => true),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getSpy.mockImplementation((key: string, fallback = '') => (key === 'combat.cooldown' ? 'Safe' : fallback || 'text'));
    formatSpy.mockImplementation((_key: string, _params: Record<string, unknown>, fallback = '') => fallback || 'text');
    normalizeSpy.mockImplementation((type: string) => type);
    getDefinitionSpy.mockImplementation(() => ({ damage: 1 }));
    getExperienceSpy.mockImplementation(() => 2);
    getMissChanceSpy.mockImplementation(() => null);
  });

  it('adds enemies and redraws', () => {
    const gameState = baseGameState();
    const manager = new EnemyManager(gameState, renderer, tileManager);

    const id = manager.addEnemy({ type: 'rat' });

    expect(id).toBe('enemy-1');
    expect(gameState.addEnemy).toHaveBeenCalled();
    expect(renderer.draw).toHaveBeenCalled();
  });

  it('normalizes miss chance', () => {
    const manager = new EnemyManager(baseGameState(), renderer, tileManager);

    expect(manager.normalizeMissChance(2)).toBe(1);
    expect(manager.normalizeMissChance(-1)).toBe(0);
  });

  it('returns true when miss chance is 1', () => {
    const manager = new EnemyManager(baseGameState(), renderer, tileManager);

    expect(manager.attackMissed(1)).toBe(true);
    expect(manager.attackMissed(0)).toBe(false);
  });

  it('uses crypto.randomUUID when available', () => {
    const manager = new EnemyManager(baseGameState(), renderer, tileManager);
    const globalWithCrypto = globalThis as GlobalWithCrypto;
    const originalCrypto = globalWithCrypto.crypto;
    const spy = originalCrypto?.randomUUID
      ? vi.spyOn(originalCrypto, 'randomUUID').mockReturnValue('enemy-uuid')
      : null;

    if (spy) {
      expect(manager.generateEnemyId()).toBe('enemy-uuid');
      spy.mockRestore();
      return;
    }

    Object.defineProperty(globalThis, 'crypto', {
      value: { randomUUID: () => 'enemy-uuid' },
      configurable: true,
    });
    expect(manager.generateEnemyId()).toBe('enemy-uuid');
    if (originalCrypto) {
      Object.defineProperty(globalThis, 'crypto', { value: originalCrypto, configurable: true });
    }
  });

  it('triggers defeat variables and shows message', () => {
    getDefinitionSpy.mockImplementation(() => ({
      activateVariableOnDefeat: { variableId: 'var-1', message: 'Unlocked' },
    }));
    const gameState = baseGameState();
    const manager = new EnemyManager(gameState, renderer, tileManager);

    const result = manager.tryTriggerDefeatVariable({ type: 'rat' });

    expect(result).toBe(true);
    expect(gameState.setVariableValue).toHaveBeenCalledWith('var-1', true, true);
    expect(renderer.showCombatIndicator).toHaveBeenCalledWith('Unlocked', { duration: 900 });
  });

  it('shows a cooldown message when damage is blocked by room change safety', () => {
    const gameState = {
      ...baseGameState(),
      getEnemies: vi.fn(() => [{ id: 'enemy-1', type: 'rat', roomIndex: 0, x: 0, y: 0 }]),
      isPlayerOnDamageCooldown: vi.fn(() => true),
    };
    const manager = new EnemyManager(gameState, renderer, tileManager);

    manager.handleEnemyCollision(0);

    expect(renderer.showCombatIndicator).toHaveBeenCalledWith('Safe', { duration: 700 });
    expect(gameState.damagePlayer).not.toHaveBeenCalled();
  });

  it('prevents damage right after changing rooms (damage cooldown)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);

    const player = {
      roomIndex: 0,
      x: 0,
      y: 0,
      lastX: 0,
      lastRoomChangeTime: null as number | null,
      currentLives: 3,
    };
    const enemies = [{ id: 'enemy-1', type: 'rat', roomIndex: 1, x: 7, y: 0, lastX: 7 }];

    const gameState = {
      playing: true,
      game: { roomSize: 8 },
      getEnemyDefinitions: vi.fn(() => []),
      getEnemies: vi.fn(() => enemies),
      addEnemy: vi.fn(() => 'enemy-1'),
      removeEnemy: vi.fn(),
      getGame: vi.fn(() => ({ rooms: [{}, {}] })),
      getPlayer: vi.fn(() => player),
      isPlayerOnDamageCooldown: vi.fn(
        () => Number.isFinite(player.lastRoomChangeTime) && Date.now() - (player.lastRoomChangeTime ?? 0) < 1000,
      ),
      damagePlayer: vi.fn(() => player.currentLives),
      consumeLastDamageReduction: vi.fn(() => 0),
      handleEnemyDefeated: vi.fn(() => null),
      isVariableOn: vi.fn(() => false),
      normalizeVariableId: vi.fn((id: string | null) => id),
      setVariableValue: vi.fn(() => true),
      isGameOver: () => false,
      isLevelUpCelebrationActive: () => false,
      isLevelUpOverlayActive: () => false,
      isPickupOverlayActive: () => false,
      getDialog: () => ({ active: false, page: 1, maxPages: 1 }),
      setDialogPage: vi.fn(),
      getRoomCoords: () => ({ row: 0, col: 0 }),
      getRoomIndex: (_row: number, col: number) => (col === -1 ? 1 : null),
      getObjectAt: () => null,
      hasSkill: () => false,
      consumeKey: () => false,
      getKeys: () => 0,
      setPlayerPosition: (x: number, y: number, roomIndex: number | null) => {
        player.x = x;
        player.y = y;
        if (roomIndex !== null) {
          player.roomIndex = roomIndex;
        }
      },
    };

    const movementRenderer = {
      draw: vi.fn(),
      captureGameplayFrame: vi.fn(),
      startRoomTransition: vi.fn(() => false),
      flashEdge: vi.fn(),
    };
    const dialogManager = { closeDialog: vi.fn(), showDialog: vi.fn() };
    const interactionManager = { handlePlayerInteractions: vi.fn() };
    const movementTileManager = { getTileMap: vi.fn(() => ({ ground: [], overlay: [] })), getTile: vi.fn(() => null) };

    const enemyManager = new EnemyManager(gameState, renderer, tileManager);
    const movementManager = new MovementManager({
      gameState,
      tileManager: movementTileManager,
      renderer: movementRenderer,
      dialogManager,
      interactionManager,
      enemyManager,
    });

    movementManager.tryMove(-1, 0);

    expect(gameState.damagePlayer).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});

type GlobalWithCrypto = typeof globalThis & {
  crypto?: Crypto & { randomUUID?: () => string };
};
