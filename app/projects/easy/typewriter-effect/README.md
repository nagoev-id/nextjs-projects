# Typewriter Effect

A Next.js application that creates an animated typewriter effect, sequentially typing and erasing text with realistic timing.

![Typewriter Effect Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/typewriter-effect.png?updatedAt=1748975568556)

## Features

- **Smooth Text Animation**: Characters appear and disappear one by one with customizable timing
- **Multi-text Support**: Cycles through multiple text strings automatically
- **Configurable Speeds**: Separate control for typing, erasing, and delay between texts
- **Infinite Loop**: Continuously cycles through the text array without interruption
- **Clean Transitions**: Smooth transitions between typing and erasing phases
- **Visual Emphasis**: Bold styling for the animated portion of text
- **Accessibility Support**: Proper ARIA attributes for screen readers
- **Responsive Design**: Adapts to different screen sizes and devices

## Implementation Details

### Component Structure

The application is built with the following structure:

```
TypewriterEffectPage
└── Card Container
    └── Text Display
        ├── Static Text Portion
        └── Animated Text Portion
```

### State Management

- Uses React hooks for local state management
- Implements useEffect for animation timing control
- Uses useRef for timeout reference management
- Maintains a unified state object with multiple properties
- Tracks current text, text index, and animation mode

### Animation Cycle

- Two distinct animation phases:
  - Typing phase: Characters appear one by one at typing speed
  - Erasing phase: Characters disappear one by one at erasing speed
- Configurable delay between completing typing and starting erasing
- Automatic transition to next text after erasing completes
- Circular array traversal for infinite looping

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- setTimeout for timing control
- Proper cleanup to prevent memory leaks
- Modular state with TypeScript interfaces
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA live region for dynamic text updates
- Screen reader friendly content
- Sufficient text contrast
- Proper focus management
- Responsive text sizing

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
4. Open [http://localhost:3000/projects/easy/typewriter-effect](http://localhost:3000/projects/easy/typewriter-effect) in your browser

## Customization

The typewriter effect can be easily customized by modifying the `INITIAL_STATE` object:
- `typingSpeed`: Time in milliseconds between typing each character
- `eraseSpeed`: Time in milliseconds between erasing each character
- `delayBetweenTexts`: Pause time in milliseconds after typing completes
- `texts`: Array of strings to cycle through

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 