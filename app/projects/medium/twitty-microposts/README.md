# Twitty Microposts

A Next.js application for creating, viewing, and filtering short posts with a clean and intuitive interface.

![Twitty Microposts Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/twitty-microposts-1.png?updatedAt=1748975568384)
![Twitty Microposts Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/twitty-microposts-2.png?updatedAt=1748975568350)

## Features

- **Post Creation**: Add new posts with title and body content
- **Post Management**: View, edit, and delete existing posts
- **Post Filtering**: Filter posts by content to quickly find specific information
- **Real-time Updates**: Immediate UI updates when posts are created, edited, or deleted
- **Responsive Design**: Optimized for all device sizes
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages when operations fail

## Implementation Details

### Component Structure

The application is built with the following structure:

```
TwittyMicropostsPage
├── CreatePostForm
│   ├── Title Input
│   ├── Body Input
│   └── Submit Button
└── PostsList
    ├── Filter Input
    └── Post Items
        ├── Post Content
        │   ├── Title
        │   └── Body
        ├── Edit Button
        └── Delete Button
```

### State Management

- Uses RTK Query for API data fetching and mutations
- Implements optimistic updates for immediate UI feedback
- Uses local state for filtering functionality
- Handles loading, error, and success states for all operations
- Manages CRUD operations with appropriate cache invalidation

### User Interaction

- Create new posts with title and body content
- Edit existing posts through an intuitive interface
- Delete posts with immediate UI updates
- Filter posts to quickly find specific content
- Visual feedback for all actions through loading states

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for API calls and state management
- TypeScript for type safety
- React hooks for local state management
- Tailwind CSS for styling
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Loading state indicators
- Error message announcements
- Keyboard navigable interface

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
4. Open [http://localhost:3000/projects/medium/twitty-microposts](http://localhost:3000/projects/medium/twitty-microposts) in your browser

## API Integration

The application uses a mock API (MockAPI) to store and retrieve post data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching, caching, and mutations.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 