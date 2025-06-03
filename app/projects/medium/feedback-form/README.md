# Feedback Form

A Next.js application for managing user feedback and reviews with rating functionality.

![Feedback Form Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/feedback-form-1.png?updatedAt=1748975560035)
![Feedback Form Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/feedback-form-2.png?updatedAt=1748975560050)

## Features

- **Review Creation**: Add new reviews with custom text and rating
- **Review Management**: Edit and delete existing reviews
- **Rating System**: Rate reviews on a scale of 1-10
- **Statistics Display**: View average rating and total number of reviews
- **Confirmation Dialogs**: Verify actions before deleting reviews
- **Real-time Updates**: Instant UI updates after any changes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
FeedbackPage
├── Review Form
│   ├── Text Input
│   └── Rating Selection
├── Statistics Section
│   ├── Total Reviews Count
│   └── Average Rating
├── Reviews List
│   └── Review Cards
│       ├── Review Text
│       ├── Rating Display
│       ├── Edit Button
│       └── Delete Button
└── Dialogs
    ├── Edit Review Dialog
    └── Delete Confirmation Dialog
```

### State Management

- Uses RTK Query for API data fetching, caching, and mutations
- Implements `useState` hooks for dialog state management
- Uses `useCallback` for optimized event handlers
- Calculates average ratings dynamically from review data

### User Interaction

- Form submission adds new reviews to the database
- Edit button opens a dialog to modify review text and rating
- Delete button triggers a confirmation dialog before removal
- Visual feedback for successful operations and errors

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn UI components for consistent design

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Clear focus states
- Descriptive error messages

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
4. Open [http://localhost:3000/projects/medium/feedback-form](http://localhost:3000/projects/medium/feedback-form) in your browser

## API Integration

The application uses a JSON Server backend to store and retrieve review data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching, caching, and mutations.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 