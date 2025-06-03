# Hangman Game

A Next.js implementation of the classic Hangman word guessing game with visual feedback and keyboard controls.

![Hangman Game Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/hangman-game.png?updatedAt=1748975561363)

## Features

- **Random Word Generation**: Fetch random words from an external API
- **Keyboard Input**: Guess letters using your keyboard
- **Visual Feedback**: See the hangman figure progress with each wrong guess
- **Letter Tracking**: View correctly and incorrectly guessed letters
- **Win/Lose Detection**: Automatic game end detection with appropriate feedback
- **Game Reset**: Start a new game at any time
- **Visual Effects**: Celebration effects on winning the game

## Implementation Details

### Component Structure

The application is built with the following structure:

```
HangmanPage
├── Figure Component
│   └── SVG Hangman Drawing
├── Word Display
│   └── Hidden/Revealed Letters
├── Wrong Letters Display
│   └── List of Incorrect Guesses
└── Game Controls
    └── Play Again Button
```

### State Management

- Uses Redux for global state management
- Implements async thunks for API calls
- Tracks game state including:
  - Current word
  - Correct letters
  - Wrong letters
  - Game status (playable/won/lost)
- Manages keyboard event listeners for letter input

### User Interaction

- Letter input through keyboard presses (A-Z)
- Visual feedback for correct and incorrect guesses
- Notifications for duplicate letter entries
- Win/lose state with appropriate messages
- Game restart button to fetch a new word

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit for state management
- TypeScript for type safety
- Tailwind CSS for styling
- External API for random word generation
- Sonner for toast notifications
- Confetti effects for win celebration

## Accessibility

The application implements the following accessibility features:

- Keyboard-focused gameplay
- Clear visual states
- Proper ARIA attributes
- Sufficient color contrast
- Descriptive notifications

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
4. Open [http://localhost:3000/projects/medium/hangman-game](http://localhost:3000/projects/medium/hangman-game) in your browser

## Game Rules

1. A random word is selected at the start of the game
2. Press letter keys (A-Z) to guess letters in the word
3. Correct guesses reveal the letter in the word
4. Incorrect guesses add to the hangman figure (6 wrong guesses allowed)
5. Win by guessing all letters in the word
6. Lose if the hangman figure is completed before guessing the word

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android (with keyboard input)

## License

This project is part of a larger Next.js collection and is available under the MIT license. 