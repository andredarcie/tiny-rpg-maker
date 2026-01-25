import { TextResources } from '../TextResources';

type GameStateLike = {
  game: { roomSize: number };
  isGameOver: () => boolean;
  isLevelUpCelebrationActive?: () => boolean;
  isLevelUpOverlayActive?: () => boolean;
  isPickupOverlayActive?: () => boolean;
  getDialog: () => { active: boolean; page: number; maxPages: number };
  setDialogPage: (page: number) => void;
  getPlayer: () => PlayerLike;
  getRoomCoords: (roomIndex: number) => { row: number; col: number };
  getRoomIndex: (row: number, col: number) => number | null;
  getGame: () => { rooms: RoomLike[]; sprites?: NpcLike[] };
  getObjectAt: (roomIndex: number, x: number, y: number) => GameObjectLike | null;
  isVariableOn: (variableId: string) => boolean;
  hasSkill?: (skillId: string) => boolean;
  consumeKey: () => boolean;
  getKeys: () => number;
  setPlayerPosition: (x: number, y: number, roomIndex: number | null) => void;
};

type TileManagerLike = {
  getTileMap: (roomIndex: number) => TileMapLike | null;
  getTile: (tileId: string | number) => TileDefinition | null;
};

type RendererLike = {
  draw: () => void;
  captureGameplayFrame: () => unknown;
  startRoomTransition: (payload: Record<string, unknown>) => boolean;
  flashEdge: (direction: string, payload: Record<string, unknown>) => void;
};

type DialogManagerLike = {
  closeDialog: () => void;
  showDialog: (text: string, meta?: Record<string, unknown>) => void;
};

type InteractionManagerLike = {
  handlePlayerInteractions: () => void;
  getNpcDialogText?: (npc: NpcLike) => string;
  getNpcDialogMeta?: (npc: NpcLike) => Record<string, unknown> | undefined;
};

type EnemyManagerLike = {
  collideAt: (roomIndex: number, x: number, y: number) => boolean;
  checkCollisionAt: (x: number, y: number) => void;
};

type PlayerLike = {
  roomIndex: number;
  x: number;
  y: number;
  lastX?: number;
  lastRoomChangeTime?: number | null;
};

type RoomLike = {
  walls?: boolean[][];
};

type NpcLike = {
  placed?: boolean;
  roomIndex: number;
  x: number;
  y: number;
  text?: string;
};

type GameObjectLike = {
  isVariableDoor?: boolean;
  variableId?: string;
  isLockedDoor?: boolean;
  opened?: boolean;
  type?: string;
};

type TileDefinition = {
  collision?: boolean;
  category?: string;
  name?: string;
};

type TileMapLike = {
  ground?: (string | number | null)[][];
  overlay?: (string | number | null)[][];
};

const getMovementText = (key: string, fallback = ''): string => {
  const value = TextResources.get(key, fallback);
  return value || fallback || '';
};

const formatMovementText = (key: string, params: Record<string, unknown> = {}, fallback = ''): string => {
  const value = TextResources.format(key, params, fallback);
  return value || fallback || '';
};

class MovementManager {
  gameState: GameStateLike;
  tileManager: TileManagerLike;
  renderer: RendererLike;
  dialogManager: DialogManagerLike;
  interactionManager: InteractionManagerLike;
  enemyManager: EnemyManagerLike;
  transitioning: boolean;

  constructor({
    gameState,
    tileManager,
    renderer,
    dialogManager,
    interactionManager,
    enemyManager,
  }: {
    gameState: GameStateLike;
    tileManager: TileManagerLike;
    renderer: RendererLike;
    dialogManager: DialogManagerLike;
    interactionManager: InteractionManagerLike;
    enemyManager: EnemyManagerLike;
  }) {
    this.gameState = gameState;
    this.tileManager = tileManager;
    this.renderer = renderer;
    this.dialogManager = dialogManager;
    this.interactionManager = interactionManager;
    this.enemyManager = enemyManager;
    this.transitioning = false;
  }

