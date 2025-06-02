# Company Statistics Component

An engaging animated statistics display built with React and TypeScript. This component presents company metrics with smooth counting animations that increase from zero to target values, creating a visually appealing and interactive data presentation.

![Company Statistics Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/company-statistics.png?updatedAt=1748864893646)

## Features

- **Animated Counters**: Numbers that count up from zero to target values
- **Customizable Animation Speed**: Different metrics can animate at different rates
- **Responsive Layout**: Adapts from single column on mobile to three columns on larger screens
- **Clean Design**: Minimalist interface that highlights the important metrics
- **Performance Optimized**: Efficient animation implementation with cleanup to prevent memory leaks
- **Accessibility Support**: Proper ARIA attributes for screen readers
- **Configurable Metrics**: Easily customizable statistics with labels and target values

## Implementation Details

### Component Structure

The company statistics component consists of two main parts:

1. **Main Container**: A card that holds the title and statistics grid
2. **Individual Stat Items**: Each containing an animated counter and descriptive label

### Animation Logic

The component implements a counting animation using:

- React's `useState` and `useEffect` hooks to manage counter state
- `setTimeout` to create the animation effect with configurable speed
- Incremental counting that stops when the target value is reached
- Performance optimizations to ensure smooth animations

### Customization Options

Each statistic can be configured with:

- **Target Value**: The final number the counter will reach
- **Label**: Descriptive text explaining what the statistic represents
- **Speed**: Animation rate (higher values = faster counting)

### Code Example

```tsx
// Basic usage of the company statistics component
import CompanyStatistics from './CompanyStatistics';

const App = () => {
  return (
    <div className="container">
      <CompanyStatistics />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useEffect`)
- **TypeScript**: For type safety with custom types like `StatItems`
- **Shadcn UI Components**: Card component for consistent styling
- **CSS Grid**: For responsive layout across different screen sizes
- **Functional State Updates**: To safely handle asynchronous state changes
- **Dynamic Timing Calculations**: To adjust animation speed based on configuration

### Default Statistics

The component includes sample statistics focused on company achievements:

- 120+ Succeeded projects
- 140+ Working hours spent
- 150+ Happy clients

Each statistic animates at a different speed for visual variety.

## Accessibility

The statistics component implements:

- Semantic HTML structure with proper heading hierarchy
- ARIA live regions for announcing changing values
- ARIA labels and roles for improved screen reader experience
- Atomic updates to ensure proper announcement of changes

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 