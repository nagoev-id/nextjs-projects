# Guess The Number CLI

A command-line interface styled number guessing game built with Next.js and React that offers a nostalgic terminal experience while challenging users to guess a random number.

![Guess The Number CLI Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/guess-the-number-cli.png?updatedAt=1748937197110)

## Features

- **CLI-Style Interface**: Terminal-like design with retro aesthetics
- **Two-Stage Interaction**: Username entry followed by number guessing gameplay
- **Personalized Experience**: Addresses player by their entered name
- **Real-time Feedback**: "Too high" or "Too low" hints after each guess
- **Game History**: Maintains a visible log of all previous guesses and hints
- **Success Celebration**: Confetti animation upon correctly guessing the number
- **Attempt Tracking**: Displays the total number of attempts on completion

## Implementation Details

### Component Structure

The CLI-styled number guessing game is built with the following structure:

```
GuessTheNumberCLIPage
├── Game Header
│   └── Title
├── Player Introduction (conditionally rendered)
│   └── Personalized Instructions
├── Guess History List
│   └── History Items
│       ├── Guess Number
│       ├── Feedback Message
│       └── Attempts Counter (on success)
└── Input Interface
    └── Input Field (changes based on game state)
        ├── Name Input (initial state)
        └── Number Input (gameplay state)
```

### State Management

- Uses React's `useState` hook to track game state, user input, and guess history
- Implements `useRef` to maintain focus on the input field
- Uses `useCallback` for optimized event handlers
- Manages visibility of UI elements based on game progress

### Game Logic

- Generates a random number between 1 and 100 at initialization
- Validates user input for name and number guesses
- Compares user's guess with the target number
- Provides appropriate feedback for each guess
- Records all guesses and feedback in visible history
- Transitions to completion state when correct number is guessed
- Triggers confetti animation on successful completion

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Toast notifications for validation feedback
- Custom helper functions for confetti effects and random number generation
- Terminal-style CSS styling for retro aesthetic

## User Experience

The CLI-styled game provides:

- Nostalgic terminal-like interface
- Progressive disclosure of game elements
- Persistent history of all interactions
- Visual celebration of success
- Clear input validation with helpful error messages

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 