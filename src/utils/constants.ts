// ============================================================
// CONSTANTES DEL JUEGO TETONOR
// ============================================================

import type { Difficulty, UserSettings } from '@/types/game';

/**
 * Configuración principal del juego
 */
export const GAME_CONFIG = {
  // ---- Rangos de números ----
  /** Valor mínimo para operandos */
  MIN_OPERAND: 1,
  /** Valor máximo para operandos */
  MAX_OPERAND: 50,

  // ---- Tamaños de grid ----
  /** Tamaño clásico (16 celdas = 8 pares) */
  CLASSIC_SIZE: 16,
  /** Tamaño pequeño (8 celdas = 4 pares) */
  SMALL_SIZE: 8,

  // ---- Pares por tamaño ----
  /** Pares para grid clásico */
  PAIRS_CLASSIC: 8,
  /** Pares para grid pequeño */
  PAIRS_SMALL: 4,

  // ---- Sistema de hints ----
  /** Máximo de hints por puzzle */
  MAX_HINTS: 3,

  // ---- Dificultad: porcentaje de strip oculto ----
  DIFFICULTY_HIDDEN: {
    easy: 0,
    medium: 0.25,
    hard: 0.5,
  } as Record<Difficulty, number>,

  // ---- Generador aleatorio con seed ----
  /** Multiplicador 1 para función seededRandom */
  SEED_MULT_1: 12.9898,
  /** Multiplicador 2 para función seededRandom */
  SEED_MULT_2: 43758.5453,

  // ---- Layout del grid ----
  /** Columnas en el grid clásico */
  GRID_COLUMNS: 4,
  /** Filas de pares en el grid clásico (cada par = 2 filas visuales) */
  GRID_PAIR_ROWS: 4,
} as const;

/**
 * Claves de LocalStorage
 */
export const STORAGE_KEYS = {
  /** Configuración del usuario */
  SETTINGS: 'tetonor_settings',
  /** Partida actual en progreso */
  CURRENT_GAME: 'tetonor_currentGame',
  /** Estadísticas acumuladas */
  STATS: 'tetonor_stats',
  /** Historial de partidas */
  HISTORY: 'tetonor_history',
} as const;

/**
 * Configuración por defecto del usuario
 */
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  soundEnabled: true,
  autocheckEnabled: true,
  highlightingEnabled: true,
  fontSize: 'normal',
};
