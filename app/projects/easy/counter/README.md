# Counter Component

A simple, elegant, and accessible counter component built with React and TypeScript. The counter allows users to increment, decrement, and reset a numerical value within defined boundaries.

![Counter Component Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/accordion-component.png?updatedAt=1748861739643)

## Features

- **Intuitive Interface**: Clean design with three action buttons (Increment, Decrement, Reset)
- **Bounded Values**: Counter respects minimum (-100) and maximum (100) boundaries
- **Accessibility**: Fully accessible with ARIA attributes and screen reader support
- **Responsive Design**: Adapts to different screen sizes with appropriate spacing and sizing

## Implementation Details

### Component Structure

The counter component consists of:

- A display area showing the current counter value
- Three control buttons for manipulating the counter value

### State Management

The component uses React's `useState` hook to track:

- Current counter value
- Minimum allowed value (-100)
- Maximum allowed value (100)

### Counter Actions

Three primary actions are supported:

1. **Increment**: Increases the counter value by 1 (up to the maximum)
2. **Decrement**: Decreases the counter value by 1 (down to the minimum)
3. **Reset**: Returns the counter value to 0

Each action respects the defined boundaries and prevents the counter from exceeding its limits.

### Code Example

```tsx
// Basic usage of the counter component
import Counter from './Counter';

const App = () => {
  return (
    <div className="container">
      <Counter />
    </div>
  );
};
```

## Technical Implementation

The component uses:

- **React Hooks**: For state management (`useState`)
- **TypeScript**: For type safety and better developer experience
- **Shadcn UI Components**: Card and Button components for consistent styling
- **ARIA Attributes**: For accessibility compliance

### Type Definitions

- `CounterNumber`: Defines the structure of the counter state (min, max, initialCount)
- `CounterAction`: Type for the three possible actions (1, 0, -1)
- `ButtonVariant`: Type for styling variants of the buttons

## Accessibility

The counter implements the following accessibility features:

- ARIA live region for announcing counter value changes
- Descriptive aria-labels for all interactive elements
- Keyboard navigation support
- High contrast visual design

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 