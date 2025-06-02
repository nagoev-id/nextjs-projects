# Dynamic Tabs

A flexible and reusable tab component system for Next.js applications that supports both horizontal and vertical tab layouts with a focus on accessibility and customization.

![Dynamic Tabs Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/dynamic-tabs.png?updatedAt=1748875312583)

## Features

- **Multiple Tab Orientations**: Support for both horizontal and vertical tab layouts
- **Flexible Architecture**: Uses render props pattern for maximum customization
- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation
- **Responsive Design**: Automatically adapts to different screen sizes
- **Semantic Markup**: Uses proper HTML semantics for better SEO and screen reader support

## Implementation Details

### Component Structure

The dynamic tabs component is built with the following structure:

```
DynamicTabsPage
├── Horizontal Tabs Container
│   ├── Tab List (role="tablist")
│   │   ├── Tab 1 (role="tab")
│   │   ├── Tab 2 (role="tab")
│   │   └── Tab 3 (role="tab")
│   └── Tab Content
│       ├── Panel 1 (role="tabpanel")
│       ├── Panel 2 (role="tabpanel")
│       └── Panel 3 (role="tabpanel")
└── Vertical Tabs Container
    ├── Tab List (role="tablist")
    │   ├── Tab 1 (role="tab")
    │   ├── Tab 2 (role="tab")
    │   └── Tab 3 (role="tab")
    └── Tab Content
        ├── Panel 1 (role="tabpanel")
        ├── Panel 2 (role="tabpanel")
        └── Panel 3 (role="tabpanel")
```

### State Management

- Uses React's `useState` hook to track active tab index
- Implements `useCallback` for optimized event handlers
- Uses `useMemo` for calculated values like container classes

### Render Props Pattern

- Separates container logic from presentation
- Allows for flexible customization of tab appearance and content
- Enables reuse across different parts of the application

## Code Example

```tsx
// Example usage of the tabs component
<TabsContainer
  title="Horizontal Tabs"
  isVertical={false}
  renderTabs={(isVertical, activeIndex, tabsCount, handleTabClick) => (
    // Custom tab rendering logic
  )}
  renderTabContent={(activeIndex, tabsCount) => (
    // Custom content rendering logic
  )}
  tabsCount={3}
/>
```

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interface definitions
- CSS for styling and responsive design
- ARIA attributes for accessibility

## Accessibility

The tabs component implements the following accessibility features:

- ARIA roles (`tablist`, `tab`, `tabpanel`)
- ARIA attributes (`aria-selected`, `aria-controls`, `aria-labelledby`, `aria-orientation`)
- Keyboard navigation support (Enter, Space)
- Proper focus management
- Semantic HTML structure

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 