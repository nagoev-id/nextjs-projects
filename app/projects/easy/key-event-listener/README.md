# Key Event Listener

![Key Event Listener Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/key-event-listener.png?updatedAt=1748869576697)

## 📋 Description

A simple interactive tool that displays information about keyboard key presses in real-time. When a user presses any key on their keyboard, the application shows both the key character and its corresponding key code.

## 🚀 Features

- Real-time display of pressed keys
- Shows both key character and key code
- Special handling for space and other special keys
- Mobile device detection with appropriate messaging
- Clean, responsive UI with visual feedback

## 🛠️ Technologies

- Next.js with App Router
- React Hooks (useState, useEffect, useCallback, useMemo)
- TypeScript for type safety
- Tailwind CSS for styling
- Custom Card component

## 🧠 Implementation Details

- Uses event listeners to capture keyboard events
- Implements device detection to provide appropriate UI for mobile users
- Cleans up event listeners on component unmount to prevent memory leaks
- Provides accessible UI with appropriate ARIA attributes

## 📚 How It Works

1. The application initializes with a "Press any key" message
2. When a key is pressed, the event listener captures the key information
3. The UI updates to display:
   - The key character (or "Space" for the spacebar)
   - The key code (e.g., "KeyA" for the A key)
4. On mobile devices, where keyboard events may not be available, it displays an informative message

## 📱 Responsive Design

The interface adapts to different screen sizes:
- Larger text and display on desktop screens
- Compact layout on mobile devices
- Clear visual hierarchy regardless of device

## 🔒 Accessibility

- Properly labeled elements with ARIA attributes
- Keyboard navigable interface
- High contrast text for readability

## 🧪 Learning Outcomes

This project demonstrates:
- Event handling in React
- State management with hooks
- Conditional rendering
- Device detection techniques
- Performance optimization with memoization 