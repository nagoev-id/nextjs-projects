# Password Generator

A Next.js application for generating secure passwords with customizable options and strength indicators.

![Password Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/password-generator.png?updatedAt=1748975562884)

## Features

- **Custom Password Length**: Adjust password length from 1 to 30 characters
- **Character Options**: Include lowercase, uppercase, numbers, and special characters
- **Password Strength Indicator**: Visual feedback on password security level
- **Copy to Clipboard**: Easily copy generated passwords with one click
- **Real-time Generation**: Password updates instantly as options change
- **Responsive Design**: Works seamlessly on all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
PasswordGeneratorPage
├── Password Display
│   ├── Generated Password Field
│   └── Copy to Clipboard Button
├── Strength Indicator
├── Length Control
│   ├── Length Slider
│   └── Length Display
└── Character Options
    ├── Lowercase Letters Toggle
    ├── Uppercase Letters Toggle
    ├── Numbers Toggle
    └── Special Characters Toggle
```

### State Management

- Uses Redux for global state management
- Implements password generation algorithm based on selected options
- Uses strength assessment logic to evaluate password security
- Manages option toggles with individual state tracking
- Implements efficient password regeneration on option changes

### User Interaction

- Adjust password length using an intuitive slider
- Toggle character types with checkboxes
- Copy password to clipboard with a single click
- Visual feedback for password strength (weak, medium, strong)
- Instant password regeneration when options change

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit for state management
- TypeScript for type safety
- Tailwind CSS for styling
- Custom CSS for strength indicator visualization
- React Icons for UI elements
- Clipboard API for copy functionality

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigable controls
- Visual indicators with text alternatives
- Sufficient color contrast for strength indicators

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
4. Open [http://localhost:3000/projects/medium/password-generator](http://localhost:3000/projects/medium/password-generator) in your browser

## Password Security

The application generates passwords using a combination of character sets:
- Lowercase letters (a-z)
- Uppercase letters (A-Z)
- Numbers (0-9)
- Special characters (!@#$%^&*()_+~`|}{[]:;?><,./-=)

Password strength is evaluated based on:
- Length of the password
- Variety of character types used
- Entropy of the generated password

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 