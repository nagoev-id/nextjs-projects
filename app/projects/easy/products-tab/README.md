# Products Tab

A dynamic product filtering component built with Next.js and React that allows users to browse products by category with an intuitive tabbed interface.

![Products Tab Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/products-tab.png?updatedAt=1748939564582)

## Features

- **Category-based Filtering**: Filter products by selecting category tabs
- **Automatic Category Detection**: Categories are dynamically extracted from product data
- **"All" Category Option**: View all products regardless of category
- **Responsive Grid Layout**: Products display adapts to different screen sizes
- **Visual Product Cards**: Clean presentation with image, title, price, and description
- **Active Tab Highlighting**: Visual indication of the currently selected category
- **Performant Filtering**: Optimized filtering with memoization

## Implementation Details

### Component Structure

The products tab application is built with the following structure:

```
ProductsTabPage
├── Category Tabs
│   ├── "All" Tab
│   └── Category-specific Tabs
└── Products Grid
    └── Product Cards
        ├── Product Image
        ├── Product Info Header
        │   ├── Title
        │   └── Price
        └── Product Description
```

### State Management

- Uses React's `useState` hook to track selected category and product data
- Implements `useCallback` for optimized event handlers
- Uses `useMemo` for filtered products to prevent unnecessary recalculations
- Extracts unique categories from product data using Set
- Manages active tab state for visual feedback

### Filtering Logic

- Implements efficient filtering based on selected category
- Shows all products when "All" category is selected
- Filters products by matching category name (case-insensitive)
- Optimizes performance with memoized filtering
- Preserves original product order within categories

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Next.js Image component for optimized images
- Memoization for performance optimization
- UI components from a shared component library

## User Experience

The products tab provides:

- Intuitive category-based navigation
- Fast filtering without page reloads
- Clear visual hierarchy of information
- Consistent product card layout
- Responsive design for all device sizes
- Active state indication for selected category
- Capitalized category names for better readability

## Accessibility

The products tab implements the following accessibility features:

- Semantic HTML structure with proper role attributes
- ARIA attributes for tab functionality
- Tab panel and tablist relationships
- Keyboard navigation support
- Alt text for product images
- Sufficient color contrast

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 