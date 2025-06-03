# Tag Input Box

An interactive tag management component built with Next.js and React that allows users to create, display, and manage a collection of tags with persistence across sessions.

![Tag Input Box Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/tag-input-box.png?updatedAt=1748939633206)

## Features

- **Tag Creation**: Add tags by typing and pressing Enter or comma
- **Tag Deletion**: Remove individual tags with a click
- **Bulk Deletion**: Remove all tags at once with confirmation
- **Persistence**: Tags are saved to localStorage between sessions
- **Validation**: Prevents empty tags and duplicates
- **Tag Limit**: Maximum of 10 tags with remaining count display
- **Visual Feedback**: Toast notifications for actions
- **Responsive Design**: Works seamlessly on mobile and desktop

## Implementation Details

### Component Structure

The tag input box application is built with the following structure:

```
TagInputBoxPage
├── Instructions Text
├── Tags Container
│   ├── Tag Items
│   │   ├── Tag Text
│   │   └── Remove Icon
│   └── Input Field
├── Status Bar
│   ├── Remaining Tags Counter
│   └── Remove All Button
└── Confirmation Dialog (conditional)
    ├── Dialog Title
    ├── Dialog Description
    └── Action Buttons
        ├── Cancel Button
        └── Confirm Button
```

### State Management

- Uses React's `useState` hook to track tags collection
- Implements custom `useStorage` hook for localStorage persistence
- Uses `useRef` to maintain input field focus
- Implements `useCallback` for optimized event handlers
- Tracks remaining tag capacity with derived state
- Handles form submission and validation logic

### Validation Rules

- Tags cannot be empty strings
- Duplicate tags are not allowed (case-insensitive comparison)
- Maximum of 10 tags can be added
- Input field is disabled when the maximum limit is reached
- Confirmation required for bulk deletion

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Custom hooks for localStorage integration
- React Icons for visual elements
- AlertDialog component for confirmation
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The tag input box provides:

- Intuitive tag creation with multiple input methods
- Clear visual representation of tags
- Real-time feedback on remaining capacity
- Confirmation for destructive actions
- Success and error notifications
- Automatic focus on the input field
- Clean, accessible interface

## Accessibility

The tag input box implements the following accessibility features:

- Semantic HTML structure
- Keyboard navigation support
- ARIA attributes for interactive elements
- Role attributes for dynamic content
- Focus management
- Confirmation dialogs for destructive actions

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 