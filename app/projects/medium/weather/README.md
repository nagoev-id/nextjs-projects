# Weather App

A comprehensive weather application built with Next.js and React that provides current weather conditions and forecasts based on city search, with persistent search history.

![Weather App Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/weather.png?updatedAt=1748937197104)

## Features

- **City-based Weather Search**: Find weather information for any city worldwide
- **Current Conditions Display**: View temperature, weather description, and day/night status
- **Multi-day Forecast**: See minimum and maximum temperatures for upcoming days
- **Search History**: Automatically remembers your last search and loads it on return
- **Persistent Storage**: Uses localStorage to save search preferences between sessions
- **Clear History Option**: Easily reset search history when needed
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Informative error messages when searches fail

## Implementation Details

### Component Structure

The weather application is built with the following structure:

```
WeatherPage
├── Search Section
│   ├── Search Form
│   │   └── City Input Field
│   └── Action Buttons
│       ├── Search Button
│       └── Clear History Button (conditional)
├── Status Indicators
│   ├── Loading Spinner
│   └── Error Message (conditional)
└── Weather Display (conditional)
    ├── Location Header
    │   ├── City Name
    │   ├── Region
    │   └── Country
    ├── Current Date
    ├── Weather Condition
    │   ├── Text Description
    │   ├── Weather Icon
    │   └── Day/Night Indicator
    ├── Current Temperature
    └── Forecast Cards
        └── Daily Forecast Items
            ├── Date
            ├── Minimum Temperature
            └── Maximum Temperature
```

### State Management

- Implements Redux Toolkit Query for API data fetching and caching
- Uses React's `useState` hook and custom `useStorage` hook for local state
- Uses React Hook Form with Zod validation for form handling
- Implements `useCallback` and `useEffect` for optimized operations
- Maintains search history in localStorage

### API Integration

- Fetches weather data from a weather API service
- Handles API request states (loading, success, error)
- Implements lazy query execution for on-demand data fetching
- Formats and processes API response data for display

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Redux Toolkit Query for API integration
- React Hook Form for input handling
- Zod for form validation
- LocalStorage for persistence
- UI components from a shared component library

## Accessibility

The weather application implements the following accessibility features:

- Semantic HTML structure
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