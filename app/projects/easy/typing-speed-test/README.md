# Typing Speed Test

A Next.js application for measuring typing speed and accuracy with real-time statistics and visual feedback.

![Typing Speed Test Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/typing-speed-test.png?updatedAt=1748975569352)

## Features

- **Real-time Speed Metrics**: Measures words per minute (WPM) and characters per minute (CPM)
- **Error Tracking**: Counts and displays typing mistakes
- **Visual Feedback**: Color-coded character highlighting for correct, incorrect, and current position
- **Timer Countdown**: 60-second test with automatic completion
- **Random Text Generation**: Fetches new test content from API with local fallback
- **Instant Results**: Shows final statistics upon completion
- **Test Restart**: One-click option to try again with new text
- **Responsive Design**: Works seamlessly on all device sizes
- **Error Handling**: Graceful fallback to local data when API is unavailable

## Implementation Details

### Component Structure

The application is built with the following structure:

```
TypingSpeedTestPage
├── Header Section
│   └── Title
├── Statistics Panel
│   ├── Time Remaining
│   ├── Mistakes Counter
│   ├── WPM Display
│   └── CPM Display
├── Text Display Area
│   └── Character Spans (color-coded)
├── Input Section
│   └── Hidden Input Field
└── Control Buttons
    └── Try Again Button (conditional)
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useRef for timer control and input references
- Tracks typing statistics in a unified state object
- Manages user input and comparison with target text

### Text Processing

- Character-by-character comparison for accuracy tracking
- Real-time calculation of typing speed metrics
- Color-coded visualization of typing progress
- Simple debouncing for performance optimization
- Automatic test completion when text is fully typed

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- setInterval for timer functionality
- Proper cleanup to prevent memory leaks
- Sonner for toast notifications
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper focus management for input field
- Color-coding with additional visual indicators
- Clear visual feedback for current position
- Keyboard-centric interaction
- Screen reader friendly statistics

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
4. Open [http://localhost:3000/projects/easy/typing-speed-test](http://localhost:3000/projects/easy/typing-speed-test) in your browser

## API Integration

The application attempts to fetch random text from the Fish Text API for typing tests. If the API is unavailable, it falls back to a local collection of test texts to ensure functionality.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 