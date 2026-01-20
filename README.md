# Tetonor

A mathematical puzzle game inspired by The Sunday Times, combining deductive reasoning with arithmetic operations.

## What is Tetonor?

Tetonor is a web-based puzzle game where players deduce pairs of numbers based on their sum and product. Each pair generates exactly two results:
- **Addition**: `a + b`
- **Multiplication**: `a × b`

Your goal is to identify the correct pairs and complete both the grid and the number strip.

### Game Features

- **Three Game Modes**: Practice (free play), Daily Puzzle, and Time Attack
- **Difficulty Levels**: Easy (no hidden numbers), Medium (25% hidden), Hard (50% hidden)
- **Two Grid Sizes**: Classic (16 cells) and Small (8 cells)
- **Smart Hints**: 3 hints per puzzle to reveal correct cells
- **Dark/Light Themes**: Multiple theme support with easy toggling
- **Statistics Tracking**: Track your best times, completion rate, and more
- **Full Undo/Redo**: Unlimited step backward and forward through moves
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Arrow keys for navigation, Ctrl+Z for undo

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tetonor.git
cd tetonor

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to play.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test          # Unit + integration tests
npm run test:e2e      # End-to-end tests
npm run coverage      # Test coverage report
```

### Linting

```bash
npm run lint          # Check code style
npm run lint:fix      # Fix style issues automatically
```

## Project Structure

```
src/
├── components/        # React components (Grid, Controls, Timer, etc)
├── pages/            # Page components (Home, Game, Stats, Help)
├── hooks/            # Custom React hooks
├── utils/            # Utility functions & algorithms
├── types/            # TypeScript type definitions
├── styles/           # Global styles & Tailwind config
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Vitest + RTL** - Testing

## Game Rules

1. **The Grid** contains result numbers (sums and products)
2. **The Number Strip** contains the base numbers in ascending order
3. Each pair from the strip generates exactly 2 results:
   - One sum: `a + b`
   - One product: `a × b`
4. Your job is to:
   - Match results to the correct pairs
   - Deduce any hidden numbers in the strip
   - Verify the entire grid and strip are valid

## Routes

- `/` - Home menu
- `/game` or `/play` - Game screen (puzzle selection & gameplay)
- `/stats` - Your statistics and game history
- `/help` - Rules and keyboard shortcuts

## Settings

Access settings via the gear icon on the home page. Configurable options:

- **Theme**: Light, Dark, or other color schemes
- **Sound**: Toggle sound effects on/off
- **Autocheck**: Enable/disable immediate error feedback
- **Highlighting**: Toggle cell highlighting features
- **Font Size**: Adjust text size (small, normal, large)

## Data Storage

Tetonor uses browser LocalStorage to persist:
- Current game progress
- Settings preferences
- Game statistics
- Last 20 played games

No data is sent to servers—everything stays on your device.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Arrow Keys | Navigate between cells |
| 0–9 | Enter a number in the selected cell |
| Delete / Backspace | Clear current cell |
| Ctrl+Z / Cmd+Z | Undo last action |
| Ctrl+Shift+Z / Cmd+Shift+Z | Redo last action |

## Accessibility

- Keyboard navigation throughout the app
- High contrast color support
- Adjustable font sizes
- Screen reader friendly (ARIA labels)
- Clear focus indicators

## Roadmap

### Phase 1: MVP (Q1 2026)
- ✅ Core gameplay mechanics
- ✅ Game modes (practice, daily, timed)
- ✅ Dark/light theme support
- ✅ Stats tracking
- ✅ Mobile responsive UI

### Phase 2: Polish (Q2 2026)
- Share puzzles as images
- Sound effects
- Smooth animations
- Enhanced mobile UX
- Theme customization options

### Phase 3: Expansion (Q3+ 2026)
- 8-cell puzzle variant
- Multiple languages
- Achievement system
- Game history details
- API/backend integration (optional)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Inspiration & References

- The Sunday Times puzzle format
- Sudoku.com & NYT Games UI patterns
- Mathematical puzzle communities

## FAQ

**Q: Is Tetonor free?**  
A: Yes! Tetonor is 100% free with no ads or in-app purchases.

**Q: Do I need an account?**  
A: No account required. Your progress is saved locally on your device.

**Q: Can I play offline?**  
A: Yes, Tetonor is fully functional offline. Puzzles are generated locally.

**Q: Will my data be synced across devices?**  
A: Not in v1.0. Future versions may support cloud sync via optional account login.

**Q: Can I share my progress?**  
A: Yes! After completing a puzzle, you can generate and share an image of your solution.

**Q: What's the hardest puzzle?**  
A: The "Hard" difficulty hides ~50% of the number strip, making deduction challenging. Time Attack mode adds time pressure for extra challenge.

## Support & Feedback

Found a bug or have a feature request?

- Open an issue on GitHub
- Check existing issues first to avoid duplicates
- Provide clear reproduction steps for bugs

## Author

Created by Juan

---

**Latest Version**: 1.0  
**Last Updated**: January 2026
