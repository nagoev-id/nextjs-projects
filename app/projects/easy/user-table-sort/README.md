# User Table Sort

A Next.js application for displaying, sorting, and filtering user data in an interactive table with a clean interface.

![User Table Sort Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/user-table-sort.png?updatedAt=1748975569710)

## Features

- **Multi-column Sorting**: Sort table data by any column with a single click
- **Directional Sorting**: Toggle between ascending and descending order
- **Real-time Search**: Filter table data as you type in the search box
- **Visual Indicators**: Clear arrows showing current sort column and direction
- **Responsive Table Design**: Properly displays on all device sizes
- **Optimized Performance**: Uses memoization to prevent unnecessary re-renders
- **Keyboard Accessibility**: Fully navigable using keyboard controls
- **Data Persistence**: Maintains sort preferences during filtering operations
- **Clean UI**: Modern, minimalist design for easy readability

## Implementation Details

### Component Structure

The application is built with the following structure:

```
UserTableSortPage
├── Search Section
│   └── Search Input
├── Table Component
│   ├── Table Headers
│   │   └── Sort Buttons with Indicators
│   └── Table Rows
│       └── User Data Cells
└── Pagination (optional)
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useMemo for efficient data sorting and filtering
- Tracks sort key and sort order in separate states
- Maintains search query with React Hook Form

### Sorting Logic

- Supports sorting by any column in the table
- Toggles between ascending and descending order
- Provides visual indicators for current sort direction
- Implements optimized sorting algorithm with memoization
- Maintains sort order during filtering operations

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Hook Form with Zod for search input validation
- Memoization techniques for performance optimization
- React Icons for sort direction indicators
- Mock data for demonstration purposes
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML table structure
- ARIA attributes for sort buttons
- Proper aria-sort values for sorting direction
- Keyboard navigable interface
- Focus management for interactive elements
- Screen reader friendly column headers

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
4. Open [http://localhost:3000/projects/easy/user-table-sort](http://localhost:3000/projects/easy/user-table-sort) in your browser

## Data Source

The application uses a static JSON file with mock user data for demonstration purposes. In a production environment, this could be replaced with an API call to fetch real user data.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 