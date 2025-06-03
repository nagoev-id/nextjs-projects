# Product Filter

A comprehensive product filtering system built with Next.js and React that allows users to search and filter products by company with real-time results.

![Product Filter Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/product-filter-1.png?updatedAt=1748939564608)
![Product Filter Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/product-filter-2.png?updatedAt=1748939564017)

## Features

- **Text Search**: Filter products by typing in the search box
- **Company Filtering**: Filter products by selecting specific companies
- **Combined Filtering**: Use both search and company filters simultaneously
- **Real-time Results**: See results as you type with debounced search
- **Dynamic Company List**: Automatically generated from available product data
- **No Results Handling**: Friendly message when no products match filters
- **Responsive Grid Layout**: Adapts to different screen sizes with 1-3 columns

## Implementation Details

### Component Structure

The product filter application is built with the following structure:

```
ProductFilterPage
├── Filter Controls
│   ├── Search Input
│   └── Company Filter Buttons
│       ├── "All" Button
│       └── Company-specific Buttons
└── Products Display
    ├── Product Cards
    │   ├── Product Image
    │   ├── Product Title
    │   ├── Product Price
    │   └── Company Badge
    └── No Results Message (conditional)
```

### State Management

- Uses React's `useState` hook to track search query, input value, and selected company
- Implements `useCallback` for optimized event handlers
- Uses `useMemo` for filtered products and company list
- Implements debounced search with useEffect for better performance
- Manages UI state for no results scenarios

### Filtering Logic

- Combines company filtering and text search in a single operation
- Performs case-insensitive matching on both title and company name
- Implements debounced search to reduce unnecessary renders
- Memoizes filter results to prevent redundant calculations
- Updates results in real-time as user types or selects companies

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Next.js Image component for optimized images
- Debounce pattern for search optimization
- Memoization for performance optimization
- UI components from a shared component library

## User Experience

The product filter provides:

- Instant visual feedback when applying filters
- Search-as-you-type functionality with appropriate delay
- Clear visual indication of active filter selections
- Consistent product card layout with relevant information
- Price formatting for better readability
- Empty state handling with user-friendly message
- Responsive design for all device sizes

## Accessibility

The product filter implements the following accessibility features:

- Semantic HTML structure
- ARIA roles and labels for interactive elements
- Proper form and search field labeling
- Sufficient color contrast for text and buttons
- Keyboard navigation support
- Screen reader announcements for filtered results

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 