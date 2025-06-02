# Dropdown UI

A clean and interactive dropdown component built with Next.js and React that provides a customizable menu with icon support and accessibility features.

![Dropdown UI Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/dropdown-ui.png?updatedAt=1748877979745)

## Features

- **Interactive Toggle**: Clean dropdown toggle with animated chevron indicator
- **Icon Support**: Each menu item includes an icon from the react-icons library
- **Outside Click Detection**: Automatically closes when clicking outside the dropdown
- **Accessibility**: Implements ARIA attributes for screen reader support
- **Smooth Animations**: Transitions for opening, closing, and icon rotation
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Implementation Details

### Component Structure

The dropdown UI component is built with the following structure:

```
DropdownUI
├── Toggle Button
│   ├── Label Text
│   └── Chevron Icon (animated)
└── Dropdown Menu
    ├── Menu Item 1
    │   ├── Icon
    │   └── Label
    ├── Menu Item 2
    │   ├── Icon
    │   └── Label
    ├── Menu Item 3
    │   ├── Icon
    │   └── Label
    └── ...Additional Items
```

### State Management

- Uses React's `useState` hook to track the open/closed state of the dropdown
- Implements `useRef` to maintain a reference to the dropdown DOM element for outside click detection
- Uses `useEffect` for adding and removing document-level event listeners
- Implements cleanup to prevent memory leaks

### User Interaction

- Toggle button opens and closes the dropdown
- Clicking outside the dropdown automatically closes it
- Visual feedback with chevron rotation indicates current state
- Smooth transitions provide a polished user experience

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- React Icons for menu item icons
- CSS for styling and animations

## Accessibility

The dropdown UI implements the following accessibility features:

- ARIA attributes (`aria-expanded`, `aria-haspopup`, `aria-controls`)
- Semantic HTML with proper roles (`role="menu"`, `role="menuitem"`)
- Keyboard accessibility
- Screen reader support

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 