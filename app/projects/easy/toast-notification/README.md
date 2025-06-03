# Toast Notification

A flexible and reusable toast notification system built with Next.js and React that provides stylish, temporary notifications with different severity levels and automatic dismissal.

![Toast Notification Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/toast-notification.png?updatedAt=1748939633206)

## Features

- **Multiple Toast Types**: Support for success, error, warning, and info notifications
- **Distinctive Styling**: Each notification type has its own color scheme and icon
- **Automatic Dismissal**: Notifications disappear automatically after a set time
- **Manual Dismissal**: Users can close notifications manually
- **Stacked Display**: Multiple notifications stack neatly in the corner
- **Animation Effects**: Smooth appear and disappear animations
- **Custom Configuration**: Configurable appearance and behavior

## Implementation Details

### Component Structure

The toast notification system is built with the following structure:

```
ToastNotificationPage
├── Toast Buttons
│   ├── Success Button
│   ├── Error Button
│   ├── Warning Button
│   └── Info Button
└── Toast Container
    └── Toast Items
        ├── Icon
        ├── Message
        └── Close Button
```

### State Management

- Uses custom `useToasts` hook to manage toast state
- Implements UUID generation for unique toast identification
- Uses `useCallback` for optimized event handlers
- Manages toast addition and removal operations
- Implements automatic toast removal via timeouts

### Toast Configuration

- Centralizes toast appearance configuration in a constants object
- Defines distinct visual styles for each notification type
- Configures toast lifetime duration
- Sets up icon and message templates for different toast types
- Maintains consistent styling through configuration

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Custom hooks for toast state management
- React Icons for notification icons
- CSS animations for smooth transitions
- UI components from a shared component library

## User Experience

The toast notification system provides:

- Unobtrusive notifications that don't interrupt workflow
- Clear visual differentiation between notification types
- Informative messages with appropriate icons
- Automatic cleanup to avoid UI clutter
- Option for users to dismiss notifications manually
- Smooth animations for a polished feel

## Accessibility

The toast notification system implements the following accessibility features:

- Proper ARIA roles for notifications
- Screen reader announcements for new toasts
- Keyboard accessible close buttons
- Sufficient color contrast for readability
- Appropriate focus management

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 