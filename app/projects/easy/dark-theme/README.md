# Dark Theme Component

A sleek and accessible theme switcher component built with React and Next.js. This component allows users to toggle between light, dark, and system themes with seamless transitions and persistent preferences.

![Dark Theme Component Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/dark-theme-component-1.png?updatedAt=1748863569485)
![Dark Theme Component Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/dark-theme-component-2.png?updatedAt=1748863569485)

## Features

- **Multiple Theme Options**: Switch between light, dark, and system-based themes
- **Persistent Preferences**: Theme selection is saved in localStorage and restored on page reload
- **System Integration**: Option to follow the user's system preferences automatically
- **Smooth Transitions**: Elegant animations when switching between themes
- **Visual Indicators**: Clear visual feedback showing the currently active theme
- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation
- **Responsive Design**: Works perfectly across all device sizes

## Implementation Details

### Component Structure

The dark theme switcher consists of two main components:

1. **Theme Display**: Shows the currently active theme
2. **Theme Toggle**: Dropdown menu for selecting between available themes

### State Management

The component leverages Next.js's theme management:

- Uses `next-themes` library for theme handling
- Accesses current theme state via the `useTheme` hook
- Provides both the selected theme (`theme`) and actually applied theme (`resolvedTheme`)

### Theme Options

Three theme options are available:

- **Light**: Forces light mode regardless of system settings
- **Dark**: Forces dark mode regardless of system settings
- **System**: Automatically follows the user's system preferences

### Code Example

```tsx
// Basic usage of the theme toggle component
import { ThemeToggle } from './ThemeToggle';

const App = () => {
  return (
    <div className="container">
      <ThemeToggle />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For accessing theme context and state
- **Next.js**: Integration with Next.js's app router
- **next-themes**: For theme management and persistence
- **Shadcn UI Components**: Dropdown menu, button, and card components
- **Lucide Icons**: Sun and moon icons for visual representation
- **TypeScript**: For type safety with custom types like `ThemeOption`

### Theme Provider Setup

The theme functionality requires:

- `ThemeProvider` wrapper around the application
- Configuration for available themes and default theme
- Storage mechanism for persisting user preferences

## Accessibility

The theme switcher implements:

- Proper ARIA labels for all interactive elements
- Screen reader announcements for theme changes
- Keyboard navigation support
- High contrast visual indicators
- Focus management for improved usability

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 