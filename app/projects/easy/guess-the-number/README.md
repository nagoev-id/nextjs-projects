# Guess The Number

An interactive number guessing game built with Next.js and React that challenges users to guess a randomly generated number with as few attempts as possible.

![Guess The Number Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/guess-the-number.png?updatedAt=1748937197024)

## Features

- **Simple Gameplay**: Guess a randomly generated number between 1 and 10
- **Real-time Feedback**: Get "too high" or "too low" hints after each guess
- **Attempt Tracking**: Keep track of how many attempts you've made
- **Form Validation**: Input validation ensures only valid numbers are submitted
- **Game State Management**: Different UI states for active gameplay and completion
- **Restart Option**: Play again with a new random number after winning

## Implementation Details

### Component Structure

The guess the number game is built with the following structure:

```
GuessTheNumberPage
├── Game Header
│   ├── Title
│   └── Instructions
├── Feedback Display (conditionally rendered)
│   └── Success or Hint Message
├── Game Interface
│   ├── Active Game State
│   │   └── Input Form
│   │       ├── Number Input (1-10)
│   │       └── Submit Button
│   └── Completed Game State
│       └── Play Again Button
└── Attempts Counter (conditionally rendered)
```

### State Management

- Uses React's `useState` hook to track game state (random number, attempts, completion)
- Implements React Hook Form with Zod validation for form handling
- Uses `useCallback` for optimized event handlers
- Manages multiple UI states based on game progress

### Game Logic

- Generates a random number between 1 and 10 at game start
- Validates user input against acceptable range
- Compares user's guess with the target number
- Provides appropriate feedback based on comparison
- Increments attempt counter with each valid guess
- Transitions to completion state when correct number is guessed

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- React Hook Form for input handling
- Zod for form validation
- UI components from a shared component library

## Accessibility

The guess the number game implements the following accessibility features:

- Form validation with error messages
- Appropriate ARIA attributes for dynamic content
- Visual feedback with color-coding
- Keyboard navigation support
- Clear game instructions

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 