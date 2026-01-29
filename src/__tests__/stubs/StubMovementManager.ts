import { vi } from 'vitest'

export class StubMovementManager {
  tryMove = vi.fn()
  constructor(_opts: unknown) {}
}
