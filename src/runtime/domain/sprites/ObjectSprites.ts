type SpriteMatrix = (number | null)[][];

const ObjectSpriteMatrices: Record<string, SpriteMatrix> = {
    'player-start': [
        [ null, null, null, null, null, null, null, null ],
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [ null,  1,  3,  3,  3,  3,  1, null ],
        [ null,  1,  3,  3, 11,  3,  1, null ],
        [ null,  1,  3, 11,  3,  3,  1, null ],
        [ null,  1,  3,  3,  3,  3,  1, null ],
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [ null, null, null, null, null, null, null, null ]
    ],
    'player-end': [
        [ null, null, null, null, null, null, null, null ],
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [ null,  1,  2,  2,  2,  2,  1, null ],
        [ null,  1,  2,  2, 14,  2,  1, null ],
        [ null,  1,  2, 14,  2,  2,  1, null ],
        [ null,  1,  2,  2,  2,  2,  1, null ],
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [ null, null, null, null, null, null, null, null ]
    ],
    switch: [
        [ null, null, null, null, null, null, null, null ],
        [  8, null, null, null, null, null, null, null ],
        [ null,  6, null, null, null, null, null, null ],
        [ null, null,  6, null, null, null, null, null ],
        [ null, null, null,  6, null, null, null, null ],
        [ null, null,  6,  1,  1,  6, null, null ],
        [ null,  6,  6,  6,  6,  6,  6, null ],
        [ null, null, null, null, null, null, null, null ]
    ],
    'switch--on': [
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, 12 ],
        [ null, null, null, null, null, null,  6, null ],
        [ null, null, null, null, null,  6, null, null ],
        [ null, null, null, null,  6, null, null, null ],
        [ null, null,  6,  1,  1,  6, null, null ],
        [ null,  6,  6,  6,  6,  6,  6, null ],
        [ null, null, null, null, null, null, null, null ]
    ],
    key: [
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ],
        [ 10, 10,  7, null, null, null, null, null ],
        [ 10, null, 10, 10, 10, 10, 10, 10 ],
        [  9,  9,  9, null, null,  9, null,  9 ],
        [ null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null ]
    ],
    door: [
        [ null,  4,  4,  4,  4,  4,  4, null ],
        [  4,  9,  9,  9,  9,  9,  9,  4 ],
        [  4,  9,  9,  9,  9,  9,  9,  4 ],
        [  4,  9,  9,  9,  0,  0,  9,  4 ],
        [  4,  9,  9,  9,  0,  0,  9,  4 ],
        [  4,  9,  9,  9,  9,  0,  9,  4 ],
        [  4,  9,  9,  9,  9,  9,  9,  4 ],
        [  4,  9,  9,  9,  9,  9,  9,  4 ]
    ],
    'door-variable': [
        [ null,  7, null,  7, null,  7, null,  7 ],
        [ null,  6,  6,  6,  6,  6,  6,  6 ],
        [ null,  6, 13,  6, 13,  6, 13,  6 ],
        [ null,  6, null,  6, null,  6, null,  6 ],
        [ null,  6, null,  6, null,  6, null,  5 ],
        [ null,  6,  6,  6,  6,  6,  6,  6 ],
        [ null,  6, 13,  6, 13,  6, 13,  6 ],
        [ null,  6, null,  6, null,  6, null,  6 ]
    ],
    'life-potion': [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1,  1,  1,  1,  1,  1, null ],
        [ null, null,  6, null, null,  6, null, null ],
        [ null, null,  6,  8,  8,  6, null, null ],
        [ null,  6,  8,  8,  8,  8,  6, null ],
        [  6,  8,  8,  8,  6,  8,  8,  6 ],
        [ null,  6,  8,  6,  8,  8,  6, null ],
        [ null, null,  6,  6,  6,  6, null, null ]
    ],
    'xp-scroll': [
        [ null, null, null, null, null, null, null, null ],
        [ null, null,  6,  6,  6,  6,  6,  6 ],
        [ null, null,  6,  1,  1,  1,  6,  0 ],
        [ null, null,  6,  6,  6,  6,  6, null ],
        [ null, null,  6,  1,  1,  1,  6, null ],
        [ null, null,  6,  6,  6,  6,  6, null ],
        [ null,  0,  6,  1,  1,  6,  6, null ],
        [ null,  6,  6,  6,  6,  6,  6, null ]
    ],
    sword: [
        [ null, null, null, null, null, null, null, null ],
        [  6,  6, null, null, null, null, null, null ],
        [  6,  6,  6, null, null, null, null, null ],
        [ null,  6,  6,  6, null, null, null, null ],
        [ null, null,  6,  6,  6, null,  1, null ],
        [ null, null, null,  6,  8,  1,  1, null ],
        [ null, null, null, null,  1,  1, null, null ],
        [ null, null, null,  1,  1, null,  1, null ]
    ],
    'sword-bronze': [
        [ null, null, null, null, null, null, null, null ],
        [  9,  9, null, null, null, null, null, null ],
        [  9, 10,  9, null, null, null, null, null ],
        [ null,  9,  9, 10, null, null, null, null ],
        [ null, null,  9,  9, 10, null,  1, null ],
        [ null, null, null,  9,  9,  1,  1, null ],
        [ null, null, null, null,  1,  1, null, null ],
        [ null, null, null,  1,  1, null,  1, null ]
    ],
    'sword-wood': [
        [ null, null, null, null, null, null, null, null ],
        [  4,  4, null, null, null, null, null, null ],
        [  4,  5,  4, null, null, null, null, null ],
        [ null,  4,  4,  5, null, null, null, null ],
        [ null, null,  4,  4,  5, null,  1, null ],
        [ null, null, null,  4,  9,  1,  1, null ],
        [ null, null, null, null,  1,  1, null, null ],
        [ null, null, null,  1,  1, null,  1, null ]
    ]
};

export { ObjectSpriteMatrices };
