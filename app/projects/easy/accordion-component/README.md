# Accordion Component

An interactive and customizable accordion component built with React, TypeScript, and CSS. This component provides two different accordion behaviors: one that allows multiple sections to be open simultaneously and another that closes previously opened sections when a new one is opened.

![Accordion Component Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/accordion-component.png?updatedAt=1748861739643)

## Features

- **Two Accordion Types**:
  - Type 1: Allows multiple sections to be open simultaneously
  - Type 2: Closes previously opened sections when a new one is opened
  
- **Smooth Animations**: CSS transitions provide smooth opening and closing animations

- **Accessible Design**: Implements ARIA attributes for better accessibility

- **Responsive Layout**: Adapts to different screen sizes with a two-column layout on larger screens

## Implementation Details

### Component Structure

The accordion component is built with the following structure:

```
Accordion
├── Column (Type 1: Multiple open sections)
│   ├── Title
│   ├── Description
│   └── Accordion Items (4)
│       ├── Header
│       └── Content
└── Column (Type 2: Single open section)
    ├── Title
    ├── Description
    └── Accordion Items (4)
        ├── Header
        └── Content
```

### State Management

- Uses React's `useState` hook to track which accordion items are open
- Maintains separate open state for each accordion type
- Implements conditional logic based on the `isClosed` property to determine behavior

### Styling

- Custom CSS with variables for consistent spacing and colors
- Responsive design with grid layout
- Visual feedback on hover and active states
- Smooth height transitions for opening/closing content

## Code Example

```tsx
// Example usage of the accordion component
import AccordionComponent from './AccordionComponent';

const App = () => {
  return (
    <div className="container">
      <AccordionComponent />
    </div>
  );
};
```

## Technical Implementation

The component uses:

- React hooks for state management
- Refs to measure content height for smooth animations
- TypeScript for type safety
- CSS variables for consistent styling
- Icon components from react-icons library

## Accessibility

The accordion implements the following accessibility features:

- ARIA attributes (`aria-expanded`, `aria-controls`)
- Semantic HTML structure
- Keyboard navigable interface

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 