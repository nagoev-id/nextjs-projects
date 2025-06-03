# Rock Paper Scissors

A classic Rock Paper Scissors game built with Next.js and React that lets users play against the computer with animated feedback and score tracking.

![Rock Paper Scissors Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/rock-paper-scissors.png?updatedAt=1748939566890)

## Features

- **Classic Gameplay**: Traditional Rock Paper Scissors rules
- **Player vs Computer**: Play against a computer opponent with random choices
- **Score Tracking**: Keep track of player and computer scores
- **Game Status Messages**: Dynamic feedback on round results
- **Win Conditions**: First to 3 points wins the game
- **Visual Feedback**: Clear indication of choices and results
- **Celebratory Effects**: Confetti animation for player victories
- **Game Reset**: Option to restart the game after completion

## Implementation Details

### Component Structure

The Rock Paper Scissors game is built with the following structure:

```
RockPaperScissorsPage
├── Game Information
│   ├── Game Message
│   └── Score Display
│       ├── Player Score
│       └── Computer Score
├── Game Controls
│   ├── Rock Button
│   ├── Paper Button
│   └── Scissors Button
└── Game Over Display (conditional)
    └── Play Again Button
```

### State Management

- Uses React's `useState` hook to track game state in a unified object
- Implements `useCallback` for optimized event handlers
- Uses `useEffect` to monitor score changes and check win conditions
- Manages game phases (active play, game over)
- Tracks user and computer choices and round results

### Game Logic

- Implements classic Rock Paper Scissors rules (rock beats scissors, scissors beats paper, paper beats rock)
- Generates random computer choices
- Determines round outcomes and updates scores accordingly
- Handles special case for draws (both players get a point)
- Sets game completion when score threshold is reached
- Creates dynamic result messages based on player choices and outcomes

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Icons for choice visualization
- Confetti effects for celebrations
- UI components from a shared component library

## User Experience

The Rock Paper Scissors game provides:

- Intuitive gameplay with familiar rules
- Clear visual feedback on choices and results
- Dynamic messaging that describes the outcome of each round
- Real-time score updates
- Celebration effects for victories
- Easy game reset functionality
- Responsive design for all device sizes

## Accessibility

The Rock Paper Scissors game implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for dynamic content
- Keyboard navigation for game controls
- Descriptive button labels
- Sufficient color contrast
- Screen reader support for game messages

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 