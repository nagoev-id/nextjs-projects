# Price Range Slider

A Next.js application for selecting price ranges with a dual-handle slider and synchronized numeric inputs.

![Price Range Slider Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/price-range-slider.png?updatedAt=1748975566158)

## Features

- **Dual Range Slider**: Interactive slider with two handles for minimum and maximum values
- **Synchronized Inputs**: Numeric input fields that stay in sync with slider positions
- **Visual Range Indicator**: Colored track showing the selected price range
- **Constraint Enforcement**: Maintains minimum gap between values to prevent overlap
- **Bound Validation**: Ensures values stay within defined minimum and maximum limits
- **Step Control**: Configurable step size for precise value selection
- **Real-time Updates**: Instant visual feedback as values change
- **Responsive Design**: Adapts to different screen sizes with appropriate layouts
- **Accessible Controls**: ARIA attributes and keyboard navigation support

## Implementation Details

### Component Structure

The application is built with the following structure:

```
PriceRangeSliderPage
├── Input Controls
│   ├── Minimum Price Input
│   ├── Separator
│   └── Maximum Price Input
├── Slider Component
│   ├── Slider Track
│   ├── Progress Indicator
│   ├── Minimum Price Handle
│   └── Maximum Price Handle
└── Range Indicators
    ├── Minimum Value Label
    └── Maximum Value Label
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useMemo for efficient style calculations
- Maintains a unified state object for all slider parameters
- Enforces value constraints with validation logic

### Range Constraints

- Minimum value cannot be less than the absolute minimum (0)
- Maximum value cannot exceed the absolute maximum (10000)
- Enforces a minimum gap between values (1000)
- Automatically adjusts values to maintain constraints
- Step-based increments (100) for consistent selection

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Custom CSS for slider styling
- CSS variables for theme compatibility
- Fragment for efficient list rendering
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA labels for range inputs
- Keyboard navigable controls
- Screen reader friendly range information
- Proper input constraints and validation
- Presentation roles for decorative elements

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
4. Open [http://localhost:3000/projects/easy/price-range-slider](http://localhost:3000/projects/easy/price-range-slider) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 