# Wiki Searcher

A Next.js application for searching and exploring Wikipedia articles with a clean, user-friendly interface and real-time results.

![Wiki Searcher Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/weather-rdx.png?updatedAt=1748975569611)

## Features

- **Instant Wikipedia Search**: Find articles across the entire Wikipedia database
- **Rich Results Display**: View article titles and content snippets in a clean grid layout
- **Highlighted Matches**: Search terms highlighted in result snippets for easy scanning
- **External Links**: One-click access to full articles on Wikipedia
- **Form Validation**: Input validation ensures meaningful search queries
- **Loading States**: Visual feedback during API requests with spinners
- **Error Handling**: User-friendly notifications for failed searches
- **Clear Results Option**: One-click button to reset search results
- **Responsive Grid Layout**: Adapts from single column on mobile to three columns on desktop
- **Dark Mode Support**: Compatible with system light/dark preferences

## Implementation Details

### Component Structure

The application is built with the following structure:

```
WikiSearcherPage
├── Search Card
│   ├── Wikipedia Logo
│   ├── Search Form
│   │   ├── Query Input
│   │   ├── Search Button
│   │   └── Clear Results Button (conditional)
├── Results Section (conditional)
│   ├── Loading Spinner (conditional)
│   ├── Error Message (conditional)
│   └── Results Grid
│       └── Result Cards
│           ├── Article Title
│           └── Content Snippet
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized form submission
- Uses React Hook Form with Zod for validation
- Tracks search results and API request states
- Manages loading, error, and success states

### API Integration

- Connects to Wikipedia's public API for comprehensive article search
- Handles CORS using the origin parameter in requests
- Sanitizes HTML content with DOMPurify for safe rendering
- Implements proper error handling with user notifications
- Uses axios for API requests with clean parameter handling

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- React Hook Form with Zod for validation
- DOMPurify for HTML sanitization
- React Icons for visual elements
- Sonner for toast notifications
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA labels for interactive elements
- Screen reader friendly search results
- Loading states with descriptive text
- Clear visual feedback for current state
- Keyboard navigable interface
- Focus management for form controls

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
4. Open [http://localhost:3000/projects/easy/wiki-searcher](http://localhost:3000/projects/easy/wiki-searcher) in your browser

## API Integration

The application uses the Wikipedia API to search for articles. The API endpoint returns:
- Article titles
- Page IDs for generating direct links
- Content snippets with highlighted search terms
- Additional metadata for each article

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 