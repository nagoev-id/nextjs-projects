# URL Shortener

A sleek and functional URL shortening application built with Next.js and React that transforms long URLs into manageable, shareable links using the TinyURL API.

![URL Shortener Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/url-shortener.png?updatedAt=1748937197098)

## Features

- **URL Shortening**: Convert long, unwieldy URLs into concise, shareable links
- **Input Validation**: Real-time validation ensures only properly formatted URLs are processed
- **Copy to Clipboard**: Easily copy shortened URLs with a single click
- **Creation Timestamps**: Each shortened URL displays its creation date and time
- **History Tracking**: Maintains a session history of all shortened URLs
- **Loading States**: Visual feedback during API requests
- **Error Handling**: Clear notifications when shortening fails

## Implementation Details

### Component Structure

The URL shortener application is built with the following structure:

```
URLShortenerPage
├── Input Form
│   ├── URL Input Field
│   └── Shorten Button
├── Status Indicators
│   ├── Loading Spinner
│   └── Error Message (conditional)
└── Results List (conditional)
    └── URL Result Cards
        ├── Shortened URL (clickable)
        ├── Copy Button
        └── Creation Timestamp
```

### State Management

- Uses React's `useState` hook to track shortened URLs and request status
- Implements React Hook Form with Zod validation for form handling
- Uses `useCallback` for optimized event handlers
- Manages API request states (loading, error, success)

### API Integration

- Integrates with the TinyURL API for URL shortening
- Handles authentication with API key
- Processes API responses to extract shortened URLs and timestamps
- Implements error handling for failed requests

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- React Hook Form for input handling
- Zod for form validation
- Axios for API requests
- Lucide React for icons
- Toast notifications for user feedback
- UI components from a shared component library

## User Experience

The URL shortener provides:

- Clean, intuitive interface
- Real-time form validation
- Visual feedback for all operations
- One-click copying of shortened URLs
- Chronological history of shortened links
- Clearly formatted timestamps

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 