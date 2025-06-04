# Zipcode Finder

A Next.js application for finding and visualizing geographical locations based on postal codes with an interactive map interface.

![Zipcode Finder Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/zipcode.png?updatedAt=1748975569509)

## Features

- **Multi-country Support**: Search for locations across different countries
- **Interactive Map**: Visualize found locations on a Leaflet-powered map
- **Detailed Information**: View location coordinates, state, and place name
- **Form Validation**: Ensures proper country selection and zip code entry
- **Error Handling**: User-friendly messages for failed lookups
- **Loading States**: Visual feedback during API requests
- **Responsive Design**: Adapts seamlessly to different screen sizes
- **Clean UI**: Modern, minimalist design for excellent readability
- **Toast Notifications**: Informative success and error messages

## Implementation Details

### Component Structure

The application is built with the following structure:

```
ZipCodePage
├── Search Form
│   ├── Country Dropdown
│   ├── Zip Code Input
│   └── Submit Button
├── Results Section (conditional)
│   ├── Location Details
│   │   ├── Latitude Card
│   │   ├── Longitude Card
│   │   ├── State Card
│   │   └── Place Name Card
│   └── Map Component
│       └── Location Marker
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized form submission
- Uses React Hook Form with Zod for form validation
- Tracks location data and API request states
- Manages map position and marker placement

### API Integration

- Connects to Zippopotam.us API for postal code data
- Parses response to extract location information
- Dynamically updates map position based on coordinates
- Implements proper error handling with user notifications
- Provides graceful fallbacks for failed requests

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Leaflet.js for interactive maps (dynamically imported)
- Axios for API requests
- React Hook Form with Zod for validation
- Sonner for toast notifications
- Country code data for dropdown options
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Properly labeled form elements
- ARIA attributes for interactive components
- Loading states with descriptive text
- Keyboard navigable form controls
- Screen reader friendly location information
- Sufficient color contrast for readability

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
4. Open [http://localhost:3000/projects/easy/zipcode](http://localhost:3000/projects/easy/zipcode) in your browser

## API Integration

The application uses the Zippopotam.us API to fetch location data based on country code and postal code. The API returns information including:
- Geographic coordinates (latitude and longitude)
- State/province information
- Place name
- Country information

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 