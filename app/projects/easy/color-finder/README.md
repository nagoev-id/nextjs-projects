# Color Finder

An interactive color information tool built with Next.js and React that allows users to select colors visually and retrieve detailed technical specifications about them.

![Color Finder Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/color-finder.png?updatedAt=1748939633208)

## Features

- **Interactive Color Picker**: Visual HEX color selection with real-time feedback
- **Color API Integration**: Retrieves detailed color information from Color.pizza API
- **Technical Color Data**: Displays RGB, HSL, LAB values, and luminance metrics
- **Color Visualization**: Shows selected color in both HEX input and visual sample
- **Loading States**: Visual feedback during API requests
- **Error Handling**: Graceful error handling with user notifications
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Implementation Details

### Component Structure

The color finder application is built with the following structure:

```
ColorFinderPage
├── Color Selection Area
│   ├── Color Picker
│   └── HEX Code Display
├── Submit Button
├── Loading Indicator (conditional)
└── Results Display (conditional)
    ├── Color Name
    ├── Color Sample
    └── Technical Information Table
        ├── RGB Values
        ├── HSL Values
        ├── LAB Values
        └── Luminance Metrics
```

### State Management

- Uses React's `useState` hook to track color selection and API results
- Implements `useCallback` for optimized event handlers
- Uses `useMemo` for derived color information formatting
- Manages loading, success, and error states during API requests
- Efficiently handles UI updates based on color changes

### API Integration

- Connects to the Color.pizza API to retrieve color information
- Processes API responses to extract technical color data
- Handles API error states with appropriate user feedback
- Formats API data for clear presentation

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- Axios for API requests
- React Colorful for the color picker component
- Next.js Image component for optimized image rendering
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The color finder provides:

- Interactive and intuitive color selection
- Real-time visual feedback of selected colors
- Clear presentation of technical color specifications
- Educational information about color properties
- Simple one-click submission process
- Helpful error messages for failed requests

## Accessibility

The color finder implements the following accessibility features:

- Proper labeling of interactive elements
- Color contrast for readability
- Loading state indicators
- Error message announcements
- Keyboard navigable interface

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 