# Workout Tracker

A Next.js application for logging and managing personal workout sessions with an intuitive, table-based interface.

![Workout Tracker Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/workout-tracker.png?updatedAt=1748975569766)

## Features

- **Workout Logging**: Record date, type, and duration of exercise activities
- **Multiple Workout Types**: Choose from various exercise categories (walking, running, cycling, etc.)
- **Duration Tracking**: Monitor workout time in minutes
- **Inline Editing**: Update workout details directly in the table interface
- **Persistent Storage**: Automatically saves data to browser's localStorage
- **Delete Functionality**: Remove individual workouts with confirmation dialog
- **Bulk Clear Option**: Reset all workout data with a single click
- **Date Selection**: Convenient date picker for accurate logging
- **Quick Entry Addition**: One-click creation of new workout entries
- **Responsive Design**: Works seamlessly on all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
WorkoutPage
├── Table Header
│   ├── Date Column
│   ├── Workout Type Column
│   └── Duration Column
├── Workout Rows
│   └── WorkoutRow Component
│       ├── Date Input
│       ├── Workout Type Dropdown
│       ├── Duration Input
│       └── Delete Button with Dialog
└── Control Buttons
    ├── Add Entry Button
    └── Clear All Button (conditional)
```

### State Management

- Uses custom useStorage hook for localStorage integration
- Tracks workout entries with TypeScript interfaces
- Implements functions for adding, updating, and deleting workouts
- Maintains workout history with UUID-based identification
- Provides reset functionality for clearing all data

### Data Persistence

- Automatically saves all changes to browser's localStorage
- Retrieves saved workouts on application load
- Maintains data between browser sessions
- Handles data serialization and deserialization

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- UUID for unique entry identification
- Custom hooks for persistent storage
- React Icons for visual elements
- Dialog components for confirmation actions
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML table structure
- Proper ARIA labels for all interactive elements
- Keyboard navigable inputs and controls
- Confirmation dialogs for destructive actions
- Screen reader friendly form elements
- Clear visual feedback for interactive components

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
4. Open [http://localhost:3000/projects/easy/workout-tracker](http://localhost:3000/projects/easy/workout-tracker) in your browser

## Data Storage

The application stores workout data in the browser's localStorage under the key 'workout'. Data includes:
- Unique ID for each workout entry
- Date of the workout
- Type of workout (walking, running, etc.)
- Duration in minutes

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 