# Hacker News Search

A Next.js application for searching and browsing articles from Hacker News with advanced filtering and pagination.

![Hacker News Search Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/hacker-news-search.png?updatedAt=1748975560561)

## Features

- **Article Search**: Search for articles by keyword or topic
- **Results Management**: Remove unwanted articles from search results
- **Pagination**: Navigate through search results with intuitive controls
- **Article Details**: View points, author, and comment count for each article
- **External Links**: Open articles in new tabs to read full content
- **Confirmation Dialogs**: Verify before removing articles from results

## Implementation Details

### Component Structure

The application is built with the following structure:

```
HackerNewsSearchPage
├── Search Form
│   └── Search Input
├── Controls Section
│   ├── Pagination Controls
│   └── Sort Controls
├── Results List
│   └── Article Cards
│       ├── Article Title (Link)
│       ├── Article Stats
│       │   ├── Points
│       │   ├── Author
│       │   └── Comments Count
│       └── Remove Button
└── Dialogs
    └── Remove Confirmation Dialog
```

### State Management

- Uses Redux for global state management
- Implements RTK Query for API data fetching
- Uses React Hook Form with Zod for form validation
- Manages pagination state for navigating through results
- Tracks search query and filter settings

### User Interaction

- Search form submits queries to the Hacker News API
- Pagination controls navigate through result pages
- Article cards link to original content
- Remove button triggers confirmation dialog
- Toast notifications for errors and success messages

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn UI components for consistent design

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- External links properly labeled
- Clear focus states

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
4. Open [http://localhost:3000/projects/medium/hacker-news-search](http://localhost:3000/projects/medium/hacker-news-search) in your browser

## API Integration

The application uses the Hacker News API to search for articles and retrieve article data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 