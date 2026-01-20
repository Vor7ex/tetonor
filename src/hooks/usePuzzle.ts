// ============================================================
// HOOK usePuzzle - GESTIÓN DEL ESTADO DEL PUZZLE
// ============================================================

import { useState, useCallback, useMemo } from 'react';
import type { PuzzleState, PuzzleConfig, GridCell, HistoryEntry, OperationType } from '@/types/game';
import { generatePuzzle } from '@/utils/puzzleGenerator';
import { validateCell, isPuzzleSolved } from '@/utils/validation';

// ============================================================
// TIPOS DEL HOOK
// ============================================================

export interface UsePuzzleActions {
  selectCell: (index: number | null) => void;
  selectOperandA: (cellIndex: number) => void;
  selectOperandB: (cellIndex: number) => void;
  selectStripPosition: (index: number | null) => void;
  enterOperandA: (value: number) => void;
  enterOperandB: (value: number) => void;
  enterStripNumber: (value: number) => void;
  toggleOperation: () => void;
  clearCell: () => void;
  clearStripPosition: () => void;
  undo: () => void;
  redo: () => void;
  useHint: () => void;
  togglePause: () => void;
  reset: () => void;
  newPuzzle: (config: PuzzleConfig) => void;
}

export interface UsePuzzleComputed {
  canUndo: boolean;
  canRedo: boolean;
  progress: number;
}

export interface UsePuzzleReturn {
  state: PuzzleState;
  actions: UsePuzzleActions;
  computed: UsePuzzleComputed;
  config: PuzzleConfig;
}

// ============================================================
// HOOK PRINCIPAL
// ============================================================

