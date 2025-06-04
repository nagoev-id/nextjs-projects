# Password Strength Checker

A Next.js application for real-time evaluation of password strength with visual feedback and improvement suggestions.

![Password Strength Checker Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/password-strength-checker.png?updatedAt=1748975564093)

## Features

- **Real-time Analysis**: Instant evaluation as you type your password
- **Visual Strength Meter**: Color-coded bars indicating password strength level
- **Password Visibility Toggle**: Show/hide password content with a single click
- **Strength Classification**: Clear categorization as weak, medium, or strong
- **Contextual Feedback**: Tailored suggestions for improving password strength
- **Multi-criteria Evaluation**: Checks length, character types, and complexity
- **Color-coded Indicators**: Red, yellow, and green indicators for different strength levels
- **Responsive Design**: Works seamlessly on all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
PasswordStrengthCheckerPage
├── Password Input Section
│   ├── Password Field
│   └── Visibility Toggle Button
└── Strength Indicator Section (conditional)
    ├── Strength Meter Bars
    ├── Strength Classification Text
    └── Improvement Suggestions
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useMemo for efficient strength calculation
- Tracks password input and visibility state
- Calculates strength based on multiple security criteria

### Strength Calculation

- Evaluates password against 5 security criteria:
  - Minimum length (8+ characters)
  - Presence of lowercase letters
  - Presence of uppercase letters
  - Presence of numbers
  - Presence of special characters
- Maps criteria fulfillment to strength levels
- Provides contextual feedback based on strength level

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Regular expressions for pattern matching
- Dynamic styling based on strength level
- React Icons for visual elements
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for password visibility toggle
- ARIA meter role for strength indicator
- Screen reader friendly strength feedback
- Keyboard navigable interface
- Proper label associations
- Color coding with text reinforcement

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000/projects/easy/password-strength-checker](http://localhost:3000/projects/easy/password-strength-checker) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 