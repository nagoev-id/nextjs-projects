# Character Counter Component

A responsive and efficient text analysis tool built with React and TypeScript. This component provides real-time statistics about text input, including character count, word count, spaces, and letters.

![Character Counter Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/character-counter.png?updatedAt=1748864539445)

## Features

- **Real-time Analysis**: Instantly updates statistics as you type
- **Multiple Metrics**: Tracks characters, words, spaces, and letters
- **Performance Optimized**: Uses debouncing to prevent excessive calculations during rapid typing
- **Clean Interface**: Simple, intuitive design with clear visual presentation of metrics
- **Accessibility**: Fully accessible with proper ARIA attributes for screen readers
- **Responsive Design**: Works seamlessly across all device sizes
- **Unicode Support**: Correctly counts characters in multi-language text including emojis

## Implementation Details

### Component Structure

The character counter consists of two main parts:

1. **Text Input Area**: A textarea where users can enter or paste text
2. **Statistics Display**: A grid showing four key metrics about the entered text

### State Management

The component uses React's `useState` hook to track:

- The current text input
- Statistics calculated from the text (characters, words, spaces, letters)

### Text Analysis

The application implements several text analysis functions:

- Character counting (total length of the text)
- Word counting (splitting by whitespace and filtering empty strings)
- Space counting (matching whitespace characters)
- Letter counting (using Unicode-aware regex pattern matching)

### Code Example

```tsx
// Basic usage of the character counter component
import CharacterCounter from './CharacterCounter';

const App = () => {
  return (
    <div className="container">
      <CharacterCounter />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useEffect`, `useCallback`, `useMemo`)
- **TypeScript**: For type safety with interfaces like `Stats` and `StatItem`
- **Lodash**: For debouncing the text analysis function
- **Shadcn UI Components**: Textarea and Card components for consistent styling
- **Unicode-aware Regex**: For accurate letter counting across languages

### Performance Optimization

To ensure smooth performance even with large text inputs, the component:

- Implements 300ms debouncing on text analysis
- Memoizes the debounced function to prevent unnecessary recreations
- Properly cleans up debounced functions when unmounting

## Accessibility

The character counter implements:

- Semantic HTML structure
- ARIA live regions for announcing statistic changes
- Descriptive labels for all interactive elements
- Keyboard navigation support
- High contrast visual design

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 