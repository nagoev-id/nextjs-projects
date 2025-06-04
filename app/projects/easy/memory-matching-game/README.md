# Memory Matching Game

A Next.js implementation of the classic memory card matching game with a clean, interactive interface.

![Memory Matching Game Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/memory-matching-game.png?updatedAt=1748975562847)

## Features

- **Interactive Card Flipping**: Smooth card animations when revealing emoji pairs
- **Game Progress Tracking**: Count moves to encourage improvement with each playthrough
- **Match Verification**: Automatic checking of card pairs with visual feedback
- **Win Condition**: Celebratory end screen when all pairs are matched
- **Game Reset**: One-click restart for continuous play
- **Responsive Design**: Adapts to different screen sizes with appropriate card sizing
- **Optimized Performance**: Uses React's memoization features for efficient rendering
- **Accessibility Support**: Includes ARIA attributes for screen reader compatibility

## Implementation Details

### Component Structure

The application is built with the following structure:

```
MemoryMatchingPage
├── Game Board (conditional)
│   └── Card Components
│       ├── Front Face (Emoji)
│       └── Back Face (Question Mark)
└── End Game Screen (conditional)
    ├── Congratulation Message
    ├── Move Counter Result
    └── Restart Button
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useMemo for card shuffling and UI component memoization
- Tracks opened cards, matched pairs, move count, and game state
- Manages card flipping with timeouts and cleanup

### Game Logic

- Random card shuffling at game initialization
- Limits to two cards open at once
- Automatic card pair matching verification
- Automatic closing of non-matching pairs after delay
- Win condition checking when all pairs are found
- Move counting for performance tracking

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Lodash for array shuffling
- CSS transitions for card flip animations
- CSS Grid for responsive card layout
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA roles for interactive card elements
- Descriptive labels for screen readers
- Focus management for keyboard navigation
- Sufficient color contrast between card faces
- Clear visual feedback for game state

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000/projects/easy/memory-matching-game](http://localhost:3000/projects/easy/memory-matching-game) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 