  tryMove(dx: number, dy: number): void {
    if (this.transitioning) {
      return;
    }
    if (this.gameState.isGameOver()) {
      return;
    }
    if (this.gameState.isLevelUpCelebrationActive?.()) {
      return;
    }
    if (this.gameState.isLevelUpOverlayActive?.()) {
      return;
    }
    if (this.gameState.isPickupOverlayActive?.()) {
      return;
    }
    const dialog = this.gameState.getDialog();
    if (dialog.active) {
      if (dialog.page >= dialog.maxPages) {
        this.dialogManager.closeDialog();
        return;
      }
      this.gameState.setDialogPage(dialog.page + 1);
      this.renderer.draw();
      return;
    }

    const player = this.gameState.getPlayer();
    const direction = this.getDirectionFromDelta(dx, dy);
    const roomIndex = player.roomIndex;
    const previousPosition = {
      x: player?.x ?? 0,
      y: player?.y ?? 0,
      roomIndex,
      lastX: player?.lastX ?? player?.x ?? 0,
      facingLeft: (player?.x ?? 0) < (player?.lastX ?? player?.x ?? 0),
    };
    const currentCoords = this.gameState.getRoomCoords(roomIndex);
    const limit = this.gameState.game.roomSize - 1;

    let targetRoomIndex = roomIndex;
    let targetX = player.x + dx;
    let targetY = player.y + dy;

    if (targetX < 0) {
      const nextCol = currentCoords.col - 1;
      const neighbor = this.gameState.getRoomIndex(currentCoords.row, nextCol);
      if (neighbor !== null) {
        targetRoomIndex = neighbor;
        targetX = limit;
      } else {
        targetX = 0;
      }
    } else if (targetX > limit) {
      const nextCol = currentCoords.col + 1;
      const neighbor = this.gameState.getRoomIndex(currentCoords.row, nextCol);
      if (neighbor !== null) {
        targetRoomIndex = neighbor;
        targetX = 0;
      } else {
        targetX = limit;
      }
    }

    if (targetY < 0) {
      const nextRow = currentCoords.row - 1;
      const neighbor = this.gameState.getRoomIndex(nextRow, currentCoords.col);
      if (neighbor !== null) {
        targetRoomIndex = neighbor;
        targetY = limit;
      } else {
        targetY = 0;
      }
    } else if (targetY > limit) {
      const nextRow = currentCoords.row + 1;
      const neighbor = this.gameState.getRoomIndex(nextRow, currentCoords.col);
      if (neighbor !== null) {
        targetRoomIndex = neighbor;
        targetY = 0;
      } else {
        targetY = limit;
      }
    }

    const enteringNewRoom = targetRoomIndex !== roomIndex;

    const targetRoom = this.gameState.getGame().rooms?.[targetRoomIndex];
    if (!targetRoom) {
      if (enteringNewRoom) {
        this.flashBlockedEdge(direction, { x: targetX, y: targetY });
      }
      return;
    }

    if (targetRoom.walls?.[targetY]?.[targetX]) {
      if (enteringNewRoom) {
        this.flashBlockedEdge(direction, { x: targetX, y: targetY });
      }
      return;
    }

    const objectAtTarget = this.gameState.getObjectAt(targetRoomIndex, targetX, targetY) ?? null;
    const isVariableDoor = Boolean(objectAtTarget?.isVariableDoor);
    if (isVariableDoor) {
      const variableId = objectAtTarget?.variableId;
      const doorOpen = variableId ? this.gameState.isVariableOn(variableId) : false;
      if (!doorOpen) {
        this.dialogManager.showDialog(getMovementText('doors.variableLocked'));
        this.renderer.draw();
        return;
      }
    }
    const isLockedDoor = Boolean(objectAtTarget?.isLockedDoor);
    if (isLockedDoor && !objectAtTarget?.opened) {
      const hasSkill = this.gameState.hasSkill?.('keyless-doors');
      let openedWithSkill = false;
      let consumeKey = false;
      if (hasSkill) {
        openedWithSkill = true;
      } else {
        consumeKey = this.gameState.consumeKey();
      }
      if (openedWithSkill || consumeKey) {
        if (objectAtTarget) {
          objectAtTarget.opened = true;
        }
        const remainingKeys = this.gameState.getKeys();
        const message = openedWithSkill
          ? getMovementText('doors.unlockedSkill', getMovementText('doors.opened', ''))
          : Number.isFinite(remainingKeys)
            ? formatMovementText('doors.openedRemaining', { value: remainingKeys })
            : getMovementText('doors.opened');
        if (message) {
          this.dialogManager.showDialog(message);
        }
      } else {
        this.dialogManager.showDialog(getMovementText('doors.locked'));
        this.renderer.draw();
        return;
      }
    }

    const tileMap = this.tileManager.getTileMap(targetRoomIndex);
    const overlayId = tileMap?.overlay?.[targetY]?.[targetX] ?? null;
    const groundId = tileMap?.ground?.[targetY]?.[targetX] ?? null;
    const candidateId = overlayId ?? groundId;
    if (candidateId !== null && candidateId !== undefined) {
      const tile = this.tileManager.getTile(candidateId);
      if (tile?.collision && !this.canTraverseCollisionTile(tile)) {
        if (enteringNewRoom) {
          this.flashBlockedEdge(direction, { x: targetX, y: targetY });
        }
        return;
      }
    }

    // Prevent passing through NPCs: trigger dialog and stay in place.
    const npcAtTarget = this.findNpcAt(targetRoomIndex, targetX, targetY);
    if (npcAtTarget) {
      const dialogText = this.interactionManager.getNpcDialogText
        ? this.interactionManager.getNpcDialogText(npcAtTarget)
        : npcAtTarget.text || '';
      const dialogMeta = this.interactionManager.getNpcDialogMeta
        ? this.interactionManager.getNpcDialogMeta(npcAtTarget)
        : undefined;
      if (dialogText) {
        this.dialogManager.showDialog(dialogText, dialogMeta);
        this.renderer.draw();
      }
      return;
    }

    // Prevent passing through enemies: resolve collision/combat without moving.
    if (!enteringNewRoom) {
      const enemyHit = this.enemyManager?.collideAt?.(targetRoomIndex, targetX, targetY) || false;
      if (enemyHit) {
        this.renderer.draw();
        return;
      }
    }

    const supportsTransition = enteringNewRoom;
    const fromFrame = supportsTransition ? this.renderer.captureGameplayFrame() : null;

    this.gameState.setPlayerPosition(targetX, targetY, targetRoomIndex !== roomIndex ? targetRoomIndex : null);
    if (enteringNewRoom) {
      const updatedPlayer = this.gameState.getPlayer();
      if (updatedPlayer) {
        if (dx !== 0) {
          updatedPlayer.lastX = updatedPlayer.x - Math.sign(dx);
        } else if (previousPosition.lastX !== undefined) {
          updatedPlayer.lastX = previousPosition.lastX;
        }
        updatedPlayer.lastRoomChangeTime = Date.now();
      }
    }
    this.interactionManager.handlePlayerInteractions();
    const currentPlayer = this.gameState.getPlayer();
    this.enemyManager.checkCollisionAt(currentPlayer.x, currentPlayer.y);

    if (supportsTransition && fromFrame) {
      this.renderer.draw();
      const toFrame = this.renderer.captureGameplayFrame();
      if (toFrame) {
        const started = this.renderer.startRoomTransition({
          direction,
          fromFrame,
          toFrame,
          playerPath: {
            from: previousPosition,
            to: { x: targetX, y: targetY, roomIndex: targetRoomIndex },
            facingLeft: dx < 0 ? true : dx > 0 ? false : previousPosition.facingLeft,
          },
          onComplete: () => {
            this.transitioning = false;
            this.renderer.draw();
          },
        });
        if (started) {
          this.transitioning = true;
          return;
        }
      }
    }

    this.renderer.draw();
  }

