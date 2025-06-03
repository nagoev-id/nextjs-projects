# Currency Converter

A comprehensive currency conversion tool built with Next.js and React that allows users to convert between multiple currencies with real-time exchange rates and visual country flag indicators.

![Currency Converter Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/currency-converter.png?updatedAt=1748939633208)

## Features

- **Multiple Currency Support**: Convert between numerous world currencies
- **Country Flag Visualization**: Visual indicators for selected currencies
- **Real-time Exchange Rates**: Up-to-date conversion rates from Exchange Rates API
- **Swap Functionality**: Quick exchange between source and target currencies
- **Detailed Results**: Display of conversion rate, date, and final amount
- **Form Validation**: Input validation to ensure accurate conversions
- **Loading States**: Visual feedback during API requests
- **Error Handling**: Graceful error handling with user notifications

## Implementation Details

### Component Structure

The currency converter application is built with the following structure:

```
CurrencyConverterPage
├── Converter Form
│   ├── Amount Input
│   ├── Currency Selection Area
│   │   ├── Source Currency Selector with Flag
│   │   ├── Swap Button
│   │   └── Target Currency Selector with Flag
│   └── Convert Button
├── Loading Indicator (conditional)
└── Results Table (conditional)
    ├── Date Row
    ├── Rate Row
    └── Result Row
```

### State Management

- Uses React's `useState` hook to track currency selections and conversion results
- Implements React Hook Form with Zod validation for form handling
- Uses `useCallback` for optimized event handlers
- Manages API request states (loading, success, error)
- Tracks currency selections and exchange rate results

### API Integration

- Connects to Exchange Rates Data API for real-time conversion rates
- Processes API responses to extract conversion data
- Handles API authentication with API keys
- Manages error states with appropriate user feedback

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- React Hook Form for input handling
- Zod for form validation
- Axios for API requests
- Next.js Image component for flag images
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The currency converter provides:

- Clean, intuitive interface for currency conversion
- Visual country flags for easier currency identification
- One-click currency swapping functionality
- Clear presentation of conversion results
- Form validation with helpful error messages
- Visual feedback during API requests
- Responsive design for all device sizes

## Accessibility

The currency converter implements the following accessibility features:

- Semantic HTML structure
- Proper labeling of form controls
- ARIA attributes for dynamic content
- Loading state indicators
- Error message announcements
- Keyboard navigable interface

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 