# Wiki Searcher

A powerful Wikipedia search application built with Next.js and React that allows users to search for articles and view snippets with highlighted search terms.

![Wiki Searcher Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/wiki-searcher.png?updatedAt=1748939633243)

## Features

- **Interactive Search**: Simple and intuitive search interface for Wikipedia articles
- **Real-time Results**: Display of search results as article cards with title and snippet
- **Sanitized Content**: Secure rendering of HTML content using DOMPurify
- **Loading States**: Visual feedback during API requests with spinner indicator
- **Error Handling**: User-friendly error notifications when searches fail
- **Responsive Design**: Adapts to different screen sizes with responsive grid layout
- **External Links**: Direct links to full Wikipedia articles for each result

## Implementation Details

### Component Structure

The Wiki Searcher application is built with the following structure:

```
WikiSearcherPage
├── Search Card
│   ├── Wikipedia Logo
│   └── Search Form
│       ├── Query Input
│       └── Search Button
└── Results Section
    ├── Loading Spinner (conditional)
    ├── Error Message (conditional)
    ├── Results Grid
    │   └── Result Cards
    │       ├── Article Title
    │       └── Article Snippet
    └── No Results Message (conditional)
```

### State Management

- Uses RTK Query for API data fetching and caching
- Implements React Hook Form with Zod validation for search input
- Uses lazy query execution for on-demand Wikipedia searches
- Maintains loading, error, and success states for UI feedback

### API Integration

- Connects to Wikipedia's search API to find relevant articles
- Processes and displays search results with highlighted terms
- Provides direct links to full Wikipedia articles
- Handles API error states with appropriate user feedback

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- RTK Query for API integration
- React Hook Form for input handling
- Zod for form validation
- DOMPurify for sanitizing HTML content
- UI components from a shared component library
- Sonner for toast notifications

## Accessibility

The Wiki Searcher implements the following accessibility features:

- Semantic HTML structure for better screen reader navigation
- ARIA attributes for dynamic content
- Loading state indicators with appropriate aria-busy attributes
- Focus management for form elements
- Proper link descriptions for Wikipedia article links

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 