  getDirectionFromDelta(dx: number, dy: number): string {
    if (dx < 0) return 'left';
    if (dx > 0) return 'right';
    if (dy < 0) return 'up';
    if (dy > 0) return 'down';
    return '';
  }

  canTraverseCollisionTile(tile: { collision?: boolean; category?: string; name?: string } | null = null): boolean {
    if (!tile?.collision) return true;
    const normalize = (value = '') =>
      value
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const category = normalize(tile.category || '');
    const name = normalize(tile.name || '');
    const isWater = category === 'agua' || name.includes('agua');
    const isLava = category === 'perigo' || name.includes('lava');
    if (isWater && this.gameState.hasSkill?.('water-walker')) {
      return true;
    }
    if (isLava && this.gameState.hasSkill?.('lava-walker')) {
      return true;
    }
    return false;
  }

  flashBlockedEdge(direction: string, coords: { x?: number; y?: number } | null = null): void {
    if (!direction) return;
    this.renderer.flashEdge(direction, {
      duration: 240,
      tileX: coords?.x,
      tileY: coords?.y,
    });
    this.renderer.draw();
  }

  findNpcAt(roomIndex: number, x: number, y: number): NpcLike | null {
    const sprites = this.gameState?.getGame()?.sprites || [];
    return (
      sprites.find((npc) => npc.placed && npc.roomIndex === roomIndex && npc.x === x && npc.y === y) ||
      null
    );
  }
}

export { MovementManager };
