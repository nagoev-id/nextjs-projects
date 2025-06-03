# Countries Explorer

A Next.js application for exploring countries around the world, providing detailed information about each country.

![Countries Explorer Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/countries-explorer-1.png?updatedAt=1748975556483)
![Countries Explorer Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/countries-explorer-2.png?updatedAt=1748975556341)

## Features

- **Country Browsing**: View a comprehensive list of countries with flags and basic information
- **Search Functionality**: Filter countries by name in real-time
- **Region Filtering**: Filter countries by continent/region
- **Pagination**: Navigate through countries with an intuitive pagination system
- **Detailed Country Information**: Access detailed information about each country including:
  - Capital
  - Population
  - Region
  - Languages
  - Currencies
  - Border countries

## Implementation Details

### Component Structure

The application is built with the following structure:

```
CountriesExplorerPage
├── Search and Filter Section
│   ├── Search Input
│   └── Region Filter Dropdown
├── Countries Grid
│   └── Country Cards
│       ├── Flag Image
│       └── Country Name
├── Pagination Controls
└── Country Detail Page
    ├── Flag and Basic Info
    ├── Country Details
    └── Border Countries
```

### State Management

- Uses RTK Query for API data fetching and caching
- Implements `useState` hooks for search, filter, and pagination state
- Uses `useCallback` and `useMemo` for optimized rendering
- Implements client-side filtering and pagination for performance

### User Interaction

- Search input filters countries in real-time
- Region dropdown filters countries by continent
- Pagination controls for navigating through results
- Country cards link to detailed information pages
- Border countries provide navigation to neighboring countries

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- Tailwind CSS for styling
- REST Countries API for data
- Next.js Image component for optimized image loading

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Sufficient color contrast
- Alt text for images

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
4. Open [http://localhost:3000/projects/medium/countries-explorer](http://localhost:3000/projects/medium/countries-explorer) in your browser

## API Integration

The application uses the REST Countries API to fetch country data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Performance Optimizations

- Debounced search input to prevent excessive API calls
- Memoized filtering and pagination functions
- Lazy loading of images outside the viewport
- Prioritized loading of visible content

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 