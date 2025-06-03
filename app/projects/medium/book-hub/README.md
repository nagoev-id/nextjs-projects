# Book Hub

An interactive book search application built with Next.js, React, TypeScript, and Redux Toolkit. This application allows users to search for books, view detailed information, and manage a favorites collection.

![Book Hub Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/book-hub-1.png?updatedAt=1748975558202)
![Book Hub Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/book-hub-2.png?updatedAt=1748975558202)

## Features

- **Book Search**: Search for books by title, author, or other keywords
- **Detailed Book Information**: View comprehensive details about each book including:
  - Cover image
  - Title and author
  - Publication year
  - Description
  - Subjects, places, and time periods
  
- **Favorites Management**:
  - Add books to favorites
  - Remove books from favorites
  - View all favorites organized by publication year
  - Clear all favorites at once
  
- **Responsive Design**: Adapts to different screen sizes with optimized layouts

## Implementation Details

### Component Structure

The application is built with the following structure:

```
Book Hub
├── Home Page (Search)
│   ├── Search Form
│   └── Search Results
├── Book Detail Page
│   ├── Book Information
│   ├── Description
│   └── Metadata (Subjects, Places, Times)
└── Favorites Page
    ├── Books by Publication Year
    └── Management Controls
```

### State Management

- Uses Redux Toolkit for global state management
- RTK Query for API data fetching and caching
- React Hook Form with Zod for form validation

### API Integration

- Connects to the Open Library API through a local proxy
- Transforms API responses into consistent data structures
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
- **CSS** for styling with responsive design

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigable interface
- Proper image alt texts

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 