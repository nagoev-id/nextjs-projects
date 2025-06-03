# Quote Generator

A versatile quote generator application built with Next.js and React that fetches inspirational quotes, jokes, and affirmations from multiple API sources with options to copy and display results.

![Quote Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/quote-generator-1.png?updatedAt=1748939563957)
![Quote Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/quote-generator-2.png?updatedAt=1748939563941)

## Features

- **Multiple Quote Sources**: Access various API endpoints for different content types
- **Source Selection**: Choose from different quote providers via dropdown menu
- **Copy Functionality**: One-click copying of quotes to clipboard
- **Loading States**: Visual feedback during API requests
- **Error Handling**: Graceful error handling with user notifications
- **Responsive Design**: Adapts to different screen sizes
- **Dynamic Content Display**: Clean presentation of quotes with proper attribution

## Implementation Details

### Component Structure

The quote generator application is built with the following structure:

```
QuoteGeneratorPage
├── Source Selection Form
│   ├── API Source Dropdown
│   └── Get Quote Button
├── Loading Indicator (conditional)
└── Quote Display (conditional)
    ├── Copy Button
    ├── Quote Text
    └── Author Attribution (when available)
```

### State Management

- Uses React's `useState` hook to track quote data and loading state
- Implements React Hook Form with Zod validation for source selection
- Uses `useCallback` for optimized API handling
- Manages loading, error, and success states
- Processes various API response formats with unified data handling

### API Integration

- Connects to multiple quote API services with different response formats
- Handles API authentication where required
- Processes diverse data structures into a consistent format
- Implements flexible data parsing for different content types
- Manages error states with appropriate user feedback

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Hook Form for form handling
- Zod for form validation
- Axios for API requests
- React Icons for UI elements
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The quote generator provides:

- Simple interface for selecting content sources
- Clean display of quotes and attributions
- One-click copying to clipboard
- Loading indicators for network requests
- Error notifications for failed requests
- Support for different content types (quotes, jokes, affirmations)
- Responsive design for all device sizes

## Accessibility

The quote generator implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for dynamic content
- Loading state indicators
- Properly labeled form controls
- Keyboard navigation support
- Focus management for interactive elements

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 