class ShareEncoder {
    static buildShareCode(gameData) {
        const roomCount = ShareConstants.WORLD_ROOM_COUNT;
        const groundMatrices = ShareMatrixCodec.collectGroundMatrices(gameData, roomCount);
        const overlayMatrices = ShareMatrixCodec.collectOverlayMatrices(gameData, roomCount);
        const start = ShareDataNormalizer.normalizeStart(gameData?.start ?? {});
        const sprites = ShareDataNormalizer.normalizeSprites(gameData?.sprites);
        const enemies = ShareDataNormalizer.normalizeEnemies(gameData?.enemies);
        const objects = Array.isArray(gameData?.objects) ? gameData.objects : [];
        const doorPositions = ShareDataNormalizer.normalizeObjectPositions(objects, 'door');
        const keyPositions = ShareDataNormalizer.normalizeObjectPositions(objects, 'key');
        const magicDoorEntries = ShareDataNormalizer.normalizeVariableDoorObjects(objects);
        const magicDoorPositions = magicDoorEntries.map((entry) => ({
            x: entry.x,
            y: entry.y,
            roomIndex: entry.roomIndex
        }));
        const magicDoorVariableNibbles = magicDoorEntries.map((entry) => entry.variableNibble ?? 0);
        const variables = Array.isArray(gameData?.variables) ? gameData.variables : [];
        const variableCode = ShareVariableCodec.encodeVariables(variables);

        const groundSegments = groundMatrices.map((matrix) => ShareMatrixCodec.encodeGround(matrix));
        const hasGround = groundSegments.some((segment) => Boolean(segment));

        const overlaySegments = [];
        let hasOverlay = false;
        for (let index = 0; index < roomCount; index++) {
            const { text, hasData } = ShareMatrixCodec.encodeOverlay(overlayMatrices[index] ?? []);
            overlaySegments.push(text);
            if (hasData) hasOverlay = true;
        }

        const parts = [];
        parts.push('v' + ShareConstants.VERSION.toString(36));
        if (hasGround) {
            parts.push('g' + groundSegments.join(','));
        }
        if (hasOverlay) {
            parts.push('o' + overlaySegments.join(','));
        }

        const defaultStart = ShareDataNormalizer.normalizeStart({});
        const needsStart = start.x !== defaultStart.x ||
            start.y !== defaultStart.y ||
            start.roomIndex !== defaultStart.roomIndex;
        if (needsStart) {
            const startCode = SharePositionCodec.encodePositions([start]);
            if (startCode) {
                parts.push('s' + startCode);
            }
        }

        if (sprites.length) {
            const positions = SharePositionCodec.encodePositions(sprites);
            const typeIndexes = SharePositionCodec.encodeNpcTypeIndexes(sprites);
            const spriteTexts = sprites.map((npc) => (typeof npc.text === 'string' ? npc.text : ''));
            const conditionalTexts = sprites.map((npc) => (typeof npc.conditionText === 'string' ? npc.conditionText : ''));
            const conditionIndexes = sprites.map((npc) => ShareVariableCodec.variableIdToNibble(npc.conditionVariableId));
            const rewardIndexes = sprites.map((npc) => ShareVariableCodec.variableIdToNibble(npc.rewardVariableId));
            const conditionalRewardIndexes = sprites.map((npc) => ShareVariableCodec.variableIdToNibble(npc.conditionalRewardVariableId));
            const needsNpcTexts = sprites.some((sprite, index) => {
                const def = ShareConstants.NPC_DEFINITIONS.find((entry) => entry.type === sprite.type);
                const fallback = def ? (def.defaultText || '') : '';
                return spriteTexts[index] !== fallback;
            });
            const hasConditionalTexts = conditionalTexts.some((text) => typeof text === 'string' && text.trim().length);
            const texts = needsNpcTexts ? ShareTextCodec.encodeTextArray(spriteTexts) : '';
            const conditionalTextCode = hasConditionalTexts ? ShareTextCodec.encodeTextArray(conditionalTexts) : '';
            const conditionCode = ShareVariableCodec.encodeVariableNibbleArray(conditionIndexes);
            const rewardCode = ShareVariableCodec.encodeVariableNibbleArray(rewardIndexes);
            const conditionalRewardCode = ShareVariableCodec.encodeVariableNibbleArray(conditionalRewardIndexes);
            if (positions) parts.push('p' + positions);
            if (typeIndexes) parts.push('i' + typeIndexes);
            if (texts) parts.push('t' + texts);
            if (conditionalTextCode) parts.push('u' + conditionalTextCode);
            if (conditionCode) parts.push('c' + conditionCode);
            if (rewardCode) parts.push('r' + rewardCode);
            if (conditionalRewardCode) parts.push('h' + conditionalRewardCode);
        }

        if (enemies.length) {
            const enemyPositions = SharePositionCodec.encodePositions(enemies);
            const enemyTypeIndexes = SharePositionCodec.encodeEnemyTypeIndexes(enemies);
            if (enemyPositions) {
                parts.push('e' + enemyPositions);
            }
            if (enemyTypeIndexes) {
                parts.push('f' + enemyTypeIndexes);
            }
        }

        if (doorPositions.length) {
            const doorCode = SharePositionCodec.encodePositions(doorPositions);
            if (doorCode) {
                parts.push('d' + doorCode);
            }
        }

        if (magicDoorPositions.length) {
            const magicDoorCode = SharePositionCodec.encodePositions(magicDoorPositions);
            if (magicDoorCode) {
                parts.push('m' + magicDoorCode);
            }
            const magicDoorVariableCode = ShareVariableCodec.encodeVariableNibbleArray(magicDoorVariableNibbles);
            if (magicDoorVariableCode) {
                parts.push('q' + magicDoorVariableCode);
            }
        }

        if (keyPositions.length) {
            const keyCode = SharePositionCodec.encodePositions(keyPositions);
            if (keyCode) {
                parts.push('k' + keyCode);
            }
        }

        if (variableCode) {
            parts.push('b' + variableCode);
        }

        const title = typeof gameData?.title === 'string' ? gameData.title.trim() : '';
        if (title && title !== ShareConstants.DEFAULT_TITLE) {
            parts.push('n' + ShareTextCodec.encodeText(title.slice(0, 80)));
        }

        return parts.join('.');
    }
}

if (typeof window !== 'undefined') {
    window.ShareEncoder = ShareEncoder;
}
