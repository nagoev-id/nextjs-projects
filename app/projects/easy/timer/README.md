# Timer Component

An interactive countdown timer built with React and TypeScript. This application allows users to set a timer for a specific duration, start, pause, and reset it, with persistent state across page reloads.

![Timer Component Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/timer-1.png?updatedAt=1748862807024)
![Timer Component Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/timer-2.png?updatedAt=1748862807011)

## Features

- **Customizable Duration**: Set the timer for any duration from 1 to 60 minutes
- **Intuitive Controls**: Start, pause, and reset the timer with simple controls
- **Real-time Display**: Watch the countdown in a clear MM:SS format
- **Persistent State**: Timer state is saved in localStorage and restored on page reload
- **Completion Notification**: Receive a toast notification when the timer completes
- **Auto-reset**: Timer automatically resets 3 seconds after completion
- **Form Validation**: Input validation ensures valid time values (1-60 minutes)
- **Responsive Design**: Works well on both mobile and desktop devices

## Implementation Details

### Component Structure

The timer consists of two main views:

1. **Input Form**: For setting the timer duration (shown when no timer is active)
2. **Timer Display**: Shows the countdown and control buttons (shown when timer is active)

### State Management

The component uses React's `useState` hook to track the timer state:

- `secondsRemaining`: Time left in seconds
- `isRunning`: Whether the timer is currently counting down
- `isCompleted`: Whether the timer has reached zero
- `showTimer`: Whether to show the timer display or input form

### Timer Logic

The application implements:

- Conversion between minutes (input) and seconds (internal state)
- Real-time countdown using `setInterval`
- Proper cleanup of intervals to prevent memory leaks
- State persistence using localStorage
- Auto-reset functionality after timer completion

### Code Example

```tsx
// Basic usage of the timer component
import Timer from './Timer';

const App = () => {
  return (
    <div className="container">
      <Timer />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useEffect`, `useCallback`, `useMemo`)
- **TypeScript**: For type safety with custom types like `TimerState`
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Toast notifications via Sonner
- **Local Storage**: For persisting timer state across sessions
- **Shadcn UI Components**: Card and Button components for consistent styling

### Validation

The timer implements form validation using Zod:

- Input must be a number
- Value must be an integer
- Value must be positive
- Value must be between 1 and 60 minutes

## Accessibility

The timer component implements:

- Semantic HTML structure
- ARIA role for the timer display
- Proper button labeling
- Visual feedback for timer state
- Keyboard navigation support

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 