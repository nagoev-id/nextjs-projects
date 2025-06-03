# URL Shortener

A Next.js application for shortening long URLs into concise, shareable links with a history tracking feature.

![URL Shortener Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/url-shortener-rdx.png?updatedAt=1748975569526)

## Features

- **URL Shortening**: Convert long URLs into short, manageable links
- **Copy to Clipboard**: One-click copying of shortened URLs
- **History Tracking**: Maintains a list of previously shortened URLs
- **Timestamp Display**: Shows when each URL was shortened
- **Form Validation**: Validates URLs before submission
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages when operations fail
- **Responsive Design**: Optimized for all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
URLShortenerPage
├── URL Input Form
│   ├── URL Input Field
│   └── Shorten Button
└── Results Section
    └── Shortened URL Cards
        ├── Short URL Link
        ├── Copy Button
        └── Creation Timestamp
```

### State Management

- Uses Redux Toolkit for global state management
- Implements RTK Query for API data fetching
- Uses React Hook Form with Zod for form validation
- Maintains history of shortened URLs in Redux store
- Handles loading, error, and success states

### User Interaction

- Enter a long URL in the input field
- Submit the form to generate a shortened URL
- Copy the shortened URL to clipboard with a single click
- View history of previously shortened URLs
- Receive visual feedback through loading states and notifications

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for API calls and state management
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Sonner for toast notifications
- Lucide React for icons

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Clear focus states
- Sufficient color contrast
- Screen reader friendly content

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
4. Open [http://localhost:3000/projects/medium/url-shortener](http://localhost:3000/projects/medium/url-shortener) in your browser

## API Integration

The application uses the TinyURL API to generate shortened URLs. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and state updates.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 