# IP Address Tracker

A Next.js application for tracking and visualizing geographical information about IP addresses and domains with an interactive map interface.

![IP Address Tracker Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/ip-address-tracker.png?updatedAt=1748975562862)

## Features

- **IP/Domain Lookup**: Find location details for any IP address or domain name
- **Interactive Map**: Visualize locations with a dynamic Leaflet-powered map
- **Custom Markers**: Clear pin markers showing exact geographical position
- **Detailed Information**: View IP address, location, timezone, and ISP data
- **Search History**: Automatically saves and recalls your last search
- **Responsive Design**: Adapts perfectly to all device sizes
- **Form Validation**: Ensures proper IP or domain format before searching
- **Error Handling**: User-friendly notifications for failed lookups
- **Clean UI**: Modern, minimalist design for excellent readability

## Implementation Details

### Component Structure

The application is built with the following structure:

```
IPAddressTrackerPage
├── Search Section
│   ├── Form
│   │   ├── Input Field
│   │   └── Submit Button
│   └── Information Cards
│       ├── IP Address Card
│       ├── Location Card
│       ├── Timezone Card
│       └── ISP Card
└── Map Section
    └── Interactive Map with Marker
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized API calls and event handlers
- Custom useStorage hook for persistent search history
- Tracks map instance and location data
- Manages map marker positioning and updates

### API Integration

- Connects to ipify's Geolocation API for comprehensive IP data
- Integrates Leaflet for interactive mapping capabilities
- Implements proper error handling with user notifications
- Uses axios for API requests with clean response handling
- Preserves search history across browser sessions

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Leaflet.js for interactive maps
- Axios for API requests
- React Hook Form with Zod for search validation
- Local storage for persistent search history
- React Icons for map markers
- Sonner for toast notifications
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Properly labeled form elements
- ARIA attributes for interactive components
- Keyboard navigable interface
- Screen reader friendly information cards
- Focus management for search operations

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
4. Open [http://localhost:3000/projects/easy/ip-address-tracker](http://localhost:3000/projects/easy/ip-address-tracker) in your browser

## API Integration

The application uses the ipify Geolocation API to fetch location data for IP addresses and domains. The Leaflet library provides the interactive mapping capabilities with custom markers.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 