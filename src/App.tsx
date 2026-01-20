import { useState, useEffect, useCallback } from 'react';
import { usePuzzle } from '@/hooks/usePuzzle';
import { getRandomSeed } from '@/utils/puzzleGenerator';
import type { Difficulty, PuzzleConfig } from '@/types/game';
import './App.css';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

function App() {
  // Estado para tema oscuro
  const [darkMode, setDarkMode] = useState(false);

  // Configuración inicial del puzzle
  const [config, setConfig] = useState<PuzzleConfig>({
    seed: getRandomSeed(),
    difficulty: 'easy',
    size: 16,
  });

  // Hook del puzzle
  const { state, actions, computed } = usePuzzle(config);

  // Aplicar clase dark al documento
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Manejar teclas
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state.paused || state.completed) return;

    // Números 1-9 para ingresar
    if (/^[1-9]$/.test(e.key)) {
      const value = parseInt(e.key, 10);
      if (state.selectedCellIndex !== null) {
        actions.enterNumber(value);
      } else if (state.selectedStripIndex !== null) {
        actions.enterStripNumber(value);
      }
      return;
    }

    // 0 o Delete/Backspace para limpiar
    if (e.key === '0' || e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedCellIndex !== null) {
        actions.clearCell();
      } else if (state.selectedStripIndex !== null) {
        actions.clearStripPosition();
      }
      return;
    }

    // Ctrl+Z para undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      actions.undo();
      return;
    }

    // Ctrl+Y para redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      actions.redo();
      return;
    }

    // Flechas para navegación en grid
    if (state.selectedCellIndex !== null && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const currentIndex = state.selectedCellIndex;
      const cols = 4;
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowUp':
          newIndex = currentIndex - cols;
          break;
        case 'ArrowDown':
          newIndex = currentIndex + cols;
          break;
        case 'ArrowLeft':
          newIndex = currentIndex - 1;
          break;
        case 'ArrowRight':
          newIndex = currentIndex + 1;
          break;
      }

      if (newIndex >= 0 && newIndex < state.grid.length) {
        actions.selectCell(newIndex);
      }
    }
  }, [state, actions]);

  // Registrar listener de teclado
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Generar nuevo puzzle
  const handleNewPuzzle = () => {
    const newConfig: PuzzleConfig = {
      ...config,
      seed: getRandomSeed(),
    };
    setConfig(newConfig);
    actions.newPuzzle(newConfig);
  };

  // Cambiar dificultad
  const handleDifficultyChange = (difficulty: Difficulty) => {
    const newConfig: PuzzleConfig = {
      ...config,
      difficulty,
      seed: getRandomSeed(),
    };
    setConfig(newConfig);
    actions.newPuzzle(newConfig);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Tetonor
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Puzzle matematico de sumas y productos
        </p>
      </header>

      {/* Controles superiores */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => handleDifficultyChange('easy')}
          className={`px-4 py-2 rounded-md transition-colors ${
            config.difficulty === 'easy'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          Facil
        </button>
        <button
          onClick={() => handleDifficultyChange('medium')}
          className={`px-4 py-2 rounded-md transition-colors ${
            config.difficulty === 'medium'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          Medio
        </button>
        <button
          onClick={() => handleDifficultyChange('hard')}
          className={`px-4 py-2 rounded-md transition-colors ${
            config.difficulty === 'hard'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          Dificil
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        >
          {darkMode ? 'Claro' : 'Oscuro'}
        </button>
      </div>

      {/* Estado del juego */}
      <div className="flex justify-center gap-4 mb-6 text-sm">
        <span className="px-3 py-1 bg-card rounded-md border">
          Progreso: {computed.progress}%
        </span>
        <span className="px-3 py-1 bg-card rounded-md border">
          Hints: {state.hintsRemaining}/{3}
        </span>
        {state.completed && (
          <span className="px-3 py-1 bg-green-500 text-white rounded-md font-bold">
            Completado!
          </span>
        )}
      </div>

      {/* Grid del puzzle */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="grid grid-cols-4 gap-1 bg-border p-1 rounded-lg">
          {state.grid.map((cell, index) => {
            const isSelected = state.selectedCellIndex === index;
            const isCorrect = cell.isCorrect === true;
            const isIncorrect = cell.isCorrect === false;

            return (
              <button
                key={index}
                onClick={() => actions.selectCell(index)}
                disabled={state.paused}
                className={`
                  aspect-square p-2 rounded-md transition-all duration-150
                  flex flex-col items-center justify-center
                  text-lg md:text-xl font-mono
                  ${isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900' 
                    : 'bg-card hover:bg-accent'
                  }
                  ${isCorrect ? 'bg-green-100 dark:bg-green-900' : ''}
                  ${isIncorrect ? 'bg-red-100 dark:bg-red-900' : ''}
                  ${cell.isRevealed ? 'text-blue-600 dark:text-blue-400' : ''}
                `}
              >
                {/* Resultado (valor a adivinar) */}
                <span className="text-xl md:text-2xl font-bold">
                  {cell.value}
                </span>
                {/* Operandos */}
                <span className="text-xs text-muted-foreground mt-1">
                  {cell.userInput !== null ? (
                    <span className={isCorrect ? 'text-green-600' : isIncorrect ? 'text-red-600' : ''}>
                      = {cell.userInput}
                    </span>
                  ) : (
                    <span className="opacity-50">
                      {cell.operation === 'sum' ? '+' : '×'}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number Strip */}
      <div className="max-w-4xl mx-auto mb-8">
        <h3 className="text-center text-sm text-muted-foreground mb-2">
          Number Strip (operandos en orden ascendente)
        </h3>
        <div className="flex flex-wrap justify-center gap-1 bg-border p-2 rounded-lg">
          {state.stripUserInput.map((value, index) => {
            const isHidden = state.strip[index] === null;
            const isSelected = state.selectedStripIndex === index;
            const isCorrect = value === state.stripSolution[index];

            return (
              <button
                key={index}
                onClick={() => isHidden ? actions.selectStripPosition(index) : null}
                disabled={!isHidden || state.paused}
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-md transition-all duration-150
                  flex items-center justify-center
                  text-lg font-mono font-bold
                  ${isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900' 
                    : isHidden 
                      ? 'bg-card hover:bg-accent cursor-pointer'
                      : 'bg-muted cursor-default'
                  }
                  ${isHidden && value !== null && isCorrect ? 'bg-green-100 dark:bg-green-900' : ''}
                  ${isHidden && value !== null && !isCorrect ? 'bg-red-100 dark:bg-red-900' : ''}
                `}
              >
                {value !== null ? value : (
                  <span className="text-muted-foreground">?</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Teclado numérico (para móvil) */}
      <div className="max-w-xs mx-auto mb-8">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
            <button
              key={num}
              onClick={() => {
                if (num === 0) {
                  if (state.selectedCellIndex !== null) actions.clearCell();
                  else if (state.selectedStripIndex !== null) actions.clearStripPosition();
                } else {
                  if (state.selectedCellIndex !== null) actions.enterNumber(num);
                  else if (state.selectedStripIndex !== null) actions.enterStripNumber(num);
                }
              }}
              disabled={state.paused || state.completed}
              className="h-12 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors font-mono text-xl"
            >
              {num === 0 ? 'C' : num}
            </button>
          ))}
        </div>
      </div>

      {/* Controles de juego */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={actions.undo}
          disabled={!computed.canUndo}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-50"
        >
          Deshacer
        </button>
        <button
          onClick={actions.redo}
          disabled={!computed.canRedo}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-50"
        >
          Rehacer
        </button>
        <button
          onClick={actions.useHint}
          disabled={state.hintsRemaining <= 0 || state.completed}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-50"
        >
          Pista ({state.hintsRemaining})
        </button>
        <button
          onClick={actions.togglePause}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        >
          {state.paused ? 'Reanudar' : 'Pausar'}
        </button>
        <button
          onClick={handleNewPuzzle}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors"
        >
          Nuevo Puzzle
        </button>
      </div>

      {/* Info de debug (temporal) */}
      <details className="max-w-2xl mx-auto text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">Debug Info</summary>
        <div className="mt-2 p-4 bg-card rounded-md border font-mono text-left">
          <p>Seed: {config.seed}</p>
          <p>Difficulty: {config.difficulty}</p>
          <p>Size: {config.size}</p>
          <p>Pairs: {state.pairs.length}</p>
          <p>Strip Solution: [{state.stripSolution.join(', ')}]</p>
          <p>History Length: {state.history.length}</p>
          <p>History Index: {state.historyIndex}</p>
        </div>
      </details>

      {/* Overlay de pausa */}
      {state.paused && !state.completed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Juego Pausado</h2>
            <button
              onClick={actions.togglePause}
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Modal de victoria */}
      {state.completed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-3xl font-bold mb-4 text-green-600">Felicidades!</h2>
            <p className="mb-2">Puzzle completado correctamente</p>
            <p className="text-sm text-muted-foreground mb-4">
              Dificultad: {config.difficulty} | Hints usados: {state.hintsUsed}
            </p>
            <button
              onClick={handleNewPuzzle}
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors"
            >
              Nuevo Puzzle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
