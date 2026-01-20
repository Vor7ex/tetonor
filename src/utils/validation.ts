// ============================================================
// VALIDACIÓN DE PUZZLES TETONOR
// ============================================================

import type { GridCell, Pair, PuzzleState } from '@/types/game';

/**
 * Valida si el input del usuario en una celda es correcto.
 */
export function validateCell(cell: GridCell, pairs: Pair[]): boolean {
  if (cell.userInput === null) {
    return false;
  }

  const pair = pairs[cell.pairIndex];
  if (!pair) {
    return false;
  }

  const expectedValue = cell.operation === 'sum' ? pair.sum : pair.product;
  return cell.userInput === expectedValue;
}

/**
 * Valida una celda y retorna el estado de validación detallado.
 */
export function getCellValidationState(
  cell: GridCell,
  pairs: Pair[]
): 'empty' | 'correct' | 'incorrect' {
  if (cell.userInput === null) {
    return 'empty';
  }
  return validateCell(cell, pairs) ? 'correct' : 'incorrect';
}

/**
 * Verifica que el strip mantenga orden ascendente.
 */
export function validateStripOrder(strip: (number | null)[]): boolean {
  let previousValue = -Infinity;

  for (const num of strip) {
    if (num !== null) {
      if (num < previousValue) {
        return false;
      }
      previousValue = num;
    }
  }

  return true;
}

/**
 * Valida que el strip del usuario coincida con la solución.
 */
export function validateStrip(
  userStrip: (number | null)[],
  solution: number[]
): boolean {
  if (userStrip.length !== solution.length) {
    return false;
  }

  return userStrip.every((val, i) => val === null || val === solution[i]);
}

/**
 * Valida un valor específico en el strip.
 */
export function validateStripValue(
  index: number,
  value: number,
  solution: number[]
): boolean {
  if (index < 0 || index >= solution.length) {
    return false;
  }
  return value === solution[index];
}

/**
 * Verifica si todas las celdas del grid tienen un valor ingresado.
 */
export function isGridComplete(grid: GridCell[]): boolean {
  return grid.every(cell => cell.userInput !== null);
}

/**
 * Verifica si todas las posiciones del strip tienen un valor.
 */
export function isStripComplete(strip: (number | null)[]): boolean {
  return strip.every(val => val !== null);
}

/**
 * Verifica si el puzzle está completamente resuelto y correcto.
 */
export function isPuzzleSolved(state: PuzzleState): boolean {
  // 1. Verificar que todas las celdas del grid estén llenas y correctas
  const allCellsCorrect = state.grid.every(cell => {
    if (cell.userInput === null) {
      return false;
    }
    const pair = state.pairs[cell.pairIndex];
    const expected = cell.operation === 'sum' ? pair.sum : pair.product;
    return cell.userInput === expected;
  });

  if (!allCellsCorrect) {
    return false;
  }

  // 2. Verificar que el strip esté completo y correcto
  const stripComplete = state.stripUserInput.every(
    (val, i) => val === state.stripSolution[i]
  );

  return stripComplete;
}

/**
 * Encuentra todas las celdas con valores incorrectos.
 */
export function findGridConflicts(grid: GridCell[], pairs: Pair[]): number[] {
  const conflicts: number[] = [];

  grid.forEach((cell, index) => {
    if (cell.userInput !== null && !validateCell(cell, pairs)) {
      conflicts.push(index);
    }
  });

  return conflicts;
}

/**
 * Encuentra las posiciones del strip con valores incorrectos.
 */
export function findStripConflicts(
  userStrip: (number | null)[],
  solution: number[]
): number[] {
  const conflicts: number[] = [];

  userStrip.forEach((val, index) => {
    if (val !== null && val !== solution[index]) {
      conflicts.push(index);
    }
  });

  return conflicts;
}

/**
 * Calcula el progreso del puzzle (0-100%).
 */
export function calculateProgress(state: PuzzleState): number {
  const totalCells = state.grid.length;
  const filledCells = state.grid.filter(cell => cell.userInput !== null).length;

  const totalStrip = state.stripSolution.length;
  const filledStrip = state.stripUserInput.filter(val => val !== null).length;

  const total = totalCells + totalStrip;
  const filled = filledCells + filledStrip;

  return Math.round((filled / total) * 100);
}

/**
 * Verifica si un valor dado podría ser válido para una celda.
 */
export function isValidCellValue(value: number): boolean {
  return Number.isInteger(value) && value >= 2 && value <= 2500;
}

/**
 * Verifica si un valor es válido para el strip.
 */
export function isValidStripValue(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 50;
}
