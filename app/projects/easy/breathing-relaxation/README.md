# Breathing Relaxation

A calming breathing exercise application built with Next.js and React that guides users through timed breathing cycles with visual and textual cues.

![Breathing Relaxation Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/breathing-relaxation.png?updatedAt=1748939563982)

## Features

- **Guided Breathing Cycles**: Complete breathing cycle with inhale, hold, and exhale phases
- **Visual Animation**: Expanding and contracting circle that visually guides the breathing pace
- **Text Instructions**: Clear textual cues for each breathing phase
- **Automatic Timing**: Perfectly timed 7.5-second breathing cycles
- **Continuous Operation**: Automatically repeats cycles for extended sessions
- **Emoji Indicators**: Adds emotional context to each breathing phase
- **Minimalist Design**: Clean interface that minimizes distractions

## Implementation Details

### Component Structure

The breathing relaxation application is built with the following structure:

```
BreathingRelaxationPage
├── Animation Container
│   ├── Growing/Shrinking Circle
│   ├── Instruction Text
│   └── Visual Pointer
└── Timer System
    ├── Inhale Phase (3 seconds)
    ├── Hold Phase (1.5 seconds)
    └── Exhale Phase (3 seconds)
```

### State Management

- Uses React's `useState` hook to track breathing phase text and animation class
- Implements `useRef` for interval management and cleanup
- Uses `useEffect` for breathing cycle initialization and cleanup
- Manages timed phase transitions with setTimeout

### Animation System

- CSS transitions for smooth circle expansion and contraction
- Class-based animation triggers controlled by React state
- Custom pointer and circle elements for enhanced visual effect
- Precisely timed phase changes for natural breathing rhythm

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- CSS animations and transitions
- Interval and timeout-based timing system
- Responsive design principles
- UI components from a shared component library

## User Experience

The breathing relaxation application provides:

- Intuitive, hands-free operation
- Visual and textual guidance that works in tandem
- Natural breathing rhythm based on established relaxation techniques
- Distraction-free interface that promotes focus
- Smooth transitions between breathing phases
- Continuous operation for extended relaxation sessions

## Accessibility

The breathing relaxation application implements the following accessibility features:

- Text instructions alongside visual cues
- Emoji indicators for additional context
- High contrast between elements
- Semantic HTML structure
- Proper timing for comfortable breathing pace
- Mobile-friendly responsive design

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 