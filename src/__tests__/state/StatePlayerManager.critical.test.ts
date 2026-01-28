import { describe, expect, it } from 'vitest';
import { StatePlayerManager } from '../../runtime/domain/state/StatePlayerManager';
import type { RuntimeState } from '../../types/gameState';

const createWorldManager = () => ({
  clampRoomIndex: (value: number) => {
    const numeric = Number.isFinite(value) ? Math.floor(value) : 0;
    return Math.max(0, Math.min(8, numeric));
  },
  clampCoordinate: (value: number) => {
    const numeric = Number.isFinite(value) ? Math.floor(value) : 0;
    return Math.max(0, Math.min(7, numeric));
  },
});

const createState = (): RuntimeState => ({
  player: {
    x: 1,
    y: 1,
    lastX: 1,
    roomIndex: 0,
    level: 1,
    maxLives: 3,
    currentLives: 3,
    lives: 3,
    keys: 0,
    experience: 0,
    damageShield: 0,
    damageShieldMax: 0,
    swordType: null,
    lastDamageReduction: 0,
    godMode: false,
  },
  dialog: { active: false, text: '', page: 1, maxPages: 1, meta: null },
  enemies: [],
  variables: [],
  gameOver: false,
  gameOverReason: null,
  pickupOverlay: {
    active: false,
    name: '',
    spriteGroup: null,
    spriteType: null,
    effect: null,
  },
  levelUpOverlay: { active: false, choices: [], cursor: 0 },
  levelUpCelebration: {
    active: false,
    level: null,
    startTime: 0,
    timeoutId: null,
    durationMs: 3000,
  },
  skillRuntime: null,
});

