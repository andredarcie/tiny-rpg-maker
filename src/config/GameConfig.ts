/**
 * Centralized game configuration
 *
 * This file contains all constants and configurable values for the game runtime.
 * Configurations are organized by category for easier maintenance.
 */

export const GameConfig = {
  /**
   * Canvas and rendering configuration
   */
  canvas: {
    /** Game canvas width in pixels */
    width: 128,
    /** Game canvas height in pixels */
    height: 152,
    /** Minimum tile size in pixels */
    minTileSize: 8,
    /** Minimum HUD bar height in pixels */
    minHudHeight: 28,
    /** HUD height multiplier relative to tile size */
    hudHeightMultiplier: 1.75,
    /** Minimum inventory bar height in pixels */
    minInventoryHeight: 40,
    /** Inventory height multiplier relative to tile size */
    inventoryHeightMultiplier: 2,
  },

  /**
   * World and room configuration
   */
  world: {
    /** Number of rows in the world grid */
    rows: 3,
    /** Number of columns in the world grid */
    cols: 3,
    /** Size of each room (tiles per side) */
    roomSize: 8,
    /** Tile matrix size (tiles x tiles per room) */
    matrixSize: 8,
  },

  /**
   * Player configuration
   */
  player: {
    /** Starting X position */
    startX: 1,
    /** Starting Y position */
    startY: 1,
    /** Starting room index */
    startRoomIndex: 0,
    /** Starting level */
    startLevel: 1,
    /** Maximum achievable level */
    maxLevel: 10,
    /** Base maximum lives at start */
    baseMaxLives: 3,
    /** Starting lives */
    startLives: 3,
    /** Base experience required to level up */
    experienceBase: 6,
    /** XP growth multiplier per level */
    experienceGrowth: 1.35,
    /** Maximum number of keys that can be carried */
    maxKeys: 9,
    /** Damage cooldown time after room change (ms) */
    roomChangeDamageCooldown: 1000,
  },

  /**
   * Enemy configuration
   */
  enemy: {
    /** Enemy movement interval (ms) */
    movementInterval: 600,
    /** Default attack miss chance (0.0 - 1.0) */
    fallbackMissChance: 0.25,
    /** Stealth assassination miss chance (0.0 - 1.0) */
    stealthMissChance: 0.25,
  },

  /**
   * Animation and visual effects configuration
   */
  animation: {
    /** Tile animation interval (ms) */
    tileInterval: 320,
    /** Minimum animation interval (ms) */
    minInterval: 60,
    /** Duration of icon over player (ms) */
    iconOverPlayerDuration: 2000,
    /** Frame rate for overlays (FPS) */
    overlayFPS: 30,
    /** Blink interval in overlays (ms) */
    blinkInterval: 500,
    /** Minimum blink opacity (0.0 - 1.0) */
    blinkMinOpacity: 0.3,
    /** Maximum blink opacity (0.0 - 1.0) */
    blinkMaxOpacity: 0.95,
  },

  /**
   * Visual effects configuration
   */
  effects: {
    /** Default combat indicator duration (ms) */
    combatIndicatorDuration: 600,
    /** Minimum screen flash duration (ms) */
    screenFlashMinDuration: 16,
    /** Default screen flash duration (ms) */
    screenFlashDuration: 140,
    /** Minimum edge flash duration (ms) */
    edgeFlashMinDuration: 32,
    /** Default edge flash duration (ms) */
    edgeFlashDuration: 220,
  },

  /**
   * Transitions configuration
   */
  transitions: {
    /** Minimum room transition duration (ms) */
    roomMinDuration: 120,
    /** Default room transition duration (ms) */
    roomDuration: 320,
    /** Blocked movement duration (edge flash) (ms) */
    blockedMovementDuration: 240,
  },

  /**
   * Screen timing configuration
   */
  timing: {
    /** Time to reset after intro screen (ms) */
    resetAfterIntro: 2000,
    /** Time to reset after game over (ms) */
    resetAfterGameOver: 2000,
    /** Level-up celebration duration (ms) */
    levelUpCelebration: 3000,
    /** Minimum celebration duration (ms) */
    celebrationMinDuration: 300,
    /** Maximum celebration duration (ms) */
    celebrationMaxDuration: 3000,
  },

  /**
   * Input configuration
   */
  input: {
    /** Maximum input duration (ms) */
    maxDuration: 600,
  },

  /**
   * HUD configuration
   */
  hud: {
    /** HUD internal padding (pixels) */
    padding: 4,
    /** Spacing between HUD elements (pixels) */
    gap: 6,
    /** HUD background color */
    backgroundColor: '#000000',
  },

  /**
   * Tiles configuration
   */
  tiles: {
    /** Maximum tile value in legacy format */
    legacyMax: 15,
    /** Maximum tile value */
    valueMax: 255,
  },

  /**
   * Default color palette (PICO-8 style)
   */
  palette: {
    /** Array of 16 colors in hexadecimal format */
    colors: [
      '#000000', // 0 - Black
      '#1D2B53', // 1 - Dark blue
      '#7E2553', // 2 - Dark purple
      '#008751', // 3 - Dark green
      '#AB5236', // 4 - Brown
      '#5F574F', // 5 - Dark gray
      '#C2C3C7', // 6 - Light gray
      '#FFF1E8', // 7 - White
      '#FF004D', // 8 - Red
      '#FFA300', // 9 - Orange
      '#FFFF27', // 10 - Yellow
      '#00E756', // 11 - Green
      '#29ADFF', // 12 - Blue
      '#83769C', // 13 - Indigo
      '#FF77A8', // 14 - Pink
      '#FFCCAA', // 15 - Peach
    ] as const,
  },
} as const;

/**
 * Type helper to access configuration values with type safety
 */
export type GameConfigType = typeof GameConfig;
