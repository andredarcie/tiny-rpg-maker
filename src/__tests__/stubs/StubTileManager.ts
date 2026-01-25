import { vi } from 'vitest'
import type { StubGameState } from './StubGameState'

export class StubTileManager {
  ensureDefaultTiles = vi.fn()
  lastSet: { x: number; y: number; tileId: string; roomIndex: number } | null = null
  lastGetRoom: number | null = null

  constructor(_state: StubGameState) {}

  setMapTile(x: number, y: number, tileId: string, roomIndex: number) {
    this.lastSet = { x, y, tileId, roomIndex }
  }

  updateTile() {}
  getTiles() {
    return []
  }
  getTileMap(roomIndex: number) {
    this.lastGetRoom = roomIndex
    return []
  }
  getPresetTileNames() {
    return []
  }
}
