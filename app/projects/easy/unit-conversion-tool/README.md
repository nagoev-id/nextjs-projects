# Unit Conversion Tool

A versatile and user-friendly unit conversion tool built with Next.js and React that allows users to convert between different units of measurement in real-time.

![Unit Conversion Tool Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/unit-conversion-tool.png?updatedAt=1748877979617)

## Features

- **Multiple Conversion Types**:
  - Weight (pounds, ounces, stones, kilograms, grams)
  - Temperature (fahrenheit, celsius, kelvin)
  - Length (feet, inches, yards, miles, meters, cm, kilometers)
  - Speed (mph, kph, knots, mach)

- **Real-time Conversion**: Instantly see conversions as you type in any input field

- **Intuitive Interface**: Clean, card-based layout with grouped conversion types

- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Implementation Details

### Component Structure

The unit conversion tool is built with the following structure:

```
UnitConversionTool
├── Weight Converter Card
│   ├── Title
│   ├── Description
│   └── Input Fields
│       ├── Pounds
│       ├── Ounces
│       ├── Stones
│       ├── Kilograms
│       └── Grams
├── Temperature Converter Card
│   ├── Title
│   ├── Description
│   └── Input Fields
│       ├── Fahrenheit
│       ├── Celsius
│       └── Kelvin
├── Length Converter Card
│   ├── Title
│   ├── Description
│   └── Input Fields
│       ├── Feet
│       ├── Inches
│       ├── Yards
│       ├── Miles
│       ├── Meters
│       ├── Centimeters
│       └── Kilometers
└── Speed Converter Card
    ├── Title
    ├── Description
    └── Input Fields
        ├── MPH
        ├── KPH
        ├── Knots
        └── Mach
```

### State Management

- Uses React's `useState` hook to track all conversion values
- Implements `useCallback` for optimized event handlers
- Maintains a structured state object for all conversion types and units

### Conversion Logic

- Predefined conversion factors and formulas for accurate unit conversions
- Support for both simple multiplication-based conversions and complex formula-based conversions
- Real-time calculation as users type in any input field

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- UI components from a shared component library
- Helper functions for text capitalization

## Accessibility

The unit conversion tool implements the following accessibility features:

- Semantic HTML structure
- Labeled form controls
- Clear visual hierarchy
- Responsive design for all screen sizes

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 