# GitHub User Finder

A Next.js application for searching and exploring GitHub user profiles using the GitHub API.

![GitHub User Finder Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/github-user-finder-1.png?updatedAt=1748975559875)
![GitHub User Finder Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/github-user-finder-2.png?updatedAt=1748975560181)

## Features

- **User Search**: Search for GitHub users by username
- **Search Validation**: Form validation with real-time feedback
- **User Cards**: Display user avatars and basic information
- **Detailed Profiles**: View comprehensive user information including:
  - Repositories
  - Followers
  - Following
  - Location
  - Bio
  - Social links
- **Responsive Design**: Optimized for all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
GitHubUserFinderPage
├── Search Form
│   └── Username Input
├── Results Grid
│   └── User Cards
│       ├── Avatar
│       ├── Username
│       └── View Detail Button
└── User Detail Page
    ├── User Header
    │   ├── Avatar
    │   └── Username
    ├── Profile Information
    │   ├── Bio
    │   ├── Location
    │   ├── Website
    │   └── Social Links
    └── Statistics
        ├── Repositories
        ├── Followers
        └── Following
```

### State Management

- Uses RTK Query for API data fetching and caching
- Implements React Hook Form with Zod for form validation
- Uses `useCallback` and `useMemo` for optimized rendering
- Manages loading, error, and success states

### User Interaction

- Form submission triggers GitHub API search
- Real-time validation feedback during typing
- User cards link to detailed profile pages
- Error handling with toast notifications

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for GitHub API integration
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Sonner for toast notifications

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Form validation with clear error messages
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
4. Open [http://localhost:3000/projects/medium/github-user-finder](http://localhost:3000/projects/medium/github-user-finder) in your browser

## API Integration

The application uses the GitHub REST API to search for users and retrieve detailed profile information. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 