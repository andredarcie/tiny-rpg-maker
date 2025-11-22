class StatePlayerManager {
    constructor(state, worldManager, skillManager = null) {
        this.state = state;
        this.worldManager = worldManager;
        this.skillManager = skillManager;
        this.maxLevel = 9;
        this.baseMaxLives = 3;
        this.experienceBase = 40;
        this.experienceGrowth = 1.8;
        this.maxKeys = 9;
    }

    setState(state) {
        this.state = state;
    }

    setWorldManager(worldManager) {
        this.worldManager = worldManager;
    }

    setSkillManager(skillManager) {
        this.skillManager = skillManager;
    }

    get player() {
        return this.state?.player;
    }

    getPlayer() {
        return this.player;
    }

    setPosition(x, y, roomIndex = null) {
        if (!this.player) return;
        this.player.lastX = this.player.x;
        this.player.x = this.worldManager.clampCoordinate(x);
        this.player.y = this.worldManager.clampCoordinate(y);
        if (roomIndex !== null && roomIndex !== undefined) {
            this.player.roomIndex = this.worldManager.clampRoomIndex(roomIndex);
        }
        this.ensurePlayerStats();
    }

    reset(start) {
        const fallback = start || { x: 1, y: 1, roomIndex: 0 };
        this.setPosition(fallback.x, fallback.y, fallback.roomIndex);
        if (!this.player) return;
        this.player.level = 1;
        this.player.maxLives = this.calculateMaxLives(this.player.level);
        this.player.currentLives = this.player.maxLives;
        this.player.lives = this.player.currentLives;
        this.player.keys = 0;
        this.player.experience = 0;
        this.player.damageShield = 0;
        this.player.damageShieldMax = 0;
        this.player.swordType = null;
        this.player.lastDamageReduction = 0;
    }

    addKeys(amount = 1) {
        if (!this.player) return 0;
        const numeric = Number(amount);
        if (!Number.isFinite(numeric)) return this.player.keys;
        const delta = Math.floor(numeric);
        const nextKeys = Math.max(0, this.player.keys + delta);
        this.player.keys = Math.min(this.maxKeys, nextKeys);
        return this.player.keys;
    }

    consumeKey() {
        if (!this.player) return false;
        if (this.player.keys <= 0) return false;
        this.player.keys -= 1;
        return true;
    }

    getKeys() {
        return this.player?.keys ?? 0;
    }

    getMaxKeys() {
        return this.maxKeys;
    }

    damage(amount = 1) {
        if (!this.player) return 0;
        this.ensurePlayerStats();
        let delta = Number.isFinite(amount) ? Math.max(0, amount) : 1;
        if (this.skillManager?.hasSkill?.('iron-body')) {
            delta = Math.max(0, delta - 1);
        }
        const shield = Math.max(0, Number(this.player.damageShield) || 0);
        const reduction = Math.min(shield, delta);
        const effective = Math.max(0, delta - reduction);
        this.player.damageShield = Math.max(0, shield - reduction);
        if (this.player.damageShield === 0) {
            this.player.damageShieldMax = 0;
            this.player.swordType = null;
        }
        this.player.lastDamageReduction = reduction;
        this.player.currentLives = Math.max(0, this.player.currentLives - effective);
        if (this.player.currentLives <= 0) {
            this.skillManager?.attemptRevive?.(this.player);
        }
        this.player.lives = this.player.currentLives;
        return this.player.currentLives;
    }

    addDamageShield(amount = 1, swordType = null) {
        if (!this.player) return 0;
        const numeric = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (numeric <= 0) return this.player.damageShield ?? 0;
        this.ensurePlayerStats();
        const shield = Math.max(0, Number(this.player.damageShield) || 0) + numeric;
        this.player.damageShield = shield;
        this.player.damageShieldMax = Math.max(shield, numeric, Number(this.player.damageShieldMax) || 0);
        if (swordType) {
            this.player.swordType = swordType;
        }
        return shield;
    }

    getDamageShield() {
        return Math.max(0, Number(this.player?.damageShield) || 0);
    }

    getDamageShieldMax() {
        return Math.max(0, Number(this.player?.damageShieldMax) || 0);
    }

    getSwordType() {
        return typeof this.player?.swordType === 'string' ? this.player.swordType : null;
    }

    consumeLastDamageReduction() {
        if (!this.player) return 0;
        this.ensurePlayerStats();
        const reduction = Math.max(0, Number(this.player.lastDamageReduction) || 0);
        this.player.lastDamageReduction = 0;
        return reduction;
    }

    gainLives(amount = 1) {
        if (!this.player) return 0;
        this.ensurePlayerStats();
        const numeric = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (numeric <= 0) return this.player.currentLives;
        this.player.currentLives = Math.min(this.player.maxLives, this.player.currentLives + numeric);
        this.player.lives = this.player.currentLives;
        return this.player.currentLives;
    }

    getLives() {
        this.ensurePlayerStats();
        return this.player?.currentLives ?? 0;
    }

    getMaxLives() {
        this.ensurePlayerStats();
        return this.player?.maxLives ?? 0;
    }

    getLevel() {
        this.ensurePlayerStats();
        return this.player?.level ?? 1;
    }

    calculateMaxLives(level) {
        const numericLevel = Number.isFinite(level) ? Math.floor(level) : 1;
        const bonus = this.skillManager?.getBonusMaxLives?.() || 0;
        return this.baseMaxLives + Math.max(0, numericLevel - 1) + bonus;
    }

    clampLevel(level) {
        const numeric = Number.isFinite(level) ? Math.floor(level) : 1;
        return Math.max(1, Math.min(this.maxLevel, numeric));
    }

    ensurePlayerStats() {
        if (!this.player) return;
        const level = this.clampLevel(this.player.level ?? 1);
        this.player.level = level;
        const expectedMax = this.calculateMaxLives(level);
        this.player.maxLives = expectedMax;
        const currentLives = Number.isFinite(this.player.currentLives)
            ? Math.floor(this.player.currentLives)
            : this.player.maxLives;
        this.player.currentLives = Math.max(0, Math.min(this.player.maxLives, currentLives));
        this.player.lives = this.player.currentLives;
        const experience = Number.isFinite(this.player.experience)
            ? Math.max(0, Math.floor(this.player.experience))
            : 0;
        if (level >= this.maxLevel) {
            this.player.experience = 0;
        } else {
            const requirement = this.getExperienceForNextLevel(level);
            this.player.experience = Math.min(experience, Math.max(0, requirement - 1));
        }
        if (!Number.isFinite(this.player.damageShield)) {
            this.player.damageShield = 0;
        } else {
            this.player.damageShield = Math.max(0, Math.floor(this.player.damageShield));
        }
        if (!Number.isFinite(this.player.damageShieldMax)) {
            this.player.damageShieldMax = 0;
        } else {
            this.player.damageShieldMax = Math.max(this.player.damageShield, Math.floor(this.player.damageShieldMax));
        }
        if (typeof this.player.swordType !== 'string') {
            this.player.swordType = null;
        }
        if (this.player.damageShield <= 0) {
            this.player.swordType = null;
        }
        if (!Number.isFinite(this.player.lastDamageReduction)) {
            this.player.lastDamageReduction = 0;
        }
    }

    healToFull() {
        if (!this.player) return this.getLives();
        this.ensurePlayerStats();
        this.player.currentLives = this.player.maxLives;
        this.player.lives = this.player.currentLives;
        return this.player.currentLives;
    }

    getExperience() {
        this.ensurePlayerStats();
        return this.player?.experience ?? 0;
    }

    getExperienceForNextLevel(level) {
        const clamped = this.clampLevel(level);
        if (clamped >= this.maxLevel) return 0;
        const value = Math.floor(this.experienceBase * Math.pow(this.experienceGrowth, clamped - 1));
        return Math.max(5, value);
    }

    getExperienceToNext() {
        this.ensurePlayerStats();
        const level = this.player?.level ?? 1;
        return this.getExperienceForNextLevel(level);
    }

    addExperience(amount = 0) {
        if (!this.player) {
            return {
                leveledUp: false,
                levelsGained: 0,
                level: 0,
                experience: 0,
                experienceToNext: 0,
                currentLives: 0,
                maxLives: 0
            };
        }
        this.ensurePlayerStats();
        const gain = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (gain <= 0 || this.player.level >= this.maxLevel) {
            if (this.player.level >= this.maxLevel) {
                this.player.experience = 0;
            }
            return {
                leveledUp: false,
                levelsGained: 0,
                level: this.player.level,
                experience: this.player.experience,
                experienceToNext: this.getExperienceToNext(),
                currentLives: this.player.currentLives,
                maxLives: this.player.maxLives
            };
        }
        let experience = this.player.experience + gain;
        let levelsGained = 0;
        while (this.player.level < this.maxLevel) {
            const required = this.getExperienceForNextLevel(this.player.level);
            if (experience < required) break;
            experience -= required;
            this.player.level += 1;
            levelsGained += 1;
            this.player.maxLives = this.calculateMaxLives(this.player.level);
            this.player.currentLives = this.player.maxLives;
            this.player.lives = this.player.currentLives;
        }
        if (this.player.level >= this.maxLevel) {
            this.player.level = this.maxLevel;
            this.player.experience = 0;
        } else {
            this.player.experience = experience;
        }
        return {
            leveledUp: levelsGained > 0,
            levelsGained,
            level: this.player.level,
            experience: this.player.experience,
            experienceToNext: this.getExperienceToNext(),
            currentLives: this.player.currentLives,
            maxLives: this.player.maxLives
        };
    }

    handleEnemyDefeated(experienceReward = 0) {
        return this.addExperience(experienceReward);
    }
}

if (typeof window !== 'undefined') {
    window.StatePlayerManager = StatePlayerManager;
}

