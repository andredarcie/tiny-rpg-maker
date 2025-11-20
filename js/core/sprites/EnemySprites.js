const EnemySpriteMatrices = {
    default: [
        [ null, null,  6, null, null, null,  6, null ],
        [ null, null,  6,  6,  6,  6,  6, null ],
        [ null, null,  6,  6,  8,  6,  8, null ],
        [ null, null,  6,  6,  6,  6,  6, null ],
        [ null, null,  1,  1,  6,  1,  1, null ],
        [ null, null,  6,  1,  1,  1,  6, null ],
        [ null, null, null,  1,  1,  1, null, null ],
        [ null, null, null,  6, null,  6, null, null ]
    ],
    'giant-rat': [
        [ null, null, null, 15, 15, null, 15, 15 ],
        [ 15, null, null, 15, 15, null, 15, 15 ],
        [ 15, null, null, 13, 13, 13, 13, 13 ],
        [ 15, null,  1, 13,  8, 13,  8, 13 ],
        [ null,  1,  1,  1, 13, 13, 13, null ],
        [ null,  1,  1,  1,  1, 15, null, null ],
        [ null,  1,  1,  1,  1, null, null, null ],
        [ null, 15, null, null, 15, null, null, null ]
    ],
    bandit: [
        [ null, 15, 15, 15, 15, null,  6, null ],
        [ null, 15,  8, 15,  8, null,  7, null ],
        [ null,  1,  1,  1,  1, null,  7, null ],
        [  5,  5,  1,  1,  1,  5,  6, null ],
        [  5,  5,  5,  1,  5, 13, 13, 13 ],
        [  1,  5,  5,  5,  5, null,  1, null ],
        [ null, 13, 13, 13, 13, null, null, null ],
        [ null, 13, null, null, 13, null, null, null ]
    ],
    'dark-knight': [
        [  1,  1,  1,  1,  1,  1,  1,  1 ],
        [  1,  5,  5,  5,  5,  1,  2,  1 ],
        [  1,  5,  8,  5,  8,  1,  2,  1 ],
        [  1,  5, 13,  5, 13,  5,  2,  1 ],
        [  1, 13,  5, 13,  5, 14, 14,  1 ],
        [  1,  5, 13,  5, 13,  1,  5,  1 ],
        [  1,  5,  1,  1,  5,  1,  1,  1 ],
        [  1,  1,  1,  1,  1,  1, null, null ]
    ],
    necromancer: [
        [ null, null, 15, 15, 15, 15, null,  8 ],
        [ null, null, 15,  8, 15,  8, null,  4 ],
        [ null, null, 15, 15, 15, 15, null,  4 ],
        [ null, null,  2,  2,  2,  2,  2,  2 ],
        [ null, null,  2,  2,  2,  2,  2,  4 ],
        [ null, null,  2,  2,  2,  2, null,  4 ],
        [ null,  2,  2,  2,  2,  2,  2,  4 ],
        [  2,  2,  2,  2,  2,  2,  2,  2 ]
    ],
    dragon: [
        [ null, null,  3, 11, 11, 11, 11, 11 ],
        [ null,  3, 11, 11, 11,  8, 11,  8 ],
        [ null,  3,  3, 11, 11, 11, 11, 11 ],
        [ null, null,  3,  3,  3,  7, null,  7 ],
        [ 11, null, null,  3, 11, null, null, null ],
        [ 11, null, 11, 11, 11,  3, null, null ],
        [ 11,  3,  3,  3, null,  3, null, null ],
        [ 11, 11, null, 11, null, null, null, null ]
    ],
    skeleton: [
        [ null, null,  7,  7,  7,  7, null, null ],
        [ null, null,  7,  8,  7,  8, null, null ],
        [ null, null,  7,  7,  7,  7, null, null ],
        [ null,  7, null,  7,  7, null,  7, null ],
        [ null,  7,  7,  7,  7,  7,  7, null ],
        [ null,  7, null,  7, null, null,  7, null ],
        [ null, null,  7,  7,  7,  7, null, null ],
        [ null, null,  7, null, null,  7, null, null ]
    ],
    'fallen-king': [
        [ null, 10, null, 10, null, 10, null, null ],
        [ null,  9,  9,  9,  9,  9, null, 10 ],
        [ null,  5, 15,  8, 15,  8, null,  9 ],
        [ null,  5,  5, 15, 15,  5, null,  9 ],
        [ null,  2,  7,  5,  5,  7, null,  9 ],
        [ null,  2,  2,  7,  2,  2,  2, 15 ],
        [  2,  2,  2,  7,  2,  2, null,  9 ],
        [  7,  7,  7,  7,  7,  7, null,  9 ]
    ],
    'ancient-demon': [
        [ null, null,  8, null, null,  8, null, null ],
        [ null, null,  8,  8,  8,  8, null, null ],
        [ null, null,  8,  0,  8,  0, null, null ],
        [ null,  8,  8,  8,  8,  8,  8, null ],
        [  8,  8,  8,  8,  8,  8,  8,  8 ],
        [  8, null,  8,  8,  8,  8, null,  8 ],
        [ null, null,  8,  8,  8,  8, null, null ],
        [ null, null,  8, null, null,  8, null, null ]
    ]
};

if (typeof window !== 'undefined') {
    window.EnemySpriteMatrices = EnemySpriteMatrices;
}
