# Calculator

A comprehensive calculator application built with Next.js and React that provides standard arithmetic operations with an intuitive interface and keyboard support.

![Calculator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/calculator.png?updatedAt=1748939564010)

## Features

- **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- **Decimal Support**: Accurate handling of decimal numbers
- **Error Handling**: Proper error display for invalid operations like division by zero
- **Keyboard Support**: Use numeric keys, operators, Enter, and Escape for seamless operation
- **Clear Functionality**: Reset calculator state with a single button
- **Chained Operations**: Support for sequential calculations without pressing equals
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Floating Point Precision**: Handles floating point calculations with appropriate rounding

## Implementation Details

### Component Structure

The calculator application is built with the following structure:

```
CalculatorPage
├── Calculator Display
│   └── Output Screen
├── Digit Buttons
│   ├── Numbers 0-9
│   └── Decimal Point
├── Operation Buttons
│   ├── Addition (+)
│   ├── Subtraction (-)
│   ├── Multiplication (*)
│   ├── Division (/)
│   ├── Equals (=)
│   └── Clear (C)
└── Keyboard Event Handlers
```

### State Management

- Uses React's `useState` hook to track calculator state (output, current total, operator)
- Implements `useCallback` for optimized event handlers
- Uses `useMemo` for mathematical operation functions
- Manages multiple input states (new input expected after operation)
- Properly handles sequential operations and equals

### Calculation Logic

- Implements precision handling for floating point operations
- Manages division by zero with appropriate error messages
- Supports chained operations with correct operator precedence
- Performs calculations in real-time as operators are selected
- Properly formats output for better readability

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Event listeners for keyboard support
- Precision handling for floating point numbers
- UI components from a shared component library

## User Experience

The calculator provides:

- Clean, intuitive interface inspired by traditional calculators
- Real-time calculation feedback
- Multiple input methods (mouse clicks and keyboard)
- Error prevention and handling
- Responsive layout that works on all device sizes
- Visual feedback for active operations

## Accessibility

The calculator implements the following accessibility features:

- Keyboard navigation and operation
- ARIA attributes for dynamic content
- Focus management for buttons
- Semantic HTML structure
- Sufficient color contrast
- Screen reader support for calculator operations

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 