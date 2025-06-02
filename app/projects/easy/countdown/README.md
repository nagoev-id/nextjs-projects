# Countdown Component

A versatile countdown timer built with React and TypeScript that allows users to create and track time remaining until a specific date. This component provides an intuitive interface for setting up countdowns with persistent storage.

![Countdown Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/countdown-1.png?updatedAt=1748868362951)
![Countdown Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/countdown-2.png?updatedAt=1748868374595)

## Features

- **Custom Countdowns**: Create personalized countdowns with custom titles and target dates
- **Real-time Updates**: Timer updates every second with precise calculations
- **Persistent Storage**: Countdown data is saved in localStorage for seamless user experience across sessions
- **Completion Detection**: Automatically detects when a countdown has ended and displays a completion message
- **Form Validation**: Validates input data to ensure proper countdown setup (title required, future dates only)
- **Clean Display**: Time shown in days, hours, minutes, and seconds with leading zeros
- **Reset Functionality**: Option to reset current countdown and create a new one
- **Responsive Design**: Works well on both mobile and desktop devices
- **Accessibility Support**: Proper form labeling and button states

## Implementation Details

### Component Structure

The countdown consists of three main parts:

1. **Form Interface**: For creating new countdowns with title and target date
2. **Timer Display**: Shows the remaining time in days, hours, minutes, and seconds
3. **Control Section**: Button for resetting the countdown

### State Management

The component uses React's hooks for efficient state management:

- `useStorage` custom hook for persistent localStorage data
- `useState` for tracking time left values
- `useCallback` for memoizing functions
- `useMemo` for optimizing derived values
- `useEffect` for timer updates and cleanup
- `useForm` with zod validation for form handling

### Time Calculation Logic

The countdown implements a precise timing approach:

1. Calculates the difference between target date and current date
2. Converts millisecond difference into days, hours, minutes, and seconds
3. Updates display every second with setInterval
4. Detects countdown completion when all values reach zero

### Code Example

```tsx
// Basic usage of the countdown component
import CountdownComponent from './Countdown';

const App = () => {
  return (
    <div className="container">
      <CountdownComponent />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management and side effects
- **TypeScript**: For type safety and better developer experience
- **Zod**: For form validation with custom rules
- **React Hook Form**: For efficient form state management
- **LocalStorage**: For data persistence across sessions
- **Interval Timing**: For updating the display at regular intervals
- **Date API**: For accurate time difference calculations
- **Shadcn UI Components**: Card and Button components for consistent styling
- **Helper Functions**: For formatting time with leading zeros

### Form Validation

The countdown implements validation rules using Zod:

1. **Title Field**: 
   - Required field (cannot be empty)
   - Maximum length of 50 characters
   - Cannot contain only whitespace

2. **Date Field**: 
   - Required field
   - Must be a date in the future
   - Uses HTML5 date input for better user experience

## Performance Considerations

The component includes several optimizations:

- Memoized callback functions to prevent unnecessary re-renders
- Proper interval cleanup to prevent memory leaks
- Conditional rendering to show only relevant UI elements
- Efficient time calculation that minimizes CPU usage
- Local storage for data persistence without server requests

## Use Cases

This countdown component is ideal for:

- Event countdowns (birthdays, holidays, special events)
- Project deadlines
- Sale or promotion end dates
- Launch countdowns
- Goal tracking with time constraints

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 