import { vi } from 'vitest'
import type { StubGameState } from './StubGameState'
import type { StubDialogManager } from './StubDialogManager'

export class StubInteractionManager {
  constructor(_state: StubGameState, _dialog: StubDialogManager, _opts: unknown) {}
  handlePlayerInteractions = vi.fn()
}
