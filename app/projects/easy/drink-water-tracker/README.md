# Water Consumption Tracker

A visual and interactive water intake tracking application built with Next.js and React that helps users monitor their daily hydration goals.

![Water Consumption Tracker Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/drink-water-tracker.png)

## Features

- **Daily Goal Setting**: Set personalized water consumption targets in liters
- **Cup Size Selection**: Choose from multiple cup sizes (100ml to 1000ml)
- **Visual Progress Tracking**: Large visual indicator shows percentage of goal completed
- **Remaining Volume Display**: Clear indication of remaining water needed
- **Interactive Cup Interface**: Click cups to mark them as consumed
- **Progress Persistence**: Automatically saves progress between sessions
- **Reset Functionality**: Option to reset tracking and start fresh
- **Responsive Design**: Works seamlessly across all device sizes

## Implementation Details

### Component Structure

The water consumption tracker is built with the following structure:

```
WaterTracker
├── Setup Form (initial state)
│   ├── Goal Input (liters)
│   └── Cup Size Selector (ml)
└── Tracking Interface
├── Progress Indicator
│   ├── Percentage Display
│   └── Remaining Volume
├── Cup Grid
│   └── Individual Cup Components
└── Reset Button
```
### State Management

- Uses custom `useStorage` hook to persist state in localStorage
- Implements `useCallback` and `useMemo` for optimized performance
- Tracks filled cups, percentage completion, and remaining volume
- Efficiently calculates required number of cups based on goal and cup size

### Performance Optimization

- Memoized components prevent unnecessary re-renders
- Form component isolated to minimize state updates
- Cup components optimized with memo for efficient rendering
- Calculations performed only when necessary

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Zod for form validation
- Custom hooks for localStorage integration
- Tailwind CSS for responsive styling

## User Experience

The water consumption tracker provides:

- Simple setup process with clear input fields
- Visual feedback on progress through color changes
- Interactive elements for marking consumed water
- Persistent storage to maintain progress across sessions
- Clear indication of remaining water needed to reach goal
- Easy reset option when starting a new day

## Accessibility

The water consumption tracker implements the following accessibility features:

- Properly labeled form controls
- Semantic HTML structure
- Keyboard navigable interface
- High contrast visual indicators
- Descriptive button text
- Appropriate ARIA attributes

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license.
