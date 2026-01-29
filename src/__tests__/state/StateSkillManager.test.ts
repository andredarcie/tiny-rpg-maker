import { describe, expect, it } from 'vitest';
import { SkillDefinitions } from '../../runtime/domain/definitions/SkillDefinitions';
import { StateSkillManager } from '../../runtime/domain/state/StateSkillManager';
import { createRuntimeStateMock } from './mocks';

describe('StateSkillManager', () => {
    it('includes description and icon data for level-up overlay choices', () => {
        const state = createRuntimeStateMock();
        const manager = new StateSkillManager(state);

        manager.queueLevelUps(1, 2);
        const overlay = manager.startLevelSelection();

        expect(overlay).not.toBeNull();
        const choices = overlay?.choices ?? [];
        expect(choices.length).toBeGreaterThan(0);

        choices.forEach((choice) => {
            const definition = SkillDefinitions.getById(choice.id);
            expect(definition).not.toBeNull();
            expect(choice.descriptionKey).toBe(definition?.descriptionKey);
            expect(choice.icon).toBe(definition?.icon);
        });
    });
});
