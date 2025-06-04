# Far Away

A Next.js application for creating and managing travel packing lists with an intuitive interface for trip preparation.

![Far Away Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/far-away.png?updatedAt=1748975560239)

## Features

- **Item Management**: Add, toggle, and remove items from your packing list
- **Quantity Selection**: Specify the quantity of each item you need to pack
- **Packing Status**: Mark items as packed and track your packing progress
- **Multiple Sorting Options**: Sort items by input order, description, or packing status
- **Packing Statistics**: View the total number of items and packing completion percentage
- **Bulk Actions**: Clear the entire list with confirmation dialog
- **Form Validation**: Ensures all required information is provided
- **Responsive Design**: Optimized for all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
FarAwayPage
├── Form Section
│   ├── Quantity Selector
│   ├── Description Input
│   └── Add Button
├── Controls Section
│   ├── Sorting Options
│   └── Clear List Button
├── Items List
│   └── Item Components
│       ├── Checkbox
│       ├── Item Details (Quantity & Description)
│       └── Delete Button
└── Stats Footer
    └── Packing Progress Information
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses useMemo for derived state calculations
- Manages form state with React Hook Form and Zod validation
- Tracks item list, sorting preferences, and packing status

### User Interaction

- Add new items with description and quantity
- Mark items as packed/unpacked with checkboxes
- Remove individual items with delete buttons
- Sort the list using different criteria
- Clear the entire list with confirmation
- View real-time packing statistics

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Hook Form with Zod for form validation
- Tailwind CSS for styling
- Lucide React for icons
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper form labeling
- Keyboard navigable interface
- Focus management
- Screen reader friendly content
- Appropriate ARIA attributes

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
4. Open [http://localhost:3000/projects/easy/far-away](http://localhost:3000/projects/easy/far-away) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 