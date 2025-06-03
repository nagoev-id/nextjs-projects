# Online Translator

A versatile and user-friendly text translation tool built with Next.js and React that allows users to translate between multiple languages with additional text-to-speech functionality.

![Online Translator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/online-translator.png?updatedAt=1748939633200)

## Features

- **Multilingual Translation**: Support for translating between numerous languages
- **Text-to-Speech**: Ability to listen to both source and translated text
- **Copy to Clipboard**: One-click copying of text to clipboard
- **Language Swapping**: Instantly switch between source and target languages
- **Real-time Translation**: Fast API-based translation when triggered
- **Clean UI**: Intuitive interface with clear visual separation between source and target
- **Status Indicators**: Loading states and error handling for better user experience

## Implementation Details

### Component Structure

The online translator application is built with the following structure:

```
OnlineTranslatorPage
├── Source Text Area
│   ├── Text Input Field
│   └── Language Controls
│       ├── Language Selector
│       ├── Copy Button
│       └── Text-to-Speech Button
├── Language Swap Button
└── Target Text Area
    ├── Translation Result
    └── Language Controls
        ├── Language Selector
        ├── Copy Button
        └── Text-to-Speech Button
```

### State Management

- Uses React's `useState` hooks to track text and language selections
- Implements loading state management during translation
- Efficiently handles text and language switching operations
- Stores temporary states for user interactions

### API Integration

- Connects to the MyMemory Translation API for text translation
- Handles API response parsing and error handling
- Supports a wide range of language pairs for translation
- Manages API request states for better user feedback

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- Web Speech API for text-to-speech functionality
- React Icons for UI icons
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The online translator provides:

- Seamless translation between language pairs
- Audio playback of text in appropriate language
- Quick language switching with context preservation
- Helpful error messages for failed operations
- Clean, accessible interface with intuitive controls
- Visual feedback during translation operations

## Accessibility

The online translator implements the following accessibility features:

- Proper labeling of all interactive elements
- ARIA attributes for dynamic content
- Keyboard navigation support
- Screen reader compatibility
- Visual indicators for all states and actions

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 