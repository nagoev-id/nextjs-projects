# Stopwatch Component

A clean and functional stopwatch application built with React and TypeScript. This component provides precise time tracking with intuitive controls for starting, pausing, and resetting the timer.

![Stopwatch Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/stopwatch.png?updatedAt=1748868095453)

## Features

- **Accurate Timing**: Precise time tracking with 100ms update intervals
- **Intuitive Controls**: Start, pause, and reset functionality with clear buttons
- **Clean Display**: Time shown in MM:SS format with leading zeros
- **Smart Button States**: Buttons are automatically enabled/disabled based on current state
- **Memory Persistence**: Accumulated time is preserved when pausing
- **Resource Efficient**: Proper cleanup of intervals to prevent memory leaks
- **Responsive Design**: Works well on both mobile and desktop devices
- **Accessibility Support**: Proper ARIA attributes for screen readers

## Implementation Details

### Component Structure

The stopwatch consists of two main parts:

1. **Timer Display**: Shows the elapsed time in minutes and seconds
2. **Control Buttons**: Three buttons for starting, pausing, and resetting the stopwatch

### State Management

The component uses React's hooks to manage several aspects of the stopwatch:

- `useState` for tracking elapsed time and running status
- `useRef` for storing interval ID, start time, and accumulated time
- `useCallback` for memoizing control functions
- `useEffect` for cleanup on unmount

### Time Calculation Logic

The stopwatch implements a hybrid timing approach:

1. Uses `Date.now()` for accurate time differences between start and current time
2. Stores accumulated time when paused to allow resuming from the same point
3. Updates the display approximately every 100ms for smooth visuals
4. Converts total seconds to minutes:seconds format for display

### Code Example

```tsx
// Basic usage of the stopwatch component
import Stopwatch from './Stopwatch';

const App = () => {
  return (
    <div className="container">
      <Stopwatch />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management and side effects
- **TypeScript**: For type safety and better developer experience
- **Interval Timing**: For updating the display at regular intervals
- **Date API**: For accurate time measurement
- **Shadcn UI Components**: Card and Button components for consistent styling
- **Helper Functions**: For formatting time with leading zeros

### Button Controls

The stopwatch implements three control buttons with context-aware states:

1. **Start Button**: 
   - Begins the timer
   - Disabled when the stopwatch is already running

2. **Pause Button**: 
   - Temporarily stops the timer while preserving the elapsed time
   - Disabled when the stopwatch is not running

3. **Reset Button**: 
   - Returns the timer to 00:00
   - Disabled when the timer is at 00:00 and not running

## Performance Considerations

The component includes several optimizations:

- Memoized callback functions to prevent unnecessary re-renders
- Proper interval cleanup to prevent memory leaks
- Efficient time calculation that minimizes CPU usage
- Smart disabling of buttons to prevent invalid states

## Use Cases

This stopwatch component is ideal for:

- Workout timing
- Cooking applications
- Productivity tools
- Game timers
- Any application requiring simple time measurement

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 