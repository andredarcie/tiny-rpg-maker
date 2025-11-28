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
        [ null,  1,  6,  6,  6,  6,  1, null ],
        [  1,  4, 15, 12, 15, 12,  1, null ],
        [  1,  4, 15, 15, 15, 15,  1, null ],
        [  1,  4,  5,  6,  6,  6,  5,  1 ],
        [  1, 15,  5,  6,  6,  6, 15,  1 ],
        [  1,  4,  5,  5,  6,  6,  1, null ],
        [  1,  4,  5,  5,  5,  5,  1, null ],
        [  1,  4,  5,  5,  5,  5,  1, null ]
    ],
    'villager-man': [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1, 15, 15, 15, 15,  1, null ],
        [ null,  1, 15, 12, 15, 12,  1, null ],
        [ null,  1, 15, 15, 15, 15,  1, null ],
        [  1,  4,  4,  4,  4,  4,  4,  1 ],
        [  1, 15,  4,  4,  4,  4, 15,  1 ],
        [ null,  1,  9,  9,  9,  9,  1, null ],
        [ null,  1,  9,  1,  1,  9,  1, null ]
    ],
    'villager-woman': [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1,  4,  4,  4,  4,  1, null ],
        [ null,  1,  4, 12, 15, 12,  1, null ],
        [ null,  1,  4, 15, 15, 15,  1, null ],
        [  1, 14,  4, 14, 14, 14, 14,  1 ],
        [  1, 15,  4, 14, 14, 14, 15,  1 ],
        [ null,  1, 14, 14, 14, 14,  1, null ],
        [ null,  1, 14, 14, 14, 14,  1, null ]
    ],
    'child': [
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1, 15, 15, 15, 15,  1, null ],
        [ null,  1, 15, 12, 15, 12,  1, null ],
        [ null,  9,  9,  9,  9,  9,  9, null ],
        [  1, 15,  9,  9,  9,  9, 15,  1 ],
        [ null,  1,  9,  1,  1,  9,  1, null ]
    ],
    'king': [
        [  1, 10,  1, 10,  1, 10,  1,  1 ],
        [  1,  9,  9,  9,  9,  9,  1, 10 ],
        [  1, 15, 15, 12, 15, 12,  1,  9 ],
        [  1, 15, 15, 15, 15, 15,  1,  9 ],
        [  1,  8,  7, 15, 15,  7,  1,  9 ],
        [  1,  8,  8,  7,  8,  8,  8, 15 ],
        [  1,  8,  8,  7,  8,  8,  1,  9 ],
        [  1,  7,  7,  7,  7,  7,  1,  9 ]
    ],
    'knight': [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1,  6,  6,  6,  6,  1, null ],
        [ null,  1,  6, 12, 15, 12,  1, null ],
        [ null,  1,  6,  6,  6,  6,  1, null ],
        [  1,  5,  5,  6,  6,  5,  5,  1 ],
        [  1,  6,  5,  5,  5,  5,  6,  1 ],
        [ null,  1,  6,  6,  6,  6,  1, null ],
        [ null,  1,  6,  1,  1,  6,  1, null ]
    ],
    'thief': [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1,  5,  5,  5,  5,  1, null ],
        [ null,  1,  5, 12, 15, 12,  1, null ],
        [ null,  1,  5,  5,  5,  5,  1, null ],
        [  1,  5,  5,  5,  5,  5,  5,  1 ],
        [  1, 15,  5,  5,  5,  5, 15,  1 ],
        [ null,  1, 13, 13, 13, 13,  1, null ],
        [ null,  1, 13,  1,  1, 13,  1, null ]
    ],
    'blacksmith': [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1, 15, 15, 15, 15,  1, null ],
        [ null,  1, 15, 12, 15, 12,  1, null ],
        [ null,  1, 15, 15, 15, 15,  1, null ],
        [  1,  6,  4,  6,  6,  4,  6,  1 ],
        [  1, 15,  4,  4,  4,  4, 15,  1 ],
        [ null,  1,  4,  4,  4,  4,  1, null ],
        [ null,  1,  5,  1,  1,  5,  1, null ]
    ],
    'wooden-sign': [
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [  1,  4,  4,  4,  4,  4,  4,  1 ],
        [  1,  4,  5,  5,  5,  5,  4,  1 ],
        [  1,  4,  4,  4,  4,  4,  4,  1 ],
        [  1,  4,  5,  5,  5,  4,  4,  1 ],
        [  1,  4,  4,  4,  4,  4,  4,  1 ],
        [  1,  4,  1,  1,  1,  1,  4,  1 ],
        [  1,  4,  1, null, null,  1,  4,  1 ]
    ],
    'thought-bubble': [
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [  1,  6,  6,  6,  6,  6,  6,  1 ],
        [  1,  6,  1,  1,  1,  1,  6,  1 ],
        [  1,  6,  6,  6,  6,  6,  6,  1 ],
        [  1,  6,  1,  1,  1,  6,  6,  1 ],
        [  1,  6,  6,  6,  6,  6,  6,  1 ],
        [ null,  1,  6,  6,  1,  1,  1, null ],
        [ null,  1,  6,  1, null, null, null, null ]
    ]
};

if (typeof window !== 'undefined') {
    window.NpcSpriteMatrices = NpcSpriteMatrices;
}
