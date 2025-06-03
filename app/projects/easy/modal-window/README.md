# Modal Window

A versatile and accessible modal window component built with Next.js and React that provides multiple closing methods for enhanced user experience.

![Modal Window Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/modal-window.png?updatedAt=1748937197195)

## Features

- **Multiple Closing Methods**:
  - Close button (X) in the top-right corner
  - Dedicated "Close Modal" button
  - Click outside the modal area (overlay)
  - Keyboard support (Escape key)

- **Accessibility Features**: 
  - Proper focus management
  - ARIA attributes for screen readers
  - Keyboard navigation support

- **Clean UI**: Minimal, responsive design with clear visual hierarchy

- **Reusable Component**: Easy to integrate into any Next.js project

## Implementation Details

### Component Structure

The modal window component is built with the following structure:

```
ModalWindow
├── Trigger Button ("Open Modal")
└── Modal Dialog (conditionally rendered)
    ├── Overlay (darkened background)
    ├── Modal Content Container
    │   ├── Close Button (X icon)
    │   ├── Title
    │   ├── Content Text
    │   └── Close Modal Button
    └── Event Handlers (click, keyboard)
```

### State Management

- Uses React's `useState` hook to track modal open/closed state
- Implements `useRef` to reference the modal DOM element for outside click detection
- Uses `useCallback` for optimized event handlers
- Implements `useEffect` for keyboard event handling

### User Interaction

- Opens with a button click
- Multiple intuitive ways to close the modal
- Visual feedback with overlay dimming the background
- Smooth transitions for a polished feel

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Icons for the close icon
- UI components from a shared component library
- Event delegation for efficient event handling

## Accessibility

The modal window implements the following accessibility features:

- Proper focus management when opening/closing
- Keyboard navigation with Escape key support
- Appropriate ARIA attributes
- Semantic HTML structure

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 