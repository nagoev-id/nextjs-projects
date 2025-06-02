# Alarm Clock

![Alarm Clock Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/alarm-clock.png?updatedAt=1748869576623)

## 📋 Description

A functional alarm clock application that displays the current time and allows users to set alarms for specific times. When the alarm time matches the current time, a visual notification is triggered.

## 🚀 Features

- Real-time clock display with seconds
- Set alarms with hour, minute, and AM/PM selection
- Visual alarm notification with animation
- Persistent alarm settings using localStorage
- Auto-clear functionality after alarm triggers
- Clean, responsive UI with intuitive controls

## 🛠️ Technologies

- Next.js with App Router
- React Hooks (useState, useEffect, useCallback, useMemo)
- TypeScript for type safety
- Tailwind CSS for styling
- React Icons for visual elements
- Custom hooks for storage management
- Sonner for toast notifications

## 🧠 Implementation Details

- Custom `useStorage` hook for persistent data storage
- Time formatting utilities
- Automatic time updates with setInterval
- Alarm state management
- Form validation for time selection
- Animation for visual alarm notification

## 📚 How It Works

1. The application displays the current time, updating every second
2. Users can select an alarm time using dropdown menus for hour, minute, and AM/PM
3. After setting an alarm, the form controls are disabled to prevent changes
4. When the current time matches the alarm time, the bell icon animates
5. The alarm automatically clears after 60 seconds
6. Users can manually clear the alarm at any time

## 📱 Responsive Design

The interface adapts to different screen sizes:
- Grid layout adjusts from single column to three columns
- Appropriate text sizing for different devices
- Consistent spacing and element sizing

## 🔒 Accessibility

- Semantic HTML structure
- Disabled states for form controls when appropriate
- Clear visual feedback for interactive elements
- Proper labeling of form controls

## 🧪 Learning Outcomes

This project demonstrates:
- Working with time in JavaScript
- Creating custom React hooks
- Managing complex state with multiple dependencies
- Implementing persistent storage
- Creating animations with CSS
- Form validation techniques 