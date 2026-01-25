import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemDefinitions } from '../../runtime/domain/definitions/ItemDefinitions';
import { InteractionManager } from '../../runtime/services/engine/InteractionManager';
import { TextResources } from '../../runtime/adapters/TextResources';

describe('InteractionManager', () => {
  const getDefinitionSpy = vi.spyOn(ItemDefinitions, 'getObjectDefinition');
  const getDurabilitySpy = vi.spyOn(ItemDefinitions, 'getSwordDurability');
  const getSpy = vi.spyOn(TextResources, 'get');
  const formatSpy = vi.spyOn(TextResources, 'format');
  const dialogManager = { showDialog: vi.fn() };
  const baseGameState = () =>
    ({
      getGame: () => ({ items: [], sprites: [], exits: [], rooms: [] }),
      getPlayer: () => ({ roomIndex: 0, x: 0, y: 0 }),
      getObjectsForRoom: () => [],
      getPlayerEndText: () => 'The End',
      setActiveEndingText: vi.fn(),
      normalizeVariableId: (id: string | null) => id,
      isVariableOn: vi.fn(),
      setVariableValue: vi.fn((_id: string, _value: boolean, _persist?: boolean) => [true, false] as [boolean, boolean?]),
      addKeys: vi.fn(),
      getLives: vi.fn(),
      getMaxLives: vi.fn(),
      hasSkill: vi.fn(),
      healPlayerToFull: vi.fn(),
      addLife: vi.fn(),
      getExperienceToNext: vi.fn(),
      addExperience: vi.fn(),
      getSwordType: vi.fn(),
      addDamageShield: vi.fn(),
      showPickupOverlay: vi.fn(),
      setPlayerPosition: vi.fn(),
      getRoomIndex: vi.fn(),
    }) satisfies ConstructorParameters<typeof InteractionManager>[0];

  beforeEach(() => {
    vi.clearAllMocks();
    getDefinitionSpy.mockImplementation((type: string) => ({
      type,
      id: `${type}-id`,
      name: `Name:${type}`,
      nameKey: `objects.${type}`,
      behavior: { order: 0, tags: [] },
      sprite: [],
    }));
    getDurabilitySpy.mockImplementation(() => 2);
    getSpy.mockImplementation((_key: string, fallback = '') => fallback || 'fallback');
    formatSpy.mockImplementation((_key: string, _params?: Record<string, unknown>, fallback = '') => fallback || 'formatted');
  });

  it('collects keys and triggers pickup overlay', () => {
    const gameState = baseGameState();
    const manager = new InteractionManager(gameState, dialogManager);
    const key = { type: 'key', collected: false, roomIndex: 0, x: 0, y: 0 };

    const handled = manager.handleCollectibleObject(key);
    expect(handled).toBe(true);
    expect(key.collected).toBe(true);
    expect(gameState.showPickupOverlay).toHaveBeenCalled();

    const effect = gameState.showPickupOverlay.mock.calls[0][0].effect;
    effect?.();
    expect(gameState.addKeys).toHaveBeenCalledWith(1);
  });

  it('toggles switches and shows dialog', () => {
    const gameState = baseGameState();
    const manager = new InteractionManager(gameState, dialogManager);
    const object = { type: 'switch', on: false, variableId: 'var-1', roomIndex: 0, x: 0, y: 0 };

    const handled = manager.handleSwitch(object);

    expect(handled).toBe(true);
    expect(object.on).toBe(true);
    expect(gameState.setVariableValue).toHaveBeenCalledWith('var-1', true);
    expect(dialogManager.showDialog).toHaveBeenCalled();
  });

  it('uses conditional NPC dialog when variable is active', () => {
    const gameState = baseGameState();
    gameState.isVariableOn.mockReturnValue(true);
    const manager = new InteractionManager(gameState, dialogManager);

    const text = manager.getNpcDialogText({
      conditionVariableId: 'var-1',
      conditionText: 'Conditional',
      text: 'Default',
      roomIndex: 0,
      x: 0,
      y: 0,
    });

    expect(text).toBe('Conditional');
  });

  it('moves player through room exits', () => {
    const gameState = baseGameState();
    gameState.getRoomIndex.mockReturnValue(0);
    const manager = new InteractionManager(gameState, dialogManager);
    const player = { roomIndex: 0, x: 1, y: 1 };
    const exits = [{ roomIndex: 0, x: 1, y: 1, targetRoomIndex: 0, targetX: 2, targetY: 3 }];
    const rooms = [{}];

    manager.checkRoomExits(exits, rooms, player);

    expect(gameState.setPlayerPosition).toHaveBeenCalledWith(2, 3, 0);
  });
});
