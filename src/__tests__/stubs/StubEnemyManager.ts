import { vi } from 'vitest'
import type { StubGameState } from './StubGameState'
import type { StubRenderer } from './StubRenderer'
import type { StubTileManager } from './StubTileManager'

export class StubEnemyManager {
  started = false

  constructor(_state: StubGameState, _renderer: StubRenderer, _tileManager: StubTileManager, _opts: unknown) {}

  start = vi.fn(() => {
    this.started = true
  })
  stop = vi.fn(() => {
    this.started = false
  })
  tick() {}
  handleEnemyCollision() {}
  checkCollisionAt() {}
  getEnemyDefinitions() {
    return []
  }
  getActiveEnemies() {
    return []
  }
  addEnemy(enemy: unknown) {
    return enemy
  }
  removeEnemy() {}
  generateEnemyId() {
    return 'enemy-1'
  }
}