describe('StatePlayerManager - Critical Path Tests', () => {
  describe('Multi-level progression', () => {
    it('handles multiple level-ups from single large XP gain', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      // Give enough XP to level up multiple times (base 6, growth 1.35)
      // Level 1->2 needs 6 XP, 2->3 needs 8 XP, 3->4 needs 10 XP, 4->5 needs 14 XP
      // Total: 38 XP for 4 levels
      const result = manager.addExperience(50);

      expect(result.leveledUp).toBe(true);
      expect(result.levelsGained).toBe(4);
      expect(result.level).toBe(5);
      expect(result.experience).toBe(12); // 50 - 6 - 8 - 10 - 14 = 12
    });

    it('stops leveling at max level and resets experience', () => {
      const state = createState();
      state.player.level = 9; // One below max (10)
      state.player.maxLives = 11;
      state.player.currentLives = 11;
      const manager = new StatePlayerManager(state, createWorldManager());

      const result = manager.addExperience(1000);

      expect(result.level).toBe(10);
      expect(result.experience).toBe(0);
      expect(result.leveledUp).toBe(true);
      expect(result.levelsGained).toBe(1);
    });

    it('fully heals player on each level up', () => {
      const state = createState();
      state.player.currentLives = 1; // Low health
      const manager = new StatePlayerManager(state, createWorldManager());

      const result = manager.addExperience(50); // Multiple level-ups

      expect(result.currentLives).toBe(result.maxLives);
      expect(state.player.currentLives).toBe(state.player.maxLives);
    });
  });

  describe('XP boost skill', () => {
    it('applies XP boost when skill is active', () => {
      const state = createState();
      const skillManager = {
        hasSkill: (skillId: string) => skillId === 'xp-boost',
        getXpBoost: () => 0.5, // 50% boost
      };
      const manager = new StatePlayerManager(state, createWorldManager(), skillManager);

      manager.addExperience(10);

      // 10 * 1.5 = 15 XP total, which exceeds the 6 needed for level 2 and 8 for level 3
      expect(state.player.level).toBe(3);
      expect(state.player.experience).toBe(1); // 15 - 6 - 8 = 1
    });

    it('handles zero XP gain gracefully', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      const result = manager.addExperience(0);

      expect(result.leveledUp).toBe(false);
      expect(result.levelsGained).toBe(0);
      expect(result.level).toBe(1);
    });
  });

  describe('Damage calculation with shields', () => {
    it('reduces damage using shield before affecting health', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      manager.addDamageShield(5, 'iron');
      state.player.currentLives = 3;

      manager.damage(3);

      expect(state.player.damageShield).toBe(2);
      expect(state.player.currentLives).toBe(3); // No health lost
      expect(state.player.lastDamageReduction).toBe(3);
    });

    it('uses remaining shield then takes health damage', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      manager.addDamageShield(2, 'bronze');
      state.player.currentLives = 3;

      manager.damage(5);

      expect(state.player.damageShield).toBe(0);
      expect(state.player.damageShieldMax).toBe(0);
      expect(state.player.swordType).toBeNull();
      expect(state.player.currentLives).toBe(0); // 3 - 3 = 0 (2 absorbed by shield)
      expect(state.player.lastDamageReduction).toBe(2);
    });

    it('preserves sword type while shield is active', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      manager.addDamageShield(5, 'legendary');
      manager.damage(2);

      expect(state.player.swordType).toBe('legendary');
      expect(state.player.damageShield).toBe(3);
    });

    it('clears sword type when shield depletes', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      manager.addDamageShield(2, 'wood');
      manager.damage(2);

      expect(state.player.damageShield).toBe(0);
      expect(state.player.swordType).toBeNull();
    });
  });

  describe('Iron-body skill damage reduction', () => {
    it('reduces incoming damage by 1 when iron-body is active', () => {
      const state = createState();
      const skillManager = {
        hasSkill: (skillId: string) => skillId === 'iron-body',
      };
      const manager = new StatePlayerManager(state, createWorldManager(), skillManager);

      state.player.currentLives = 3;
      manager.damage(2);

      expect(state.player.currentLives).toBe(2); // 3 - (2-1) = 2
    });

    it('stacks with shield protection', () => {
      const state = createState();
      const skillManager = {
        hasSkill: (skillId: string) => skillId === 'iron-body',
      };
      const manager = new StatePlayerManager(state, createWorldManager(), skillManager);

      manager.addDamageShield(3, 'iron');
      state.player.currentLives = 3;

      manager.damage(5); // Reduced to 4 by iron-body

      expect(state.player.damageShield).toBe(0); // 3 absorbed
      expect(state.player.currentLives).toBe(2); // 3 - 1 = 2
    });

    it('can reduce damage to zero', () => {
      const state = createState();
      const skillManager = {
        hasSkill: (skillId: string) => skillId === 'iron-body',
      };
      const manager = new StatePlayerManager(state, createWorldManager(), skillManager);

      state.player.currentLives = 3;
      manager.damage(1);

      expect(state.player.currentLives).toBe(3); // 1 - 1 = 0 damage
    });
  });

  describe('God mode', () => {
    it('prevents all damage and tracks reduction', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      manager.setGodMode(true);
      state.player.currentLives = 1;

      manager.damage(10);

      expect(state.player.currentLives).toBe(state.player.maxLives);
      expect(state.player.lastDamageReduction).toBe(10);
    });

    it('fully heals player when god mode is enabled', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      state.player.currentLives = 1;
      manager.setGodMode(true);

      expect(state.player.currentLives).toBe(state.player.maxLives);
    });
  });

  describe('Revive attempt', () => {
    it('calls skill manager attemptRevive when lives reach zero', () => {
      const state = createState();
      let reviveCalled = false;
      const skillManager = {
        attemptRevive: (player: typeof state.player) => {
          reviveCalled = true;
          player.currentLives = 1; // Simulate revive
        },
      };
      const manager = new StatePlayerManager(state, createWorldManager(), skillManager);

      state.player.currentLives = 1;
      manager.damage(1);

      expect(reviveCalled).toBe(true);
      expect(state.player.currentLives).toBe(1);
    });
  });

  describe('Max lives calculation', () => {
    it('calculates max lives from level', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      // Base: 3, Level 1: +0, Level 5: +4
      expect(manager.calculateMaxLives(1)).toBe(3);
      expect(manager.calculateMaxLives(5)).toBe(7);
    });

    it('includes bonus max lives from skills', () => {
      const state = createState();
      const skillManager = {
        getBonusMaxLives: () => 2,
      };
      const manager = new StatePlayerManager(state, createWorldManager(), skillManager);

      expect(manager.calculateMaxLives(1)).toBe(5); // 3 + 0 + 2
      expect(manager.calculateMaxLives(5)).toBe(9); // 3 + 4 + 2
    });
  });

  describe('Room change damage cooldown', () => {
    it('detects when player is on damage cooldown', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      state.player.lastRoomChangeTime = Date.now();

      expect(manager.isOnDamageCooldown()).toBe(true);
    });

    it('detects when cooldown has expired', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      state.player.lastRoomChangeTime = Date.now() - 1000;

      expect(manager.isOnDamageCooldown()).toBe(false);
    });
  });

  describe('Player stats normalization', () => {
    it('clamps current lives to max lives', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      state.player.currentLives = 999;
      manager.ensurePlayerStats();

      expect(state.player.currentLives).toBe(state.player.maxLives);
    });

    it('clamps experience below level requirement', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      state.player.experience = 999;
      manager.ensurePlayerStats();

      const requirement = manager.getExperienceToNext();
      expect(state.player.experience).toBeLessThan(requirement);
    });

    it('resets experience at max level', () => {
      const state = createState();
      const manager = new StatePlayerManager(state, createWorldManager());

      state.player.level = 10;
      state.player.experience = 999;
      manager.ensurePlayerStats();

      expect(state.player.experience).toBe(0);
    });
  });
});
