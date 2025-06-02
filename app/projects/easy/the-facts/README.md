# The Facts

A fun and interactive random fact generator built with Next.js and React that displays interesting facts with the ability to copy them or get a new one.

![The Facts Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/the-facts.png?updatedAt=1748877979625)

## Features

- **Random Fact Generation**: Displays random facts from a large collection
- **Next Fact Button**: Easily get a new random fact with a single click
- **Copy Functionality**: Copy the current fact to clipboard with one click
- **Source Attribution**: Each fact includes a link to its original source
- **Clean UI**: Minimalist design focused on content readability

## Implementation Details

### Component Structure

The facts component is built with the following structure:

```
TheFactsPage
├── Fact Header
│   ├── Fact Number
│   └── Source Link
├── Fact Display
│   └── Fact Text
└── Action Buttons
    ├── Next Fact Button
    └── Copy Fact Button
```

### State Management

- Uses React's `useState` hook to track the current displayed fact
- Implements `useCallback` for optimized event handlers
- Uses `useEffect` to initialize with a random fact on component mount

### User Interaction

- "Next Fact" button generates a new random fact
- "Copy Fact" button copies the current fact text to clipboard
- Source link provides attribution to the original source
- Visual feedback when copying text

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Lucide icons for UI elements
- Helper functions for clipboard operations
- JSON data store for the fact collection

## Accessibility

The facts component implements the following accessibility features:

- Semantic HTML structure
- Proper button labeling
- ARIA live regions for dynamic content
- Keyboard navigable interface

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 