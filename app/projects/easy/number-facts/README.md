# Number Facts Component

An interactive application that retrieves and displays interesting facts about numbers using the Numbers API. This component allows users to enter a number and discover fascinating trivia about it, with a clean interface and seamless user experience.

![Number Facts Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/number-facts-1.png?updatedAt=1748867479019)
![Number Facts Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/number-facts-2.png?updatedAt=1748867479019)

## Features

- **Number Trivia**: Get interesting facts about any number from 1 to 300
- **Real-time Validation**: Form validation ensures valid input before submission
- **Loading States**: Visual feedback during API requests with a spinner
- **Copy Functionality**: One-click copying of facts to clipboard
- **Error Handling**: Graceful error handling with user-friendly messages
- **Reset Option**: Clear form and results with a reset button
- **Responsive Design**: Works seamlessly across all device sizes
- **Accessibility**: Fully accessible with proper ARIA attributes

## Implementation Details

### Component Structure

The number facts component consists of:

1. **Input Form**: A validated input field for entering numbers
2. **Control Buttons**: Submit and reset buttons with appropriate states
3. **Results Display**: Area showing the retrieved fact with a copy button
4. **Loading Indicator**: Spinner that appears during API requests

### State Management

The component uses React's hooks to manage several states:

- Form state with validation using React Hook Form
- API request state (loading, data, error) using a custom useAxios hook
- UI state to track whether a request has been made

### API Integration

The application connects to the Numbers API:

- Makes HTTP requests to `numbersapi.com/{number}`
- Handles responses and errors appropriately
- Provides feedback during the request lifecycle

### Code Example

```tsx
// Basic usage of the number facts component
import NumberFacts from './NumberFacts';

const App = () => {
  return (
    <div className="container">
      <NumberFacts />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useCallback`)
- **React Hook Form**: For form handling with validation
- **Zod**: For schema-based form validation
- **Custom useAxios Hook**: For managing API request states
- **TypeScript**: For type safety with custom types
- **Shadcn UI Components**: Card, Button, and Form components for consistent styling
- **Toast Notifications**: For error messages via Sonner

### Form Validation

The number input is validated using Zod with these rules:

- Input must be a valid number
- Value must be between 1 and 300
- Real-time validation with onChange mode

## User Experience

The component provides a smooth user experience:

- Immediate feedback on input validity
- Clear visual indication of loading state
- Easy-to-read display of number facts
- Simple copying mechanism for sharing facts
- Ability to reset and try different numbers

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 