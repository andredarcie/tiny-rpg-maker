import { ObjectDefinitions, OBJECT_TYPES } from '../ObjectDefinitions';
import { TextResources } from '../TextResources';

type DialogManagerLike = {
  showDialog: (text: string, meta?: Record<string, unknown>) => void;
};

type PlayerPosition = {
  roomIndex: number;
  x: number;
  y: number;
};

type ItemLike = {
  roomIndex: number;
  x: number;
  y: number;
  collected?: boolean;
  text?: string;
};

type GameObjectLike = {
  type: string;
  roomIndex: number;
  x: number;
  y: number;
  collected?: boolean;
  variableId?: string | null;
  on?: boolean;
};

type NpcLike = {
  placed?: boolean;
  roomIndex: number;
  x: number;
  y: number;
  text?: string;
  conditionText?: string;
  conditionVariableId?: string | null;
  rewardVariableId?: string | null;
  conditionalRewardVariableId?: string | null;
};

type ExitLike = {
  roomIndex: number;
  x: number;
  y: number;
  targetRoomIndex: number;
  targetX: number;
  targetY: number;
};

type RoomLike = Record<string, unknown>;

type GameStateLike = {
  getGame: () => {
    items: ItemLike[];
    sprites: NpcLike[];
    exits: ExitLike[];
    rooms: RoomLike[];
  };
  getPlayer: () => PlayerPosition;
  getObjectsForRoom?: (roomIndex: number) => GameObjectLike[];
  getPlayerEndText: (roomIndex: number) => string;
  setActiveEndingText?: (text: string) => void;
  normalizeVariableId?: (id: string | null) => string | null;
  isVariableOn?: (id: string) => boolean;
  setVariableValue?: (id: string, value: boolean) => void;
  addKeys?: (count: number) => void;
  getLives?: () => number;
  getMaxLives?: () => number;
  hasSkill?: (skillId: string) => boolean;
  healPlayerToFull?: () => void;
  addLife?: (count: number) => void;
  getExperienceToNext?: () => number;
  addExperience?: (amount: number) => void;
  getSwordType?: () => string | null;
  addDamageShield?: (durability: number, type: string) => void;
  showPickupOverlay?: (payload: Record<string, unknown>) => void;
  setPlayerPosition: (x: number, y: number, roomIndex: number) => void;
  getRoomIndex: (row: number, col: number) => number | null;
};

type Options = {
  onPlayerVictory?: () => void;
};

class InteractionManager {
  gameState: GameStateLike;
  dialogManager: DialogManagerLike;
  options?: Options;

  constructor(gameState: GameStateLike, dialogManager: DialogManagerLike, options: Options = {}) {
    this.gameState = gameState;
    this.dialogManager = dialogManager;
    this.options = options;
  }

  get types(): Record<string, string> {
    return OBJECT_TYPES;
  }

  handlePlayerInteractions(): void {
    const game = this.gameState.getGame();
    const player = this.gameState.getPlayer();

    this.checkItems(game.items, player);
    this.checkObjects(player);
    this.checkNpcs(game.sprites, player);
    this.checkRoomExits(game.exits, game.rooms, player);
  }

