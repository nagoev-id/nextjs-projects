# Word Scramble

An engaging word guessing game built with Next.js and React that challenges players to decipher scrambled words within a time limit.

![Word Scramble Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/word-scramble.png?updatedAt=1748939564058)

## Features

- **Scrambled Word Puzzles**: Randomly selected words with shuffled letters
- **Helpful Hints**: Context clues to guide players toward the correct answer
- **Countdown Timer**: 30-second time limit for each word challenge
- **Real-time Validation**: Instant feedback on guesses
- **Score Tracking**: Track successful guesses and time-outs
- **Game Refresh**: Option to get a new word at any time
- **Toast Notifications**: Visual feedback for correct and incorrect answers

## Implementation Details

### Component Structure

The word scramble game is built with the following structure:

```
WordScramblePage
├── Game Info Display
│   ├── Scrambled Word Badge
│   ├── Hint Badge
│   └── Timer Badge
├── Word Input Field
├── Action Buttons
│   ├── Check Word Button
│   └── Refresh Word Button
└── Game State Management
    ├── Success State
    ├── Error State
    └── Time-out State
```

### State Management

- Uses React's `useState` hook to track game state in a unified object
- Implements `useCallback` for optimized event handlers
- Uses `useRef` for direct DOM access and timer management
- Tracks time remaining with interval-based countdown
- Manages word selection and letter scrambling logic

### Game Logic

- Randomly selects words from a predefined list
- Scrambles letters using a Fisher-Yates shuffle algorithm
- Validates user input against the correct word
- Implements timer with automatic game-over on expiration
- Provides contextual feedback based on game state

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Interval-based timer system
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The word scramble game provides:

- Engaging gameplay with increasing difficulty
- Clear visual indicators for game state
- Helpful hints to guide players
- Real-time feedback on guesses
- Smooth transitions between game states
- Mobile-friendly interface

## Accessibility

The word scramble game implements the following accessibility features:

- Semantic HTML structure
- Keyboard navigation for input and buttons
- ARIA attributes for dynamic content
- Clear feedback messages
- Sufficient color contrast
- Focus management

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 