export function usePuzzle(initialConfig: PuzzleConfig): UsePuzzleReturn {
  const [state, setState] = useState<PuzzleState>(() => generatePuzzle(initialConfig));
  const [config, setConfig] = useState<PuzzleConfig>(initialConfig);

  const saveToHistory = useCallback((currentState: PuzzleState): HistoryEntry => ({
    grid: currentState.grid.map(cell => ({ ...cell })),
    stripUserInput: [...currentState.stripUserInput],
  }), []);

  const applyHistoryEntry = useCallback((entry: HistoryEntry, currentState: PuzzleState): PuzzleState => ({
    ...currentState,
    grid: entry.grid.map(cell => ({ ...cell })),
    stripUserInput: [...entry.stripUserInput],
  }), []);

  const selectCell = useCallback((index: number | null) => {
    setState(prev => ({
      ...prev,
      selectedCellIndex: index,
      selectedOperand: null,
      selectedStripIndex: null,
    }));
  }, []);

  const selectOperandA = useCallback((cellIndex: number) => {
    setState(prev => ({
      ...prev,
      selectedCellIndex: cellIndex,
      selectedOperand: 'A' as const,
      selectedStripIndex: null,
    }));
  }, []);

  const selectOperandB = useCallback((cellIndex: number) => {
    setState(prev => ({
      ...prev,
      selectedCellIndex: cellIndex,
      selectedOperand: 'B' as const,
      selectedStripIndex: null,
    }));
  }, []);

  const selectStripPosition = useCallback((index: number | null) => {
    setState(prev => ({
      ...prev,
      selectedStripIndex: index,
      selectedCellIndex: null,
      selectedOperand: null,
    }));
  }, []);

  const enterOperandA = useCallback((value: number) => {
    setState(prev => {
      if (prev.selectedCellIndex === null || prev.paused || prev.completed) {
        return prev;
      }

      // Validar rango
      if (value < 1 || value > 50) {
        return prev;
      }

      const historyEntry = saveToHistory(prev);

      const newGrid = prev.grid.map((cell, i) => {
        if (i === prev.selectedCellIndex) {
          const updatedCell: GridCell = {
            ...cell,
            userOperandA: value,
            isCorrect: null,
          };
          updatedCell.isCorrect = validateCell(updatedCell, prev.pairs);
          return updatedCell;
        }
        return cell;
      });

      const newState: PuzzleState = {
        ...prev,
        grid: newGrid,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };

      if (isPuzzleSolved(newState)) {
        newState.completed = true;
      }

      return newState;
    });
  }, [saveToHistory]);

  const enterOperandB = useCallback((value: number) => {
    setState(prev => {
      if (prev.selectedCellIndex === null || prev.paused || prev.completed) {
        return prev;
      }

      // Validar rango
      if (value < 1 || value > 50) {
        return prev;
      }

      const historyEntry = saveToHistory(prev);

      const newGrid = prev.grid.map((cell, i) => {
        if (i === prev.selectedCellIndex) {
          const updatedCell: GridCell = {
            ...cell,
            userOperandB: value,
            isCorrect: null,
          };
          updatedCell.isCorrect = validateCell(updatedCell, prev.pairs);
          return updatedCell;
        }
        return cell;
      });

      const newState: PuzzleState = {
        ...prev,
        grid: newGrid,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };

      if (isPuzzleSolved(newState)) {
        newState.completed = true;
      }

      return newState;
    });
  }, [saveToHistory]);

  const toggleOperation = useCallback(() => {
    setState(prev => {
      if (prev.selectedCellIndex === null || prev.paused || prev.completed) {
        return prev;
      }

      const cell = prev.grid[prev.selectedCellIndex];
      let newOperation: OperationType | null;

      // Ciclar: null → sum → product → null
      if (cell.userOperation === null) {
        newOperation = 'sum';
      } else if (cell.userOperation === 'sum') {
        newOperation = 'product';
      } else {
        newOperation = null;
      }

      const historyEntry = saveToHistory(prev);

      const newGrid = prev.grid.map((c, i) => {
        if (i === prev.selectedCellIndex) {
          const updatedCell: GridCell = {
            ...c,
            userOperation: newOperation,
            isCorrect: null,
          };
          updatedCell.isCorrect = validateCell(updatedCell, prev.pairs);
          return updatedCell;
        }
        return c;
      });

      const newState: PuzzleState = {
        ...prev,
        grid: newGrid,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };

      if (isPuzzleSolved(newState)) {
        newState.completed = true;
      }

      return newState;
    });
  }, [saveToHistory]);

  const enterStripNumber = useCallback((value: number) => {
    setState(prev => {
      if (prev.selectedStripIndex === null || prev.paused || prev.completed) {
        return prev;
      }

      if (prev.strip[prev.selectedStripIndex] !== null) {
        return prev;
      }

      const historyEntry = saveToHistory(prev);

      const newStripUserInput = [...prev.stripUserInput];
      newStripUserInput[prev.selectedStripIndex] = value;

      const newState: PuzzleState = {
        ...prev,
        stripUserInput: newStripUserInput,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };

      if (isPuzzleSolved(newState)) {
        newState.completed = true;
      }

      return newState;
    });
  }, [saveToHistory]);

  const clearCell = useCallback(() => {
    setState(prev => {
      if (prev.selectedCellIndex === null || prev.paused || prev.completed) {
        return prev;
      }

      const cell = prev.grid[prev.selectedCellIndex];
      if (cell.isRevealed) {
        return prev;
      }

      const historyEntry = saveToHistory(prev);

      const newGrid = prev.grid.map((c, i) => {
        if (i === prev.selectedCellIndex) {
          return {
            ...c,
            userOperandA: null,
            userOperandB: null,
            userOperation: null,
            isCorrect: null,
          };
        }
        return c;
      });

      return {
        ...prev,
        grid: newGrid,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, [saveToHistory]);

  const clearStripPosition = useCallback(() => {
    setState(prev => {
      if (prev.selectedStripIndex === null || prev.paused || prev.completed) {
        return prev;
      }

      if (prev.strip[prev.selectedStripIndex] !== null) {
        return prev;
      }

      const historyEntry = saveToHistory(prev);

      const newStripUserInput = [...prev.stripUserInput];
      newStripUserInput[prev.selectedStripIndex] = null;

      return {
        ...prev,
        stripUserInput: newStripUserInput,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, [saveToHistory]);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < 0 || prev.paused || prev.completed) {
        return prev;
      }

      const entry = prev.history[prev.historyIndex];
      const restoredState = applyHistoryEntry(entry, prev);

      return {
        ...restoredState,
        historyIndex: prev.historyIndex - 1,
      };
    });
  }, [applyHistoryEntry]);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1 || prev.paused || prev.completed) {
        return prev;
      }

      const nextIndex = prev.historyIndex + 2;
      if (nextIndex >= prev.history.length) {
        return prev;
      }

      const entry = prev.history[nextIndex];
      const restoredState = applyHistoryEntry(entry, prev);

      return {
        ...restoredState,
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, [applyHistoryEntry]);

  const useHint = useCallback(() => {
    setState(prev => {
      if (prev.hintsRemaining <= 0 || prev.paused || prev.completed) {
        return prev;
      }

      // Buscar primera celda vacía o incorrecta
      const targetIndex = prev.grid.findIndex(cell =>
        cell.userOperandA === null ||
        cell.userOperandB === null ||
        cell.userOperation === null ||
        cell.isCorrect === false
      );

      if (targetIndex === -1) {
        // Si no hay celdas, buscar en el strip
        const stripTargetIndex = prev.stripUserInput.findIndex((val, i) =>
          prev.strip[i] === null && val !== prev.stripSolution[i]
        );

        if (stripTargetIndex === -1) {
          return prev;
        }

        const historyEntry = saveToHistory(prev);
        const newStripUserInput = [...prev.stripUserInput];
        newStripUserInput[stripTargetIndex] = prev.stripSolution[stripTargetIndex];

        const newState: PuzzleState = {
          ...prev,
          stripUserInput: newStripUserInput,
          hintsUsed: prev.hintsUsed + 1,
          hintsRemaining: prev.hintsRemaining - 1,
          history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
          historyIndex: prev.historyIndex + 1,
        };

        if (isPuzzleSolved(newState)) {
          newState.completed = true;
        }

        return newState;
      }

      // Revelar celda del grid
      const historyEntry = saveToHistory(prev);
      const cell = prev.grid[targetIndex];
      const pair = prev.pairs[cell.pairIndex];
      
      // Determinar qué operación produce el valor de la celda
      const isSum = pair.sum === cell.value;
      const correctOperation: OperationType = isSum ? 'sum' : 'product';

      const newGrid = prev.grid.map((c, i) => {
        if (i === targetIndex) {
          return {
            ...c,
            userOperandA: pair.a,
            userOperandB: pair.b,
            userOperation: correctOperation,
            isCorrect: true,
            isRevealed: true,
          };
        }
        return c;
      });

      const newState: PuzzleState = {
        ...prev,
        grid: newGrid,
        hintsUsed: prev.hintsUsed + 1,
        hintsRemaining: prev.hintsRemaining - 1,
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };

      if (isPuzzleSolved(newState)) {
        newState.completed = true;
      }

      return newState;
    });
  }, [saveToHistory]);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  const reset = useCallback(() => {
    setState(generatePuzzle(config));
  }, [config]);

  const newPuzzle = useCallback((newConfig: PuzzleConfig) => {
    setConfig(newConfig);
    setState(generatePuzzle(newConfig));
  }, []);

  const computed = useMemo((): UsePuzzleComputed => {
    const canUndo = state.historyIndex >= 0 && !state.paused && !state.completed;
    const canRedo = state.historyIndex < state.history.length - 1 && !state.paused && !state.completed;

    const totalCells = state.grid.length;
    const filledCells = state.grid.filter(cell => 
      cell.userOperandA !== null && 
      cell.userOperandB !== null && 
      cell.userOperation !== null
    ).length;
    const hiddenStripCount = state.strip.filter(v => v === null).length;
    const filledHiddenStrip = state.stripUserInput.filter((v, i) => state.strip[i] === null && v !== null).length;

    const total = totalCells + hiddenStripCount;
    const filled = filledCells + filledHiddenStrip;
    const progress = total > 0 ? Math.round((filled / total) * 100) : 0;

    return { canUndo, canRedo, progress };
  }, [state]);

  const actions: UsePuzzleActions = {
    selectCell,
    selectOperandA,
    selectOperandB,
    selectStripPosition,
    enterOperandA,
    enterOperandB,
    enterStripNumber,
    toggleOperation,
    clearCell,
    clearStripPosition,
    undo,
    redo,
    useHint,
    togglePause,
    reset,
    newPuzzle,
  };

  return {
    state,
    actions,
    computed,
    config,
  };
}
