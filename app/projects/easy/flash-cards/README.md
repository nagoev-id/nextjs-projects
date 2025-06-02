# Flash Cards Component

An interactive flash card application built with React and TypeScript. This component provides a simple yet effective way to study and memorize information through question-and-answer cards that can be flipped to reveal answers.

![Flash Cards Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/flash-cards.png?updatedAt=1748864513273)

## Features

- **Interactive Cards**: Click or press keys to flip cards and reveal answers
- **Visual Feedback**: Clear color changes indicate when a card is flipped
- **Single Card Focus**: Only one card can be flipped at a time for better focus
- **Responsive Grid Layout**: Automatically adapts from 1 to 4 columns based on screen size
- **Keyboard Navigation**: Full keyboard accessibility with tab navigation and key controls
- **Screen Reader Support**: Proper ARIA attributes for accessibility
- **Clean UI**: Minimalist design that emphasizes content over decoration

## Implementation Details

### Component Structure

The flash cards component consists of:

- A responsive grid container that holds all cards
- Individual card elements that can be flipped between question and answer states

### State Management

The component uses React's `useState` hook to track:

- `selectedId`: The ID of the currently flipped card (or null if no card is flipped)

### Interaction Handling

The component implements two main interaction handlers:

1. **Click Handling**: Toggles the selected state when a card is clicked
2. **Keyboard Handling**: Supports Enter and Space keys for flipping cards

### Card Data Structure

Each flash card contains:

- A unique ID for tracking selection state
- A question displayed on the front of the card
- An answer revealed when the card is flipped

### Code Example

```tsx
// Basic usage of the flash cards component
import FlashCards from './FlashCards';

const App = () => {
  return (
    <div className="container">
      <FlashCards />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useCallback`)
- **TypeScript**: For type safety with custom types like `MockItem`
- **Shadcn UI Components**: Card component for consistent styling
- **CSS Transitions**: For smooth color changes when flipping cards
- **CSS Grid**: For responsive layout across different screen sizes

### Sample Data

The component includes sample flash cards focused on React fundamentals:

- JavaScript as React's foundation
- Components as building blocks
- JSX syntax
- Props for data passing
- useState for state management
- Controlled elements concept

## Accessibility

The flash cards implement:

- Proper tabIndex for keyboard navigation
- ARIA roles (button) for semantic meaning
- ARIA states (aria-pressed) to indicate selection
- Descriptive aria-labels for screen readers
- Keyboard event handlers for Enter and Space keys

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 