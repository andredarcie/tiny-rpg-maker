const PlayerSpriteMatrices = {
    default: [
        [ null, null,  1,  1,  1,  1, null, null ],
        [ null,  1, 15, 15, 15, 15,  1, null ],
        [  1,  6, 15, 12, 15, 12,  1, null ],
        [  1,  6, 15, 15, 15, 15,  1, null ],
        [  1,  9,  9,  4,  4,  9,  9,  1 ],
        [  1, 15,  9,  9,  9,  4, 15,  1 ],
        [ null,  1,  5,  5,  5,  5,  1, null ],
        [ null,  1,  5,  1,  1,  5,  1, null ]
    ]
};

if (typeof window !== 'undefined') {
    window.PlayerSpriteMatrices = PlayerSpriteMatrices;
}
