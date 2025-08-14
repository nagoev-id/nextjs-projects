# Number to Word Converter

An interactive React component that converts numeric values into their complete written word representation. This application provides a seamless way to transform numbers into readable text format, perfect for check writing, document generation, or educational purposes.

## Features

- **Wide Range Support**: Converts numbers from 0 to 999,999,999 (up to billions)
- **Real-time Validation**: Form validation ensures valid input before conversion
- **Instant Conversion**: Fast processing with immediate results display
- **Copy Functionality**: One-click copying of converted text to clipboard
- **Error Handling**: Graceful error handling with user-friendly toast notifications
- **Reset Option**: Clear form and results with a reset button
- **Responsive Design**: Works seamlessly across all device sizes
- **Accessibility**: Fully accessible with proper ARIA attributes

## Implementation Details

### Component Structure

The number to word converter consists of:

1. **Input Form**: A validated number input field with real-time validation
2. **Control Buttons**: Convert, copy, and reset buttons with appropriate states
3. **Results Display**: Textarea showing the converted text in readable format
4. **Error Handling**: Toast notifications for conversion errors

### State Management

The component uses React's hooks to manage:

- Form state with validation using React Hook Form
- Conversion result state for displaying the text output
- UI state management for button interactions and validation

### Conversion Algorithm

The application implements an efficient number-to-words algorithm:

- Breaks down numbers into chunks of thousands (ones, thousands, millions, billions)
- Handles special cases for teens (11-19) and irregular numbers
- Supports negative numbers with proper formatting
- Optimized for performance with large numbers

### Code Example

```tsx
// Basic usage of the number to word converter
import NumberToWordConverter from './NumberToWordConverter';

const App = () => {
  return (
    <div className="container">
      <NumberToWordConverter />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useCallback`)
- **React Hook Form**: For form handling with validation
- **Zod**: For schema-based form validation
- **TypeScript**: For type safety and better development experience
- **Shadcn UI Components**: Card, Button, Form, Label, and Textarea for consistent styling
- **Toast Notifications**: For error messages via Sonner

### Form Validation

The number input is validated using Zod with these rules:

- Input must be a valid integer
- Value must be between 1 and 999,999,999
- Real-time validation with onChange mode
- Proper error messages for invalid inputs

### Conversion Examples

- `0` → "zero"
- `123` → "one hundred twenty three"
- `1000` → "one thousand"
- `999999` → "nine hundred ninety nine thousand nine hundred ninety nine"
- `1000000` → "one million"
- `999999999` → "nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine"

## User Experience

The component provides a smooth user experience:

- Immediate feedback on input validity
- Clear visual indication of conversion state
- Easy-to-read display of converted text in a dedicated textarea
- Simple copying mechanism for sharing converted text
- Ability to reset and try different numbers
- Button states that prevent invalid operations

## File Structure

```
number-to-word-converter/
├── page.tsx                    # Main component with form and UI logic
├── layout.tsx                  # Next.js layout with metadata
├── README.md                   # Documentation
└── utils/
    ├── helpers.ts              # Core conversion algorithm
    ├── validate-schema.ts      # Zod validation schema
    └── index.ts               # Utility exports
```

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android
- Requires JavaScript enabled

## License

This project is part of a larger Next.js collection and is available under the MIT license.
