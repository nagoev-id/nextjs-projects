# Roll Dice

A Next.js implementation of a two-player dice game where strategy and luck combine for an engaging experience.

![Roll Dice Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/roll-dice.png?updatedAt=1748975566382)

## Features

- **Two-player Game**: Take turns rolling dice and accumulating points
- **Strategic Gameplay**: Decide when to keep rolling or bank your points
- **Dynamic Dice Animation**: Visual representation of dice rolls with dice face images
- **Score Tracking**: Separate tracking for current turn points and total score
- **Win Condition**: First player to reach 100 points wins
- **Visual Feedback**: Color-coded player panels show active player and winner
- **Game Controls**: Roll dice, hold points, and start new game buttons
- **Game Rules**: Built-in dialog explaining game rules and strategy
- **Responsive Design**: Adapts to different screen sizes for optimal gameplay

## Implementation Details

### Component Structure

The application is built with the following structure:

```
RollDicePage
├── Player Panels (2)
│   ├── Player Label
│   ├── Total Score
│   └── Current Score Box
├── Game Controls
│   ├── Roll Dice Button
│   ├── Hold Button
│   └── New Game Button
├── Dice Display Area
│   └── Dice Image (conditional)
└── Game Rules Dialog
    ├── Dialog Trigger
    └── Rules Content
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useMemo for efficient dice image rendering
- Maintains unified game state with multiple properties
- Tracks player scores, active player, and game status

### Game Logic

- Random dice value generation (1-6)
- Score accumulation based on dice rolls
- Turn-based gameplay with player switching
- Special rule: Rolling a 1 resets current score and switches players
- Win condition checking when holding points
- Game state reset functionality

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Next.js Image component for optimized dice images
- Dialog component for rules display
- React Icons for visual elements
- Helper functions for random number generation
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper dialog implementation for game rules
- Alternative text for dice images
- Distinctive visual cues for game state
- Keyboard navigable controls
- Focus management for dialog interactions

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
4. Open [http://localhost:3000/projects/easy/roll-dice](http://localhost:3000/projects/easy/roll-dice) in your browser

## Game Rules

1. Players take turns rolling a single die as many times as they wish
2. Each roll adds to the player's current score
3. If a player rolls a 1, their current score becomes zero and their turn ends
4. A player can choose to 'Hold', which adds their current score to their total score
5. The first player to reach 100 points wins the game

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 