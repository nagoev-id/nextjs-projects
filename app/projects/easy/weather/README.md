# Weather App

A Next.js application for searching and displaying weather forecasts with a clean, intuitive interface.

![Weather App Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/weather.png?updatedAt=1748937197104)

## Features

- **City Weather Search**: Find weather information for any city worldwide
- **Current Conditions**: View current temperature and weather conditions
- **Multi-day Forecast**: See weather predictions for the next 5 days
- **Day/Night Indication**: Visual indication of daytime or nighttime conditions
- **Location Details**: Display city, region, and country information
- **Temperature Range**: View daily minimum and maximum temperatures
- **Search History**: Automatically saves and loads your last search query
- **Responsive Design**: Optimized for all device sizes
- **Error Handling**: User-friendly error messages when searches fail
- **Loading States**: Visual feedback during API requests

## Implementation Details

### Component Structure

The application is built with the following structure:

```
WeatherPage
├── Search Form
│   ├── City Input
│   ├── Search Button
│   └── Reset Button
├── Current Weather Card (conditional)
│   ├── Location Information
│   ├── Current Temperature
│   ├── Weather Condition
│   └── Weather Icon
└── Forecast Section (conditional)
    └── Daily Forecast Cards
        ├── Date
        ├── Min/Max Temperatures
        └── Condition Icon
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized API calls
- Custom useStorage hook for localStorage integration
- Tracks loading, error, and success states for API interactions
- Manages weather data state with TypeScript interfaces

### API Integration

- Connects to WeatherAPI.com for comprehensive weather data
- Handles API errors gracefully with user notifications
- Implements search functionality with form validation
- Formats and displays API response data in a user-friendly way

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- React Hook Form with Zod for search validation
- Local storage for persistent search history
- Sonner for toast notifications
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes for interactive elements
- Loading state indicators
- Error message announcements
- Keyboard navigable interface
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
4. Open [http://localhost:3000/projects/easy/weather](http://localhost:3000/projects/easy/weather) in your browser

## API Integration

The application uses the WeatherAPI.com API to fetch weather data. The API calls include parameters for:
- City name query
- 5-day forecast
- Temperature in Celsius
- Weather condition text and icons

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 