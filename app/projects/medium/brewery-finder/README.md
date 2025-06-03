# Brewery Finder

An interactive brewery search application built with Next.js, React, TypeScript, and Redux Toolkit. This application allows users to search for breweries worldwide, filter results, and view detailed information about each brewery.

![Brewery Finder Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/brewery-finder-1.png?updatedAt=1748975556503)
![Brewery Finder Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/brewery-finder-2.png?updatedAt=1748975556355)

## Features

- **Brewery Search**: Search for breweries by name or query term
- **Country Filtering**: Filter breweries by country from a predefined list
- **Local Filtering**: Filter displayed results by name, address, country, or city
- **Detailed Brewery Information**: View comprehensive details about each brewery including:
  - Name and type
  - Full address
  - Contact information (phone and website)
  - Location details
  
- **Random Breweries**: Load random breweries to discover new options
- **Responsive Design**: Adapts to different screen sizes with optimized layouts

## Implementation Details

### Component Structure

The application is built with the following structure:

```
Brewery Finder
├── Home Page (Search & List)
│   ├── Search Form
│   │   ├── Query Search
│   │   └── Country Filter
│   ├── Local Filter
│   └── Brewery List
└── Brewery Detail Page
    ├── Brewery Information
    ├── Contact Details
    └── Location Information
```

### State Management

- Uses Redux Toolkit for global state management
- RTK Query for API data fetching and caching
- React Hook Form with Zod for form validation

### API Integration

- Connects to the Open Brewery DB API
- Provides multiple search endpoints (random, by name, by country)
- Handles loading, error, and success states

### Styling

- Custom UI components with responsive design
- Adaptive grid layouts for different screen sizes
- Visual feedback for user interactions

## Technical Implementation

The application uses:

- **Next.js** for routing and server-side rendering
- **TypeScript** for type safety
- **Redux Toolkit** and **RTK Query** for state management and API calls
- **React Hook Form** with **Zod** for form validation
- **Tailwind CSS** for styling with responsive design

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigable interface
- Proper icon labeling with aria-hidden attributes

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 