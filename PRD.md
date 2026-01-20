# Tetonor - Product Requirements Document (PRD)

**Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Design & Specification

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Game Mechanics](#game-mechanics)
4. [User Experience](#user-experience)
5. [Technical Architecture](#technical-architecture)
6. [Features & Scope](#features--scope)
7. [User Interface](#user-interface)
8. [Data Persistence](#data-persistence)
9. [Accessibility](#accessibility)
10. [Project Roadmap](#project-roadmap)

---

## Executive Summary

**Tetonor** is a digital puzzle game inspired by the mathematical puzzle format from The Sunday Times. It combines deductive reasoning with mathematical operations (addition and multiplication) to create engaging, brain-challenging puzzles.

### Key Metrics
- **Target Audience**: Puzzle enthusiasts & adult casual gamers
- **Platform**: Web (responsive, desktop & mobile)
- **MVP Scope**: Functional basic (core gameplay)
- **Monetization**: 100% free (no ads)
- **License**: Open Source (MIT)

---

## Product Overview

### What is Tetonor?

Tetonor is a mathematical puzzle game where players deduce pairs of numbers based on their sum and product. The game consists of two main components:

#### 1. The Grid (Main Playing Field)
- Contains 16 numbers (or 8 for smaller variant) that are the **results** of mathematical operations
- Each number is either a sum or product of a pair from the number strip
- Visual hierarchy: larger cell for result, smaller cell below for the operands
- Clicking toggles between sum and product views for the same pair

#### 2. The Number Strip (Operands)
- Contains the 16 (or 8) base numbers in **strictly ascending order**
- Numbers can repeat within the strip while maintaining order
- Difficulty levels may hide some numbers (represented as blanks)
- The strip must be deduced as part of solving the puzzle

### Game Rules

1. **Each pair of numbers from the strip generates exactly 2 results:**
   - One ADDITION: `a + b`
   - One MULTIPLICATION: `a × b`

2. **The challenge:**
   - Identify which pairs correspond to which results
   - Complete any hidden gaps in the number strip
   - Maintain ascending order in the strip

3. **Winning condition:**
   - All cells in the grid are correctly filled with their corresponding operations
   - All numbers in the strip (including hidden ones) are correctly deduced
   - Both must be valid simultaneously

---

## Game Mechanics

### Core Operations

- **Addition (+)**: Basic arithmetic sum
- **Multiplication (×)**: Basic arithmetic product
- **Number Range**: 1–50 (for operands)
- **Grid Sizes**: 
  - Classic: 16 cells (8 pairs)
  - Small: 8 cells (4 pairs)

### Difficulty Levels

| Level | Description | Hidden Numbers |
|-------|-------------|-----------------|
| **Easy** | Complete number strip visible | None |
| **Medium** | Some numbers hidden in strip | ~25% |
| **Hard** | Majority of strip hidden | ~50% |

### Puzzle Generation

- **Method**: Algorithmic generation with seeded randomization
- **Seed Source**: Date-based for daily puzzles (allows multiple solutions)
- **Validation**: No guarantee of unique solution (multiple valid solutions acceptable)
- **Generation Speed**: Real-time on puzzle load

### Game Modes

1. **Practice Mode (Free Play)**
   - Choose difficulty and size
   - Unlimited attempts
   - No time pressure
   - Perfect for learning

2. **Daily Puzzle**
   - One puzzle per day for all users
   - Seeded by date (same puzzle for all on same day)
   - Random difficulty assignment
   - Counts toward statistics

3. **Time Attack Mode**
   - Race against the clock
   - Timer visible during play
   - No time-based scoring penalties
   - Completion time tracked in statistics

---

## User Experience

### Player Actions

#### Input Methods
- **Desktop**: Physical keyboard (number keys)
- **Mobile**: On-screen numeric keypad
- **Mixed**: Adaptive based on device type

#### Keyboard Shortcuts
- **Arrow Keys**: Navigate between cells (up, down, left, right)
- **Ctrl+Z / Cmd+Z**: Undo last action
- **0 or Delete**: Clear current cell

#### Core Interactions

1. **Entering Numbers**
   - Click/tap a cell to select it
   - Type a number (1–9)
   - Cell validates immediately against current state
   - Invalid entries show red border (conflicting with current grid state)

2. **Switching Operations**
   - Click on the operation cell (top part of pair)
   - Toggle between viewing the SUM or PRODUCT for that pair
   - Both must eventually be filled correctly

3. **Cell Highlighting**
   - **Active Cell**: Clear visual focus indicator
   - **Identical Numbers**: All cells with the same value highlight
   - **Conflicts**: Cells with logical conflicts (impossible sums/products) show red border
   - **Related Cells**: Pair's operand cells highlight when product/sum selected

4. **Undo/Redo System**
   - **Unlimited undo**: Step backward through all moves
   - **Unlimited redo**: Step forward through undone moves
   - **Reset Button**: Clear entire puzzle and start over

5. **Pause Functionality**
   - Pauses the timer
   - Obscures the puzzle grid
   - Prevents further input until resumed

### Validation & Feedback

#### Per-Operation Validation
- **Timing**: Immediate upon entering a number
- **Scope**: Validates only the specific operation (not entire puzzle)
- **Feedback**:
  - Green border or checkmark: Valid entry
  - Red border: Invalid entry (conflicts with current state)
  - Sound effect: Optional, configurable
  - No visual penalty or count-down

#### Puzzle Completion
- **Trigger**: All cells filled + all numbers in strip deduced + all valid
- **Validation**: Full puzzle validation (all 8 pairs + strip integrity)
- **Feedback**:
  - Celebratory animation (Framer Motion)
  - Modal dialog with:
    - Completion time
    - Difficulty level
    - Number of hints used
    - Statistics summary
    - "Share" button (generates image)
  - Stats recorded to LocalStorage

### Hints System

- **Availability**: 3 hints per puzzle (per game session)
- **Type**: Reveal one cell with correct answer
- **Implementation**:
  - Finds first empty cell with logical solution
  - Fills the cell with correct value
  - Plays optional sound
  - Decrements hint counter
  - Hint usage tracked in completion stats
- **Strategic Play**: Use wisely since they're limited

### Timer

- **Visibility**: Always visible (top-right corner during gameplay)
- **Display Format**: MM:SS
- **Behavior**:
  - Starts when puzzle loads
  - Pauses when player pauses game
  - Continues running even if user leaves tab (resumes on return)
  - No time-based scoring, just tracking for records

---

## User Interface

### Design Philosophy

- **Style**: Classic puzzle game aesthetic (similar to Sudoku.com, NYT Games)
- **Complexity**: Clean, distraction-free
- **Focus**: Puzzle takes center stage
- **Accessibility**: High contrast, readable fonts

### Visual Structure

#### Main Game Screen

```
┌─────────────────────────────────┐
│        TETONOR                  │  [Timer: 02:15]
├─────────────────────────────────┤
│                                 │
│     ┌───────────┐               │
│     │  GRID     │               │
│     │ (4×2 or   │               │
│     │  8×1)     │               │
│     └───────────┘               │
│                                 │
│  NUMBER STRIP:                  │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┐      │
│  │ 2│ 3│ 5│ 7│ ?│11│13│17│     │
│  └──┴──┴──┴──┴──┴──┴──┴──┘      │
│                                 │
│  ┌──────────────────────────┐   │
│  │ [? Hint] [⏸ Pause]      │   │
│  │ [↶ Undo] [⟳ Redo]       │   │
│  │ [🔄 Restart]            │   │
│  └──────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

#### Grid Cell Structure

Each pair displays as:
```
┌─────────────────────┐
│    RESULT (12)      │  ← Product or Sum (toggle)
├─────────────────────┤
│  OPERANDS (3 × 4)   │  ← Factors/Addends
└─────────────────────┘
```

- **Top Cell**: Larger, displays the mathematical result
- **Bottom Cell**: Operands involved in the operation
- **Borders**: 
  - Thick borders between sections (groups of 3 columns)
  - Thin borders between individual cells
  - Red border for cells with conflicts

### Color & Theme System

#### Theme Support

- **Light Theme** (Default)
  - Background: #ffffff
  - Text: #000000
  - Borders: #ddd
  - Buttons: #ddd hover #bbb

- **Dark Theme**
  - Background: #1a1a1a
  - Text: #ffffff
  - Borders: #444
  - Buttons: #555 hover #777

- **Additional Themes** (Future)
  - High Contrast
  - Colorblind-friendly variants

#### Visual States

- **Default**: Standard appearance
- **Selected/Active**: Clear focus indicator (shadow or bright border)
- **Valid**: Green tint or checkmark
- **Invalid**: Red border, shake animation
- **Highlighted**: Related cells subtly highlighted
- **Disabled**: Grayed out (during pause, after completion)

### Navigation & Controls

#### Main Menu
- Game title (Tetonor)
- 3 buttons:
  - [Play] → Redirects to `/game`
  - [Stats] → Redirects to `/stats`
  - [Help] → Redirects to `/help`
- Settings icon (gear) → Modal with preferences

#### Game Screen
- Return to home (icon/button, top-left)
- Pause button (center-top or overlay)
- Game controls (bottom area)

#### Stats Screen
- Summary cards:
  - Total puzzles completed
  - Average completion time
  - Best times by difficulty
  - Current streak (optional future feature)
- List of recent games (last 10–20)
- Back to home button

#### Help Screen
- Rules explanation
- Tutorial walkthrough (optional interactive)
- Keyboard shortcuts reference
- Visual guide to grid structure
- Back to home button

### Configuration & Settings

**Accessible via gear icon or `/settings` route**

- [ ] Sound effects (on/off)
- [ ] Theme selection (dropdown or radio)
- [ ] Autocheck immediate errors (on/off)
- [ ] Visual highlighting (on/off)
- [ ] Font size (small/normal/large)
- [ ] Keyboard layout preference (QWERTY only for now)

---

## Technical Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (recommended) or alternative |
| **Animations** | Framer Motion |
| **State Management** | React Hooks (useState, useReducer, Context API) |
| **Routing** | React Router v6 |
| **Persistence** | Browser LocalStorage |
| **Testing** | Vitest (unit), React Testing Library (integration), Playwright/Cypress (E2E) |
| **Deployment** | TBD (Vercel, Netlify, or GitHub Pages candidate) |

### Project Structure

```
tetonor/
├── src/
│   ├── components/
│   │   ├── Grid.tsx              # Game grid rendering
│   │   ├── NumberStrip.tsx       # Operands strip
│   │   ├── Controls.tsx          # Buttons (undo, hint, pause)
│   │   ├── Timer.tsx             # Timer display
│   │   ├── Modal.tsx             # Completion modal, pause modal
│   │   └── Settings.tsx          # Settings panel
│   ├── pages/
│   │   ├── Home.tsx              # Main menu
│   │   ├── Game.tsx              # Game screen
│   │   ├── Stats.tsx             # Statistics
│   │   └── Help.tsx              # Help/rules
│   ├── hooks/
│   │   ├── usePuzzle.ts          # Puzzle logic & state
│   │   ├── useGameState.ts       # Game state management
│   │   ├── useTimer.ts           # Timer logic
│   │   └── useLocalStorage.ts    # Persistence helpers
│   ├── utils/
│   │   ├── puzzleGenerator.ts    # Seeded random generation
│   │   ├── validation.ts         # Validation logic
│   │   ├── constants.ts          # Game constants
│   │   └── imageExport.ts        # Share image generation
│   ├── types/
│   │   └── game.ts               # TypeScript interfaces
│   ├── styles/
│   │   └── globals.css           # Tailwind imports + custom CSS
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── tests/
│   ├── unit/
│   │   ├── puzzleGenerator.test.ts
│   │   └── validation.test.ts
│   ├── integration/
│   │   └── Game.test.tsx
│   └── e2e/
│       └── gameplay.spec.ts
├── public/
│   └── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── PRD.md                        # This document
├── README.md
└── package.json
```

### State Management

#### Game State (React Hooks)

```typescript
interface PuzzleState {
  // Grid data
  grid: (number | null)[];          // 16 or 8 cells
  gridCorrect: boolean[];           // Validation per cell
  
  // Number strip
  strip: (number | null)[];         // Operands
  stripCorrect: boolean[];          // Validation per strip number
  
  // UI state
  selectedCell: number | null;
  paused: boolean;
  hintsUsed: number;
  
  // History for undo/redo
  history: PuzzleState[];
  future: PuzzleState[];
}

interface GameSession {
  puzzleId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  size: 16 | 8;
  mode: 'practice' | 'daily' | 'timed';
  startTime: number;           // Timestamp
  completedTime?: number;      // Timestamp when completed
  completed: boolean;
  hintsUsed: number;
}
```

#### Component Structure

- **App.tsx** → Routes provider + Settings context
- **Game.tsx** → Main game container, orchestrates puzzle state
- **Grid.tsx** → Renders cells, handles clicks
- **NumberStrip.tsx** → Renders strip, handles edits
- **Controls.tsx** → Buttons for actions
- **Timer.tsx** → Displays elapsed time

### Key Algorithms

#### 1. Seeded Random Generation

```typescript
function seededRandom(seed: number, index: number): number {
  const x = Math.sin((seed + index) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function generatePuzzle(seed: number, difficulty: 'easy' | 'medium' | 'hard') {
  // Generate 8 or 16 pairs
  // Filter by uniqueness of results
  // Create grid with hidden cells per difficulty
  // Return puzzle state
}
```

#### 2. Validation Logic

```typescript
function validateGrid(grid: (number | null)[], pairs: Pair[]): boolean {
  // Check each result matches operation(a, b)
  // Check strip maintains ascending order
  // Check no duplicates where not allowed
}

function validateCell(
  cellIndex: number,
  value: number,
  pairs: Pair[],
  strip: number[]
): boolean {
  // Check if value matches sum or product
  // Check for conflicts with other cells
}
```

#### 3. Hint Generation

```typescript
function getHint(grid, strip, pairs): { cellIndex: number, value: number } {
  // Find first empty cell
  // Determine correct value from pairs
  // Return cell and value
}
```

### Validation & Error Handling

#### Constraints

1. **Grid cells** must match operation results
2. **Strip numbers** must be in ascending order
3. **Pairs** cannot exceed defined range
4. **Operations** must be valid (both sum and product should exist as results)

#### Error States

- Invalid entries show immediately (red border)
- Toast notifications for major errors
- Graceful fallback if puzzle generation fails

---

## Features & Scope

### MVP (Version 1.0) - Core Gameplay

#### Must Have (P0)
- ✅ Game board rendering (16-cell classic grid)
- ✅ Cell input with validation
- ✅ Operation toggle (sum ↔ product)
- ✅ Number strip visualization
- ✅ Puzzle generation algorithm
- ✅ Undo/redo functionality
- ✅ Pause functionality
- ✅ Completion detection & modal
- ✅ Timer display
- ✅ 3 hints per puzzle
- ✅ Dark/Light theme toggle
- ✅ Menu navigation (home, game, stats, help)
- ✅ LocalStorage persistence

#### Should Have (P1)
- ✅ Practice mode (adjustable difficulty)
- ✅ Daily puzzle mode
- ✅ Time attack mode
- ✅ Basic stats tracking
- ✅ Settings configuration
- ✅ Keyboard shortcuts
- ✅ Mobile-responsive UI
- ✅ Multiple themes

#### Nice to Have (P2)
- Sharing (image generation)
- Sound effects
- Smooth animations
- 8-cell puzzle variant
- History of last 20 games
- Keyboard navigation in menus

#### Out of Scope (v1)
- Multiplayer/competition
- Leaderboards
- Achievement system
- Story mode
- User accounts
- Backend persistence
- Analytics

### Roadmap

#### Phase 1: MVP (Months 1–2)
- Core gameplay mechanics
- Basic UI & theme support
- Single player modes (practice, daily, timed)
- Stats tracking via LocalStorage
- Help/rules page

#### Phase 2: Polish (Months 2–3)
- Animations & micro-interactions
- Sound effects
- Image sharing
- Better mobile UX
- Theme customization
- Settings panel

#### Phase 3: Expansion (Months 4+)
- 8-cell variant
- Multiple languages (i18n)
- Achievement system
- Game history details
- Advanced stats
- Backend support (optional)

---

## Data Persistence

### LocalStorage Schema

```javascript
{
  "tetonor_settings": {
    "theme": "light" | "dark",
    "soundEnabled": true,
    "autocheckEnabled": true,
    "highlightingEnabled": true,
    "fontSize": "normal" | "small" | "large"
  },
  
  "tetonor_currentGame": {
    "puzzleId": "2025-01-19-daily",
    "difficulty": "medium",
    "size": 16,
    "mode": "daily",
    "startTime": 1705689600000,
    "grid": [null, 12, null, ...],
    "gridCorrect": [false, true, false, ...],
    "strip": [2, 3, null, 7, ...],
    "stripCorrect": [true, true, false, ...],
    "selectedCell": 0,
    "paused": false,
    "hintsUsed": 1,
    "completed": false
  },
  
  "tetonor_stats": {
    "totalCompleted": 42,
    "totalAttempted": 50,
    "avgCompletionTime": 180,  // seconds
    "byDifficulty": {
      "easy": { completed: 20, avgTime: 120 },
      "medium": { completed: 15, avgTime: 180 },
      "hard": { completed: 7, avgTime: 300 }
    }
  },
  
  "tetonor_history": [
    {
      "id": "2025-01-19-daily",
      "date": "2025-01-19",
      "mode": "daily",
      "difficulty": "medium",
      "size": 16,
      "completionTime": 245,
      "hintsUsed": 2,
      "completed": true
    },
    // ... more entries (last 20)
  ]
}
```

### Data Lifecycle

- **Session Start**: Load current game or create new one
- **During Play**: Update state in memory, save to LS on each action (debounced)
- **Completion**: Save full game record to history
- **Between Sessions**: Restore from LS on app load

---

## Accessibility

### MVP Accessibility (P2 - Future)

- [ ] ARIA labels for interactive elements
- [ ] Screen reader support
- [ ] Full keyboard navigation (menu, game, stats)
- [ ] High contrast mode
- [ ] Adjustable font sizes
- [ ] Color not as only indicator (red border + icon)

### Accessibility Guidelines

- Follow WCAG 2.1 AA standards
- Test with screen readers (NVDA, JAWS)
- Ensure focus indicators are clear
- Support Tab navigation throughout
- Provide text alternatives for images/icons

---

## Project Roadmap

### Q1 2026 (Jan–Mar)

#### Week 1–2: Setup & Core Logic
- Project initialization (already done)
- Puzzle generation algorithm
- Validation system
- Unit tests for core logic

#### Week 3–4: UI & Game Screen
- Grid & number strip components
- Controls & buttons
- Theme system
- Pause & modal dialogs

#### Week 5–6: Game Modes & Persistence
- Practice/daily/timed modes
- LocalStorage integration
- Settings persistence
- Stats tracking

#### Week 7–8: Pages & Navigation
- Menu (home, game, stats, help)
- Router setup
- Page styling & layout
- Mobile responsiveness

#### Week 9–10: Testing & Polish
- Unit test coverage (core logic)
- Integration tests
- Bug fixes
- Performance optimization

#### Week 11–12: Launch Prep
- README & documentation
- Deployment setup (TBD platform)
- Final QA
- Public launch

---

## Success Metrics

### Launch Criteria (MVP)

- [ ] All P0 features implemented
- [ ] No critical bugs
- [ ] Mobile & desktop responsive
- [ ] Undo/redo working flawlessly
- [ ] Stats properly tracked
- [ ] Settings persistent
- [ ] Puzzle generation produces valid puzzles
- [ ] Completion detection 100% accurate

### Post-Launch KPIs (Optional)

- Daily active users
- Average session duration
- Puzzle completion rate
- Return rate (day 1, 7, 30)
- User feedback/ratings

---

## Open Questions & Decisions

1. **Deployment Platform**: TBD (Vercel, Netlify, GitHub Pages, or custom server)
2. **UI Component Library**: Recommendation = shadcn/ui, but open to alternatives
3. **Advanced Stats**: Will expand history beyond 20 games?
4. **Monetization Future**: Will remain free forever?
5. **Internationalization**: First launch EN only, but plan for i18n infrastructure?
6. **Puzzle Algorithm**: Accept multiple valid solutions, or require uniqueness?

---

## Glossary

| Term | Definition |
|------|-----------|
| **Grid** | The main playing field with 16 (or 8) result cells |
| **Number Strip** | The row of operands (base numbers) |
| **Pair** | Two operands that produce a sum and product |
| **Operand** | Base number from the strip (a, b) |
| **Result** | Output of an operation (a+b or a×b) |
| **Cell** | Individual square in the grid |
| **Difficulty** | How many strip numbers are hidden |
| **Seed** | Number used for deterministic random generation |
| **Hint** | Reveal one correct cell value |
| **Undo** | Revert last action(s) |

---

## Appendix A: Game Example

### Example Puzzle (Easy, 8 cells)

**Number Strip**: `2 3 4 5 6 7 8 9`

**Pairs & Results**:
- Pair (2, 3): Sum = 5, Product = 6
- Pair (4, 5): Sum = 9, Product = 20
- Pair (6, 7): Sum = 13, Product = 42
- Pair (8, 9): Sum = 17, Product = 72

**Grid Layout**:
```
┌─────────┬─────────┐
│    5    │    9    │
│  2, 3   │  4, 5   │
├─────────┼─────────┤
│   13    │   17    │
│  6, 7   │  8, 9   │
├─────────┼─────────┤
│    6    │   20    │
│  2, 3   │  4, 5   │
├─────────┼─────────┤
│   42    │   72    │
│  6, 7   │  8, 9   │
└─────────┴─────────┘
```

**Task**: Fill the grid and confirm the number strip.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 19, 2026 | Juan | Initial PRD creation based on product interview |

---

**Last Updated**: January 19, 2026  
**Next Review**: March 2026 (Post-MVP Launch)
