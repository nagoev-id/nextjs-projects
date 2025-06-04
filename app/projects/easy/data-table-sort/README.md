# Data Table Sort

A Next.js application for sorting and filtering tabular data with a clean and intuitive interface.

![Data Table Sort Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/data-table-sort.png?updatedAt=1748975557105)

## Features

- **Dynamic Data Loading**: Fetches user data from an external API
- **Column Selection**: Choose which columns to include in search operations
- **Real-time Search**: Filter table data as you type
- **Responsive Table Design**: Properly displays on all device sizes
- **Error Handling**: Graceful error states with user notifications
- **Loading States**: Visual feedback during data fetching
- **Case-insensitive Search**: Search works regardless of text casing
- **Column Headers**: Dynamically generated based on available data

## Implementation Details

### Component Structure

The application is built with the following structure:

```
DataTableSortPage
├── Search Controls
│   ├── Search Input
│   └── Column Selection Checkboxes
└── Data Table
    ├── Table Headers
    └── Table Rows
        └── Data Cells
```

### State Management

- Uses React hooks for local state management
- Implements useCallback and useMemo for performance optimization
- Handles loading, error, and data states for API calls
- Manages user search preferences with column selection
- Maintains filtered data based on search query

### User Interaction

- Type in the search box to filter data in real-time
- Select/deselect columns to include in search operations
- View formatted user data in a structured table layout
- Receive visual feedback for loading and error states

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- React Hook Form with Zod for search input validation
- Sonner for toast notifications
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML table structure
- Proper ARIA attributes for interactive elements
- Loading state indicators
- Error message announcements
- Keyboard navigable interface

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
4. Open [http://localhost:3000/projects/easy/data-table-sort](http://localhost:3000/projects/easy/data-table-sort) in your browser

## API Integration

The application uses the JSONPlaceholder API to fetch user data. The API calls are handled using Axios and include proper error handling and loading states.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 