import { vi } from 'vitest'
import type { StubGameState } from './StubGameState'

export class StubNpcManager {
  ensureDefaultNPCs = vi.fn()

  constructor(_state: StubGameState) {}

  addNPC(npc: unknown) {
    return npc
  }

  getNPCs() {
    return []
  }
}
