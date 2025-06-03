# Popcorn Movies

A Next.js application for searching and exploring movies with collections and favorites functionality.

![Popcorn Movies Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/popcorn-movies.png?updatedAt=1748975566908)
![Popcorn Movies Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/popcorn-movies-2.png?updatedAt=1748975566870)

## Features

- **Movie Search**: Search for movies by keyword or title
- **Collections**: Browse curated movie collections by category
- **Favorites**: Save and manage your favorite movies
- **Infinite Scrolling**: Load more results as you scroll
- **Movie Details**: View comprehensive information about each movie
- **Responsive Design**: Optimized for all device sizes
- **Clear Results**: Reset search and start over with a single click

## Implementation Details

### Component Structure

The application is built with the following structure:

```
PopcornMoviesPage
├── Search Section
│   ├── Keyword Search Form
│   └── Collection Search Form
├── Results Controls
│   ├── Clear Search Button
│   └── Load More Button
├── Movie Grid
│   └── Movie Cards
│       ├── Movie Poster
│       ├── Movie Title
│       ├── Rating
│       └── Favorite Toggle
└── Favorites Page
    └── Saved Movie Cards
```

### State Management

- Uses Redux for global state management
- Implements RTK Query for API data fetching
- Uses React Hook Form with Zod for form validation
- Manages pagination with infinite loading
- Tracks search state across keyword and collection searches
- Implements favorites storage with persistence

### User Interaction

- Search for movies by entering keywords
- Select from predefined movie collections
- Add/remove movies from favorites with a single click
- Load more results by clicking the "Load More" button
- Clear search results to start a new search
- Switch between search results and favorites

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Sonner for toast notifications
- Custom hooks for search logic

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Proper image alt text
- Sufficient color contrast

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
4. Open [http://localhost:3000/projects/medium/popcorn-movies](http://localhost:3000/projects/medium/popcorn-movies) in your browser

## API Integration

The application uses a movie database API to fetch movie data, including search results and collection information. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 