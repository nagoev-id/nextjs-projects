# Date Counter

A versatile date calculation component with two different implementations, allowing users to add or subtract days from the current date with customizable controls.

![Date Counter Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/date-counter.png?updatedAt=1748875312618)

## Features

- **Two Counter Implementations**: 
  - Type 1: Basic counter with button controls
  - Type 2: Advanced counter with slider, direct input, and enhanced UI

- **Intuitive Controls**:
  - Increment/decrement buttons
  - Customizable step size
  - Reset functionality
  - Range slider (in advanced version)
  - Direct numerical input (in advanced version)

- **Real-time Date Calculation**: Instantly see the resulting date as you adjust the counter

- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation

## Implementation Details

### Component Structure

The date counter component is built with the following structure:

```
DateCounter
├── DateCounter1 (Basic Version)
│   ├── Title with Reset Button
│   ├── Count Days Control
│   │   ├── Decrease Button
│   │   ├── Count Display
│   │   └── Increase Button
│   ├── Step Days Control
│   │   ├── Decrease Button
│   │   ├── Step Display
│   │   └── Increase Button
│   └── Date Display
└── DateCounter2 (Advanced Version)
    ├── Title with Reset Button
    ├── Step Slider Control
    ├── Count Input Control
    │   ├── Decrease Button
    │   ├── Numeric Input
    │   └── Increase Button
    ├── Date Display
    └── Full Reset Button
```

### State Management

- Uses React's `useState` hook to track count and step values
- Implements `useRef` to maintain reference to the base date
- Uses `useMemo` to optimize date calculations
- Implements `useCallback` for optimized event handlers

### Styling

- Clean UI with card-based layout
- Visual feedback for interactive elements
- Responsive design that works on various screen sizes
- Consistent styling using shared UI components

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Memoization for performance optimization
- Lucide icons for UI elements

## Accessibility

The date counter implements the following accessibility features:

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigable controls
- Clear visual feedback

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 