  checkItems(items: ItemLike[], player: PlayerPosition): void {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      const sameTile = item.roomIndex === player.roomIndex && item.x === player.x && item.y === player.y;
      if (!sameTile || item.collected) continue;

      item.collected = true;
      const text = typeof item.text === 'string' ? item.text : this.getInteractionText('objects.item.pickup', '');
      if (text) {
        this.dialogManager.showDialog(text);
      }
      break;
    }
  }

  checkObjects(player: PlayerPosition): void {
    const objects = this.gameState.getObjectsForRoom?.(player.roomIndex) || [];
    for (const object of objects) {
      if (object.x !== player.x || object.y !== player.y) continue;

      if (this.handleCollectibleObject(object)) break;
      if (this.handleSwitch(object)) break;
      if (this.handlePlayerEnd(object)) break;
    }
  }

  handleCollectibleObject(object: GameObjectLike): boolean {
    if (object.collected) {
      return false;
    }

    const OT = this.types;
    switch (object.type) {
      case OT.KEY: {
        object.collected = true;
        this.showPickupOverlay(object.type, () => {
          this.gameState.addKeys?.(1);
        });
        return true;
      }
      case OT.LIFE_POTION: {
        const currentLives = this.gameState.getLives?.();
        const maxLives = this.gameState.getMaxLives?.();
        const fullHeal = this.gameState.hasSkill?.('potion-master');
        if (Number.isFinite(currentLives) && Number.isFinite(maxLives) && currentLives >= maxLives) {
          return false;
        }
        object.collected = true;
        this.showPickupOverlay(object.type, () => {
          if (fullHeal) {
            this.gameState.healPlayerToFull?.();
          } else {
            this.gameState.addLife?.(1);
          }
        });
        return true;
      }
      case OT.XP_SCROLL: {
        object.collected = true;
        this.showPickupOverlay(object.type, () => {
          const xpToNext = this.gameState.getExperienceToNext?.() ?? 0;
          const gain = xpToNext > 0 ? Math.max(1, Math.floor(xpToNext * 0.5)) : 0;
          this.gameState.addExperience?.(gain);
        });
        return true;
      }
      case OT.SWORD:
      case OT.SWORD_BRONZE:
      case OT.SWORD_WOOD: {
        if (!this.shouldPickupSword(object.type)) {
          return false;
        }
        const durability = this.getSwordDurability(object.type);
        object.collected = true;
        this.showPickupOverlay(object.type, () => {
          this.gameState.addDamageShield?.(durability, object.type);
        });
        return true;
      }
      default:
        return false;
    }
  }

  getSwordDurability(type: string): number {
    const durability = ObjectDefinitions.getSwordDurability(type);
    if (Number.isFinite(durability)) {
      return Math.max(0, durability);
    }
    return 0;
  }

  getSwordPriority(type: string): number {
    const OT = this.types;
    const priorityMap: Record<string, number> = {
      [OT.SWORD_WOOD]: 1,
      [OT.SWORD_BRONZE]: 2,
      [OT.SWORD]: 3,
    };
    return priorityMap[type] || 0;
  }

  shouldPickupSword(type: string): boolean {
    const currentType = this.gameState.getSwordType?.() || null;
    const currentPriority = this.getSwordPriority(currentType || '');
    const newPriority = this.getSwordPriority(type);
    return newPriority > currentPriority;
  }

  showPickupOverlay(type: string, effect: (() => void) | null = null): void {
    const overlayName = this.getObjectDisplayName(type);
    this.gameState.showPickupOverlay?.({
      name: overlayName,
      spriteGroup: 'object',
      spriteType: type,
      effect,
    });
  }

  getObjectDisplayName(type: string): string {
    const definition = ObjectDefinitions.getObjectDefinition(type);
    if (!definition) {
      return type || '';
    }
    if (definition.nameKey) {
      const localized = TextResources.get(definition.nameKey, definition.name || type || '');
      if (localized) return localized;
    }
    if (definition.name) return definition.name;
    return type || '';
  }

  getInteractionText(key: string, fallback = ''): string {
    const value = TextResources.get(key, fallback);
    return value || fallback || '';
  }

  formatInteractionText(key: string, params: Record<string, unknown> = {}, fallback = ''): string {
    const value = TextResources.format(key, params, fallback);
    return value || fallback || '';
  }

  handleSwitch(object: GameObjectLike): boolean {
    const OT = this.types;
    if (object.type !== OT.SWITCH) return false;
    object.on = !object.on;
    const variableId = this.gameState.normalizeVariableId?.(object.variableId) ?? null;
    if (variableId) {
      this.gameState.setVariableValue?.(variableId, object.on);
    }
    const message = object.on
      ? this.getInteractionText('objects.switch.onMessage', '')
      : this.getInteractionText('objects.switch.offMessage', '');
    if (message) {
      this.dialogManager.showDialog(message);
    }
    return true;
  }

  handlePlayerEnd(object: GameObjectLike): boolean {
    const OT = this.types;
    if (object.type !== OT.PLAYER_END) return false;
    const endingText = this.gameState.getPlayerEndText(object.roomIndex);
    this.gameState.setActiveEndingText?.(endingText || '');
    this.options?.onPlayerVictory?.();
    return true;
  }

  checkNpcs(npcs: NpcLike[], player: PlayerPosition): void {
    for (const npc of npcs) {
      if (!npc.placed) continue;
      const sameTile = npc.roomIndex === player.roomIndex && npc.x === player.x && npc.y === player.y;
      if (!sameTile) continue;

      const dialogText = this.getNpcDialogText(npc);
      const meta = this.getNpcDialogMeta(npc);
      this.dialogManager.showDialog(dialogText, meta);
      break;
    }
  }

  getNpcDialogText(npc: NpcLike): string {
    const rawConditionId = npc?.conditionVariableId || null;
    const isBardCondition = rawConditionId === 'skill:bard';
    const conditionId = isBardCondition ? null : this.gameState.normalizeVariableId?.(rawConditionId) ?? null;
    const hasConditionText = typeof npc.conditionText === 'string' && npc.conditionText.trim().length > 0;
    const charisma = this.gameState.hasSkill?.('charisma');
    const conditionActive =
      hasConditionText && ((isBardCondition && charisma) || (conditionId && this.gameState.isVariableOn?.(conditionId)));
    const useConditionText = conditionActive && hasConditionText;

    if (useConditionText) {
      return npc.conditionText;
    }

    if (typeof npc.text === 'string' && npc.text.trim()) {
      return npc.text;
    }

    if (useConditionText) {
      return npc.conditionText || '';
    }

    return npc.text || 'Hello!';
  }

  getNpcDialogMeta(npc: NpcLike): Record<string, unknown> | undefined {
    const rawConditionId = npc?.conditionVariableId || null;
    const isBardCondition = rawConditionId === 'skill:bard';
    const conditionId = isBardCondition ? null : this.gameState.normalizeVariableId?.(rawConditionId) ?? null;
    const rewardId = this.gameState.normalizeVariableId?.(npc.rewardVariableId) ?? null;
    const conditionalRewardId = this.gameState.normalizeVariableId?.(npc.conditionalRewardVariableId) ?? null;
    const hasConditionText = typeof npc.conditionText === 'string' && npc.conditionText.trim().length > 0;
    const charisma = this.gameState.hasSkill?.('charisma');
    const conditionActive =
      hasConditionText && ((isBardCondition && charisma) || (conditionId && this.gameState.isVariableOn?.(conditionId)));

    if (conditionActive && conditionalRewardId) {
      return { setVariableId: conditionalRewardId, rewardAllowed: true };
    }

    if (!conditionActive && rewardId) {
      return { setVariableId: rewardId, rewardAllowed: true };
    }

    return undefined;
  }

  checkRoomExits(exits: ExitLike[], rooms: RoomLike[], player: PlayerPosition): void {
    if (!Array.isArray(exits)) return;
    for (const exit of exits) {
      const sameTile = exit.roomIndex === player.roomIndex && exit.x === player.x && exit.y === player.y;
      if (!sameTile) continue;

      if (rooms[exit.targetRoomIndex]) {
        this.gameState.setPlayerPosition(
          this.clamp(exit.targetX, 0, 7),
          this.clamp(exit.targetY, 0, 7),
          exit.targetRoomIndex,
        );
      }
      break;
    }
  }

  clamp(v: number, a: number, b: number): number {
    return Math.max(a, Math.min(b, v));
  }
}

export { InteractionManager };
