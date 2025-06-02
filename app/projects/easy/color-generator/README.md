# Color Generator

A sleek and interactive random color generator built with React and TypeScript. This application allows users to generate random colors, view them in different formats, and easily copy color values to the clipboard.

![Color Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/color-generator.png?updatedAt=1748861739643)

## Features

- **Random Color Generation**: Generate random colors with a single click
- **Multiple Color Formats**: Toggle between HEX and RGB color formats
- **One-Click Copy**: Copy color values to clipboard with a button click
- **Keyboard Shortcut**: Press the space bar to quickly copy the current color
- **Visual Feedback**: See the generated color in a preview box
- **Copy Confirmation**: Visual indicator when a color is copied
- **Dark Mode Support**: Optimized interface for both light and dark themes

## Implementation Details

### Component Structure

The color generator consists of:

- A color preview area showing the current color
- A text display of the current color value (HEX or RGB)
- Control buttons for generating colors and switching formats
- A copy button with status indicator

### State Management

The component uses React's `useState` hook to track:

- Current color value (in HEX format)
- Display format (HEX or RGB)
- Copy status (for showing the "Copied!" indicator)

### Color Manipulation

The application includes:

- Random HEX color generation
- Conversion between HEX and RGB formats
- Clipboard integration for copying color values

### Code Example

```tsx
// Basic usage of the color generator component
import ColorGenerator from './ColorGenerator';

const App = () => {
  return (
    <div className="container">
      <ColorGenerator />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useEffect`, `useCallback`, `useMemo`)
- **TypeScript**: For type safety with custom types like `ColorFormat`
- **Shadcn UI Components**: Card and Button components for consistent styling
- **Memoization**: Performance optimizations to prevent unnecessary re-renders
- **Event Listeners**: Keyboard shortcuts via event handling

### Helper Functions

- `generateRandomHexColor()`: Creates a random HEX color code
- `convertHexToRgb()`: Transforms HEX colors to RGB format
- `copyToClipboard()`: Handles copying text to the system clipboard

## Accessibility

The color generator implements:

- Descriptive aria-labels for all interactive elements
- Keyboard navigation and shortcuts
- Focus management for improved usability
- Disabled states to prevent actions during copy feedback

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 