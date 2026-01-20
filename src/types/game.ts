// ============================================================
// TIPOS DEL JUEGO TETONOR
// ============================================================

/**
 * Niveles de dificultad del juego
 * - easy: Strip completo visible
 * - medium: ~25% del strip oculto
 * - hard: ~50% del strip oculto
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Modos de juego disponibles
 * - practice: Juego libre sin límites
 * - daily: Puzzle del día (mismo para todos)
 * - timed: Contra reloj
 */
export type GameMode = 'practice' | 'daily' | 'timed';

/**
 * Tamaños de grid soportados
 * - 8: Variante pequeña (4 pares)
 * - 16: Variante clásica (8 pares)
 */
export type GridSize = 8 | 16;

/**
 * Tipos de operación matemática
 */
export type OperationType = 'sum' | 'product';

/**
 * Representa un par de operandos con sus resultados
 */
export interface Pair {
  /** Primer operando (siempre <= b) */
  a: number;
  /** Segundo operando */
  b: number;
  /** Resultado de la suma: a + b */
  sum: number;
  /** Resultado del producto: a × b */
  product: number;
}

/**
 * Representa una celda del grid principal
 */
export interface GridCell {
  /** Índice del par al que pertenece esta celda (usado para hints) */
  pairIndex: number;
  /** El valor resultado que se muestra (fijo, visible) */
  value: number;
  /** Primer operando ingresado por el usuario */
  userOperandA: number | null;
  /** Segundo operando ingresado por el usuario */
  userOperandB: number | null;
  /** Operador elegido por el usuario (null = no elegido aún) */
  userOperation: OperationType | null;
  /** Estado de validación: null=no validado, true=correcto, false=incorrecto */
  isCorrect: boolean | null;
  /** Si esta celda fue revelada por un hint */
  isRevealed: boolean;
}

/**
 * Estado completo del puzzle
 */
export interface PuzzleState {
  // ---- Datos del puzzle ----
  /** Los pares de operandos (4 u 8 según tamaño) */
  pairs: Pair[];
  /** Las celdas del grid (8 o 16) */
  grid: GridCell[];
  /** Números del strip visibles (null = oculto por dificultad) */
  strip: (number | null)[];
  /** Solución completa del strip */
  stripSolution: number[];
  /** Input del usuario para posiciones ocultas del strip */
  stripUserInput: (number | null)[];

  // ---- Estado de UI ----
  /** Índice de la celda seleccionada (null si ninguna) */
  selectedCellIndex: number | null;
  /** Cuál operando está seleccionado ('A', 'B', o null) */
  selectedOperand: 'A' | 'B' | null;
  /** Índice del strip seleccionado para editar (null si ninguno) */
  selectedStripIndex: number | null;
  /** Si el juego está pausado */
  paused: boolean;
  /** Si el puzzle ha sido completado correctamente */
  completed: boolean;
  /** Número de hints usados */
  hintsUsed: number;
  /** Hints restantes */
  hintsRemaining: number;

  // ---- Historial para undo/redo ----
  /** Stack de estados anteriores */
  history: HistoryEntry[];
  /** Índice actual en el historial (-1 = estado inicial) */
  historyIndex: number;
}

/**
 * Entrada del historial para undo/redo
 */
export interface HistoryEntry {
  /** Copia del grid en ese momento */
  grid: GridCell[];
  /** Copia del strip user input en ese momento */
  stripUserInput: (number | null)[];
}

/**
 * Sesión de juego (para estadísticas y persistencia)
 */
export interface GameSession {
  /** ID único del puzzle */
  puzzleId: string;
  /** Seed usado para generar el puzzle */
  seed: number;
  /** Dificultad seleccionada */
  difficulty: Difficulty;
  /** Tamaño del grid */
  size: GridSize;
  /** Modo de juego */
  mode: GameMode;
  /** Timestamp de inicio */
  startTime: number;
  /** Tiempo transcurrido en segundos */
  elapsedTime: number;
  /** Timestamp de completación (si aplica) */
  completedTime?: number;
  /** Si el puzzle fue completado */
  completed: boolean;
  /** Hints usados en esta sesión */
  hintsUsed: number;
}

/**
 * Configuración para generar un puzzle
 */
export interface PuzzleConfig {
  /** Seed para generación determinística */
  seed: number;
  /** Nivel de dificultad */
  difficulty: Difficulty;
  /** Tamaño del grid */
  size: GridSize;
}

/**
 * Configuración de usuario (persistida en LocalStorage)
 */
export interface UserSettings {
  /** Tema visual */
  theme: 'light' | 'dark';
  /** Efectos de sonido habilitados */
  soundEnabled: boolean;
  /** Validación automática al ingresar */
  autocheckEnabled: boolean;
  /** Resaltado de celdas relacionadas */
  highlightingEnabled: boolean;
  /** Tamaño de fuente */
  fontSize: 'small' | 'normal' | 'large';
}

/**
 * Estadísticas del jugador
 */
export interface PlayerStats {
  /** Total de puzzles completados */
  totalCompleted: number;
  /** Total de puzzles intentados */
  totalAttempted: number;
  /** Tiempo promedio de completación (segundos) */
  avgCompletionTime: number;
  /** Estadísticas por dificultad */
  byDifficulty: {
    easy: { completed: number; avgTime: number };
    medium: { completed: number; avgTime: number };
    hard: { completed: number; avgTime: number };
  };
}

/**
 * Registro de un juego completado (para historial)
 */
export interface GameRecord {
  /** ID único del puzzle */
  id: string;
  /** Fecha del juego (ISO string) */
  date: string;
  /** Modo de juego */
  mode: GameMode;
  /** Dificultad */
  difficulty: Difficulty;
  /** Tamaño del grid */
  size: GridSize;
  /** Tiempo de completación en segundos */
  completionTime: number;
  /** Hints usados */
  hintsUsed: number;
  /** Si fue completado exitosamente */
  completed: boolean;
}
