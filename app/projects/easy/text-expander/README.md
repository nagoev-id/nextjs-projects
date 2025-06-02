# Text Expander Component

A flexible and customizable text expansion component built with React and TypeScript. This component allows for the elegant display of long text content with "show more/less" functionality, providing a clean user experience when dealing with lengthy content.

![Text Expander Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/text-expander.png?updatedAt=1748867856576)

## Features

- **Collapsible Text**: Show a limited number of words with an option to expand
- **Customizable Word Limit**: Set how many words to display in collapsed state
- **Custom Button Text**: Personalize the expand/collapse button labels
- **Custom Button Color**: Change button text color to match your design
- **Initial State Control**: Choose whether text starts expanded or collapsed
- **Smooth Transitions**: Elegant animations when expanding or collapsing
- **Responsive Design**: Works well across all device sizes
- **Accessibility Support**: Proper ARIA attributes for screen readers

## Implementation Details

### Component Structure

The text expander consists of two main parts:

1. **Main Component**: The page component that demonstrates different configurations
2. **ExpandableText Component**: The reusable core component that handles the expansion logic

### Props and Customization

The ExpandableText component accepts several props for customization:

- `children`: The content to be displayed (text or React elements)
- `collapsedNumWords`: Maximum number of words to show when collapsed (default: 20)
- `expandButtonText`: Text for the expand button (default: "Show more")
- `collapseButtonText`: Text for the collapse button (default: "Show less")
- `buttonColor`: Color for the button text in HEX format (default: "111111")
- `expanded`: Initial expansion state (default: false)
- `className`: Additional CSS classes for styling

### State Management

The component uses React's `useState` hook to track:

- Whether the text is currently expanded or collapsed

### Text Processing

The component includes logic to:

- Split text into words for accurate truncation
- Add ellipsis to truncated text
- Handle both string and non-string children
- Determine whether a toggle button is needed based on content length

### Code Example

```tsx
// Basic usage of the expandable text component
import { ExpandableText } from './components';

const App = () => {
  return (
    <div className="container">
      <ExpandableText>
        This is a long text that will be truncated when displayed.
        Users can click the button to see the full content.
      </ExpandableText>
      
      {/* With custom settings */}
      <ExpandableText 
        collapsedNumWords={10}
        expandButtonText="Read more"
        collapseButtonText="Read less"
        buttonColor="0000FF"
        expanded={true}
      >
        This example starts expanded and has custom button text and color.
      </ExpandableText>
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management (`useState`, `useCallback`, `useMemo`)
- **TypeScript**: For type safety with interfaces like `ExpandableTextProps`
- **Conditional Rendering**: To display either truncated or full content
- **CSS Transitions**: For smooth height animations when expanding/collapsing
- **Utility Functions**: For text processing and button color handling

### Performance Optimizations

The component implements several optimizations:

- Memoization of computed values with `useMemo`
- Memoization of callback functions with `useCallback`
- Conditional rendering to avoid unnecessary DOM updates
- Efficient text truncation that only processes when needed

## Use Cases

This component is ideal for:

- Blog post previews
- Product descriptions
- FAQ sections
- Comment sections
- Any content where space is limited but full information should be accessible

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 