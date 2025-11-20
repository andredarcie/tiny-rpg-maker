const NpcSpriteMatrices = {
    default: [
        [ null, null, null,  5,  5,  5, null, null ],
        [ null, null,  5,  5,  5,  5,  5, null ],
        [ null, null,  7,  1,  7,  1,  7, null ],
        [  5, null,  7,  7,  7,  7,  7, null ],
        [  5, null,  5,  5,  5,  5,  5, null ],
        [  5,  7,  6,  5,  5,  5,  6, null ],
        [  5, null,  6,  6,  5,  6,  6, null ],
        [  5, null,  6,  6,  6,  6,  6, null ]
    ],
    'old-mage': [
        [ null, null,  6,  6,  6,  6, null, null ],
        [  6, null, 15, 12, 15, 12, null, null ],
        [  6, null, 15, 15, 15, 15, null, null ],
        [ 15,  5,  5,  6,  6,  6,  5, null ],
        [  6, null,  5,  6,  6,  6, 15, null ],
        [  6, null,  5,  5,  6,  6, null, null ],
        [  6, null,  5,  5,  5,  5, null, null ],
        [  6, null,  5,  5,  5,  5, null, null ]
    ],
    'villager-man': [
        [ null, null, 15, 15, 15, 15, null, null ],
        [ null, null, 15, 12, 15, 12, null, null ],
        [ null, null, 15, 15, 15, 15, null, null ],
        [ null,  4,  4, 15, 15,  4,  4, null ],
        [ null, 15,  4,  4,  4,  4, 15, null ],
        [ null, null,  4,  4,  4,  4, null, null ],
        [ null, null,  9,  9,  9,  9, null, null ],
        [ null, null,  9, null, null,  9, null, null ]
    ],
    'villager-woman': [
        [ null, null,  4,  4,  4,  4, null, null ],
        [ null, null,  4, 12, 15, 12, null, null ],
        [ null, null,  4, 15, 15, 15, null, null ],
        [ null, 14,  4, 15, 15, 14, 14, null ],
        [ null, 15,  4, 14, 14, 14, 15, null ],
        [ null, null, 14, 14, 14, 14, null, null ],
        [ null, null, 14, 14, 14, 14, null, null ],
        [ null, null, 14, 14, 14, 14, null, null ]
    ],
    child: [
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, 15, 15, 15, 15, null, null ],
        [ null, null, 15, 12, 15, 12, null, null ],
        [ null, null, 15, 15, 15, 15, null, null ],
        [ null,  9,  9,  9,  9,  9,  9, null ],
        [ null, null,  9, null, null,  9, null, null ]
    ],
    'wooden-sign': [
        [ null, null, null, null, null, null, null, null ],
        [ null,  4,  4,  4,  4,  4,  4, null ],
        [ null,  4,  5,  5,  5,  5,  4, null ],
        [ null,  4,  4,  4,  4,  4,  4, null ],
        [ null,  4,  5,  5,  5,  4,  4, null ],
        [ null,  4,  4,  4,  4,  4,  4, null ],
        [ null,  4, null, null, null, null,  4, null ],
        [ null,  4, null, null, null, null,  4, null ]
    ]
};

if (typeof window !== 'undefined') {
    window.NpcSpriteMatrices = NpcSpriteMatrices;
}
