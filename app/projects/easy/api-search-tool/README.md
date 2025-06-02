# API Search Tool

An interactive search tool that allows users to find and filter APIs by keywords and categories, built with Next.js and React.

![API Search Tool Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/api-search-tool.png?updatedAt=1748875312638)

## Features

- **Keyword Search**: Search APIs by name, description, or other properties
- **Category Filtering**: Filter APIs by selecting from predefined categories
- **Interactive UI**: Clean and responsive user interface with card-based results
- **Status Handling**: Visual feedback for loading, success, and error states
- **Toast Notifications**: User feedback through toast notifications

## Implementation Details

### Component Structure

The API Search Tool is built with the following structure:

```
APISearchTool
├── Search Form
│   └── Search Input
├── Categories Section
│   ├── Category Title
│   └── Category Buttons
└── Results Display
    ├── Loading State
    ├── Error State
    └── API Cards
        ├── API Title
        ├── Description
        ├── Authentication
        ├── CORS
        └── Category
```

### State Management

- Uses React's `useState` hook to track search query, results, and loading status
- Implements `useCallback` for optimized event handlers
- Manages category selection state for filtering

### Data Processing

- Loads API data from JSON files
- Categorizes APIs for efficient filtering
- Implements search functionality across multiple fields

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- UI components from a shared component library
- Toast notifications for user feedback

## Accessibility

The search tool implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes where appropriate
- Keyboard navigable interface
- Visual feedback for different states

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 