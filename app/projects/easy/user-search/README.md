# User Search Component

A lightweight and responsive user search application built with React and TypeScript. This component generates random user data and provides real-time search functionality with optimized performance.

![User Search Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/user-search.png?updatedAt=1748868384732)

## Features

- **Random User Generation**: Creates 30 random users with realistic data using Faker.js
- **Real-time Search**: Instantly filters users as you type in the search field
- **Performance Optimized**: Implements debounce technique to prevent excessive re-renders
- **Comprehensive Search**: Searches across first name, last name, and job area fields
- **Responsive Design**: Adapts seamlessly to different screen sizes
- **Loading States**: Provides visual feedback during data generation
- **Error Handling**: Gracefully handles and displays any errors that occur
- **Empty State**: Shows appropriate message when no users match the search criteria
- **Accessibility Support**: Includes proper ARIA attributes for screen readers
- **Clean UI**: Minimalist design with clear visual hierarchy

## Implementation Details

### Component Structure

The user search consists of two main parts:

1. **Search Input**: For filtering users based on text input
2. **Results Display**: Shows filtered users in a scrollable list

### State Management

The component uses React's hooks for efficient state management:

- `useState` for tracking users data, search query, loading state, and errors
- `useEffect` for generating random users on component mount
- `useCallback` for memoizing the filter function
- `useMemo` for caching filtered results
- `useDebounce` custom hook for optimizing search performance

### Search Logic

The search functionality implements an efficient approach:

1. Creates a searchable text field for each user by combining name, last name, and job area
2. Converts both search query and searchable text to lowercase for case-insensitive matching
3. Implements 300ms debounce to reduce unnecessary filtering operations
4. Caches filtered results with useMemo to prevent redundant calculations

### Code Example

```tsx
// Basic usage of the user search component
import UserSearch from './UserSearch';

const App = () => {
  return (
    <div className="container">
      <UserSearch />
    </div>
  );
};
```

## Technical Implementation

The component leverages:

- **React Hooks**: For state management and side effects
- **TypeScript**: For type safety and better developer experience
- **Faker.js**: For generating realistic random user data
- **Debounce**: For optimizing search input performance
- **Memoization**: For preventing unnecessary re-renders and calculations
- **Shadcn UI Components**: Card and Input components for consistent styling
- **Flex & Grid Layout**: For responsive design across different screen sizes
- **Error Boundaries**: For graceful error handling

### User Data Structure

Each user object contains the following properties:

```typescript
type User = {
  id: string;         // Unique identifier
  firstName: string;  // User's first name
  lastName: string;   // User's last name
  jobArea: string;    // User's profession
  searchText: string; // Combined text for searching
}
```

## Performance Considerations

The component includes several optimizations:

- Debounced search input to reduce render frequency during typing
- Memoized filter function to prevent recreation on each render
- Cached filtered results to avoid redundant calculations
- Proper cleanup of side effects to prevent memory leaks
- Conditional rendering to optimize DOM updates
- Virtualized scrolling for handling large user lists efficiently

## Use Cases

This user search component is ideal for:

- Contact directories
- Employee databases
- Customer management systems
- User administration interfaces
- Any application requiring quick user lookup functionality

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 