# Lint Baseline Checklist

Baseline report: `eslint-report.json`

## Phase Tracking
- [x] Phase 1: Runtime core/engine typed (MovementManager, InteractionManager, EnemyManager)
- [x] Phase 2: Renderer layer typed (RendererEntityRenderer, RendererSpriteFactory, RendererConstants)
- [ ] Phase 3: Editor layer typed (EditorManager + editor services/renderers)
- [ ] Phase 4: Share/infra layer typed (Share* codecs/utils)
- [ ] Phase 5: Tests cleaned or isolated (reduce `any`/unsafe in `src/__tests__`)

## Rule Cleanup Targets
- [ ] `@typescript-eslint/no-explicit-any` resolved in `src/runtime/**`
- [ ] `@typescript-eslint/no-unsafe-assignment` resolved in `src/runtime/**`
- [ ] `@typescript-eslint/no-unsafe-member-access` resolved in `src/runtime/**`
- [ ] `@typescript-eslint/no-unsafe-call` resolved in `src/runtime/**`
- [ ] `@typescript-eslint/no-unsafe-return` resolved in `src/runtime/**`
- [ ] `@typescript-eslint/no-unsafe-argument` resolved in `src/runtime/**`
- [ ] `@typescript-eslint/consistent-type-imports` warnings resolved project-wide

## Per-Area Progress
- [x] `src/runtime/services/engine/*` cleaned
- [x] `src/runtime/adapters/renderer/*` cleaned
- [ ] `src/runtime/infra/share/*` cleaned
- [ ] `src/editor/**` cleaned
- [ ] `src/__tests__/**` cleaned or rules scoped
