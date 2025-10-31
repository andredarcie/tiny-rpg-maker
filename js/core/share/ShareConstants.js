class ShareConstants {
    static get VERSION_1() { return 1; }
    static get VERSION_2() { return 2; }
    static get VERSION_3() { return 3; }
    static get VERSION_4() { return 4; }
    static get VERSION_5() { return 5; }
    static get VERSION_6() { return 6; }
    static get VERSION_7() { return 7; }
    static get VERSION_8() { return 8; }

    static get VERSION() {
        return ShareConstants.VERSION_8;
    }

    static get LEGACY_VERSION() {
        return ShareConstants.VERSION_1;
    }

    static get OBJECTS_VERSION() {
        return ShareConstants.VERSION_4;
    }

    static get VARIABLES_VERSION() {
        return ShareConstants.VERSION_5;
    }

    static get WORLD_MULTIMAP_VERSION() {
        return ShareConstants.VERSION_6;
    }

    static get NPC_VARIABLE_TEXT_VERSION() {
        return ShareConstants.VERSION_6;
    }

    static get MAGIC_DOOR_VERSION() {
        return ShareConstants.VERSION_7;
    }

    static get NPC_CONDITIONAL_REWARD_VERSION() {
        return ShareConstants.VERSION_8;
    }

    static get MATRIX_SIZE() {
        return 8;
    }

    static get TILE_COUNT() {
        return ShareConstants.MATRIX_SIZE * ShareConstants.MATRIX_SIZE;
    }

    static get WORLD_ROWS() {
        return 3;
    }

    static get WORLD_COLS() {
        return 3;
    }

    static get WORLD_ROOM_COUNT() {
        return ShareConstants.WORLD_ROWS * ShareConstants.WORLD_COLS;
    }

    static get MAX_ROOM_INDEX() {
        return ShareConstants.WORLD_ROOM_COUNT - 1;
    }

    static get NULL_CHAR() {
        return 'z';
    }

    static get GROUND_SPARSE_PREFIX() {
        return 'x';
    }

    static get OVERLAY_BINARY_PREFIX() {
        return 'y';
    }

    static get POSITION_WIDE_PREFIX() {
        return '~';
    }

    static get DEFAULT_TITLE() {
        return 'My Tiny RPG Game';
    }

    static get DEFAULT_PALETTE() {
        return [
            '#000000', '#1D2B53', '#7E2553', '#008751',
            '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
            '#FF004D', '#FFA300', '#FFFF27', '#00E756',
            '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
        ];
    }

    static get VARIABLE_IDS() {
        return ['var-1', 'var-2', 'var-3', 'var-4', 'var-5', 'var-6'];
    }

    static get VARIABLE_NAMES() {
        return ['1 - Preto', '2 - Azul Escuro', '3 - Roxo', '4 - Verde', '5 - Marrom', '6 - Cinza'];
    }

    static get VARIABLE_COLORS() {
        return ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F'];
    }

    static get SUPPORTED_VERSIONS() {
        if (!this._supportedVersions) {
            this._supportedVersions = new Set([
                ShareConstants.VERSION_1,
                ShareConstants.VERSION_2,
                ShareConstants.VERSION_3,
                ShareConstants.VERSION_4,
                ShareConstants.VERSION_5,
                ShareConstants.VERSION_6,
                ShareConstants.VERSION_7,
                ShareConstants.VERSION
            ]);
        }
        return this._supportedVersions;
    }

    static get NPC_DEFINITIONS() {
        const hasWindowDefinitions = typeof window !== 'undefined' && window.NPCDefinitions;
        if (!this._npcDefinitions || (hasWindowDefinitions && !this._npcDefinitions.length)) {
            if (hasWindowDefinitions) {
                this._npcDefinitions =
                    window.NPCDefinitions.definitions ||
                    window.NPCDefinitions.NPC_DEFINITIONS ||
                    [];
            } else if (!this._npcDefinitions) {
                this._npcDefinitions = [];
            }
        }
        return this._npcDefinitions || [];
    }
}

if (typeof window !== 'undefined') {
    window.ShareConstants = ShareConstants;
}
