// ============================================================
// GENERADOR DE PUZZLES TETONOR
// ============================================================

import type { Pair, PuzzleConfig, GridCell, PuzzleState } from '@/types/game';
import { GAME_CONFIG } from './constants';

// ============================================================
// GENERADOR ALEATORIO DETERMINÍSTICO
// ============================================================

/**
 * Genera un número pseudo-aleatorio entre 0 y 1 basado en un seed e índice.
 * La misma combinación de seed + index siempre produce el mismo resultado.
 */
export function seededRandom(seed: number, index: number): number {
  const x = Math.sin((seed + index) * GAME_CONFIG.SEED_MULT_1) * GAME_CONFIG.SEED_MULT_2;
  return x - Math.floor(x);
}

/**
 * Genera un número entero aleatorio en un rango [min, max] inclusive.
 */
function randomInRange(seed: number, index: number, min: number, max: number): number {
  return Math.floor(seededRandom(seed, index) * (max - min + 1)) + min;
}

/**
 * Mezcla un array usando el algoritmo Fisher-Yates con seed determinístico.
 */
function shuffleArray<T>(array: T[], seed: number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed, i * 100) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================================
// GENERACIÓN DE PARES
// ============================================================

/**
 * Genera pares únicos de operandos.
 * Cada par tiene dos números (a, b) donde a <= b, y sus resultados sum y product.
 */
export function generatePairs(seed: number, count: number): Pair[] {
  const pairs: Pair[] = [];
  const usedPairs = new Set<string>();
  const usedResults = new Set<string>();
  let index = 0;
  let attempts = 0;
  const maxAttempts = 10000;

  while (pairs.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Generar dos números aleatorios
    const num1 = randomInRange(seed, index++, GAME_CONFIG.MIN_OPERAND, GAME_CONFIG.MAX_OPERAND);
    const num2 = randomInRange(seed, index++, GAME_CONFIG.MIN_OPERAND, GAME_CONFIG.MAX_OPERAND);
    
    // Ordenar para consistencia (a <= b)
    const [a, b] = num1 <= num2 ? [num1, num2] : [num2, num1];
    const pairKey = `${a}-${b}`;
    
    // Calcular resultados
    const sum = a + b;
    const product = a * b;
    
    // Crear clave única para la combinación de resultados
    const resultKey = `${sum}:${product}`;
    
    // Verificar unicidad del par y que los resultados no sean idénticos
    if (!usedPairs.has(pairKey) && !usedResults.has(resultKey) && sum !== product) {
      usedPairs.add(pairKey);
      usedResults.add(resultKey);
      
      pairs.push({ a, b, sum, product });
    }
  }

  if (pairs.length < count) {
    console.warn(`Solo se pudieron generar ${pairs.length} de ${count} pares únicos`);
  }

  return pairs;
}

// ============================================================
// GENERACIÓN DEL GRID
// ============================================================

/**
 * Genera el grid de celdas a partir de los pares.
 * Cada par produce 2 celdas: una para suma y una para producto.
 * Las celdas se mezclan aleatoriamente.
 */
function generateGrid(pairs: Pair[], seed: number): GridCell[] {
  const cells: GridCell[] = [];

  // Crear una celda para suma y otra para producto de cada par
  pairs.forEach((pair, pairIndex) => {
    cells.push({
      pairIndex,
      operation: 'sum',
      value: pair.sum,
      userInput: null,
      isCorrect: null,
      isRevealed: false,
    });
    cells.push({
      pairIndex,
      operation: 'product',
      value: pair.product,
      userInput: null,
      isCorrect: null,
      isRevealed: false,
    });
  });

  // Mezclar las celdas para que no estén en orden predecible
  return shuffleArray(cells, seed + 12345);
}

// ============================================================
// GENERACIÓN DEL NUMBER STRIP
// ============================================================

/**
 * Genera el number strip (tira de operandos).
 */
function generateStrip(
  pairs: Pair[],
  difficulty: PuzzleConfig['difficulty'],
  seed: number
): {
  strip: (number | null)[];
  stripSolution: number[];
} {
  // Extraer todos los operandos
  const allOperands: number[] = [];
  pairs.forEach(pair => {
    allOperands.push(pair.a, pair.b);
  });

  // Ordenar en orden ascendente (esto es la solución)
  const stripSolution = [...allOperands].sort((a, b) => a - b);

  // Determinar cuántos números ocultar según dificultad
  const hiddenRatio = GAME_CONFIG.DIFFICULTY_HIDDEN[difficulty];
  const hiddenCount = Math.floor(stripSolution.length * hiddenRatio);

  if (hiddenCount === 0) {
    // Easy mode: todo visible
    return { strip: [...stripSolution], stripSolution };
  }

  // Elegir posiciones aleatorias para ocultar
  const positions = Array.from({ length: stripSolution.length }, (_, i) => i);
  const shuffledPositions = shuffleArray(positions, seed + 54321);
  const hiddenPositions = new Set(shuffledPositions.slice(0, hiddenCount));

  // Crear strip con nulls en posiciones ocultas
  const strip = stripSolution.map((num, i) =>
    hiddenPositions.has(i) ? null : num
  );

  return { strip, stripSolution };
}

// ============================================================
// FUNCIÓN PRINCIPAL: GENERAR PUZZLE COMPLETO
// ============================================================

/**
 * Genera un puzzle completo listo para jugar.
 */
export function generatePuzzle(config: PuzzleConfig): PuzzleState {
  // Determinar número de pares según tamaño
  const pairCount = config.size === GAME_CONFIG.CLASSIC_SIZE
    ? GAME_CONFIG.PAIRS_CLASSIC
    : GAME_CONFIG.PAIRS_SMALL;

  // Generar componentes del puzzle
  const pairs = generatePairs(config.seed, pairCount);
  const grid = generateGrid(pairs, config.seed);
  const { strip, stripSolution } = generateStrip(pairs, config.difficulty, config.seed);

  // Crear estado inicial del puzzle
  return {
    // Datos del puzzle
    pairs,
    grid,
    strip,
    stripSolution,
    stripUserInput: strip.map(val => (val === null ? null : val)),

    // Estado de UI
    selectedCellIndex: null,
    selectedStripIndex: null,
    paused: false,
    completed: false,
    hintsUsed: 0,
    hintsRemaining: GAME_CONFIG.MAX_HINTS,

    // Historial vacío
    history: [],
    historyIndex: -1,
  };
}

/**
 * Genera un seed basado en la fecha actual.
 */
export function getDailySeed(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`, 10);
}

/**
 * Genera un seed aleatorio para práctica.
 */
export function getRandomSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Genera un ID único para el puzzle basado en su configuración.
 */
export function generatePuzzleId(config: PuzzleConfig, mode: 'practice' | 'daily' | 'timed'): string {
  const date = new Date().toISOString().split('T')[0];
  return `${date}-${mode}-${config.difficulty}-${config.size}-${config.seed}`;
}
