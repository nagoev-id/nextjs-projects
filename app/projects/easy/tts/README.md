# Text-to-Speech Converter

A versatile text-to-speech application built with Next.js and React that leverages the Web Speech API to convert written text into spoken words with multiple voice options.

![Text-to-Speech Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/tts.png?updatedAt=1748939633253)

## Features

- **Text Input**: Large text area for entering or pasting content
- **Multiple Voice Options**: Selection from all available system voices
- **Playback Controls**: Convert, pause, and resume speech functionality
- **Voice Selection**: Choose from different languages and accents
- **Responsive Design**: Works seamlessly across device sizes
- **Feedback System**: Clear status indicators and error handling
- **Accessibility**: Keyboard navigation and screen reader support

## Implementation Details

### Component Structure

The text-to-speech application is built with the following structure:

```
TTSPage
├── Form Container
│   ├── Text Input Area
│   ├── Voice Selection Dropdown
│   └── Action Buttons
│       ├── Convert to Speech Button
│       └── Pause/Resume Button (conditional)
└── Browser Compatibility Warning (conditional)
```

### State Management

- Uses React's `useState` hook to track text, voices, and playback status
- Implements `useRef` for direct access to the speech synthesis API
- Uses `useEffect` for voice initialization and cleanup
- Implements `useCallback` for optimized event handlers
- Manages playback state with interval checking

### Speech Synthesis Integration

- Leverages the Web Speech API for text-to-speech functionality
- Handles voice loading, especially for asynchronous loading in Chrome
- Manages utterance creation and voice assignment
- Implements speech status tracking with proper event handlers
- Provides pause/resume functionality for active speech

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Web Speech API for text-to-speech conversion
- Interval-based status checking for playback state
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The text-to-speech converter provides:

- Simple, intuitive interface for text entry
- Real-time feedback on speech status
- Multiple voice options for varied listening experience
- Playback controls for better content consumption
- Clear error messages for unsupported browsers
- Smooth transitions between application states

## Accessibility

The text-to-speech application implements the following accessibility features:

- Semantic HTML structure
- Proper labeling of form controls
- Keyboard navigable interface
- Status announcements for screen readers
- Focus management during state changes

## Browser Compatibility

This component is compatible with browsers supporting the Web Speech API:

- Chrome, Edge, Safari (full support)
- Firefox (partial support)
- Mobile browsers with varying levels of support

## License

This project is part of a larger Next.js collection and is available under the MIT license. 