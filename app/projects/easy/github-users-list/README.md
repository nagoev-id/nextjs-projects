# GitHub Users List

A Next.js application for displaying and paginating through GitHub users with a clean, responsive interface.

![GitHub Users List Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/github-users-list.png?updatedAt=1748975560786)

## Features

- **GitHub API Integration**: Fetches user data directly from GitHub's API
- **Responsive Grid Layout**: Adapts to different screen sizes (1 column on mobile, 2 on tablets, 4 on desktop)
- **Pagination**: Navigate through user data with previous/next buttons and page numbers
- **User Profile Cards**: Display user avatars, usernames, and profile links
- **Optimized Images**: Uses Next.js Image component for optimized loading
- **Loading States**: Visual feedback during API requests with spinner indicator
- **Error Handling**: User-friendly error notifications when API calls fail
- **Clean UI**: Modern, minimalist design for easy readability

## Implementation Details

### Component Structure

The application is built with the following structure:

```
GitHubUsersListPage
├── Loading Spinner (conditional)
├── Error Message (conditional)
├── Users Grid
│   └── User Cards
│       ├── Avatar Image
│       ├── Username
│       └── Profile Link
└── Pagination Controls
    ├── Previous Button
    ├── Page Number Buttons
    └── Next Button
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized API calls
- Uses useMemo for UI component memoization
- Custom pagination hook for data splitting and navigation
- Tracks loading, error, and success states for API interactions

### API Integration

- Connects to GitHub's public API to fetch user data
- Implements proper error handling with toast notifications
- Uses axios for API requests with AbortController for cleanup
- Parameterized requests with pagination support

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- Custom pagination hook
- Sonner for toast notifications
- UI components from a shared component library
- Next.js Image for optimized image loading

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for pagination controls
- Alternative text for images
- Disabled states for pagination boundaries
- Focus management for interactive elements
- Screen reader friendly navigation

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
4. Open [http://localhost:3000/projects/easy/github-users-list](http://localhost:3000/projects/easy/github-users-list) in your browser

## API Integration

The application uses the GitHub API to fetch user data. The API calls are managed with proper error handling, loading states, and pagination parameters.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 