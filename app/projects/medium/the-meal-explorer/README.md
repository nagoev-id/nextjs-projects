# The Meal Explorer

A Next.js application for discovering and exploring meals and recipes from around the world.

![The Meal Explorer Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/the-meal-explorer.png?updatedAt=1748975567646)

## Features

- **Meal Search**: Find meals by name or ingredients
- **Random Meals**: Discover new recipes with random meal suggestions
- **Meal Categories**: Browse meals by cuisine type and category
- **Detailed Recipes**: View comprehensive information about each meal
- **Responsive Design**: Optimized for all device sizes
- **Reset Search**: Clear search results and return to random meal suggestions
- **Visual Presentation**: Beautiful images of each meal

## Implementation Details

### Component Structure

The application is built with the following structure:

```
MealExplorerPage
├── Search Form
│   ├── Meal Name Input
│   ├── Search Button
│   └── Reset Button
├── Results Grid
│   └── Meal Cards
│       ├── Meal Image
│       ├── Meal Name
│       ├── Region Badge
│       ├── Category Badge
│       └── More Info Button
└── Meal Detail Page
    ├── Meal Header
    │   ├── Meal Image
    │   ├── Meal Name
    │   └── Category and Region
    ├── Ingredients Section
    │   └── Ingredient List
    └── Instructions Section
        └── Preparation Steps
```

### State Management

- Uses RTK Query for API data fetching
- Implements React Hook Form with Zod for form validation
- Uses `useState` and `useEffect` hooks for local state management
- Manages search results and random meal states
- Handles loading, error, and success states

### User Interaction

- Search for meals by entering keywords
- View random meal suggestions
- Reset search results with a single click
- Navigate to detailed meal information
- View meal origin and category information
- Access full recipes and instructions

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for API calls
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Sonner for toast notifications
- Next.js Image component for optimized image loading

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Proper image alt text
- Sufficient color contrast
- Clear form labels and instructions

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
4. Open [http://localhost:3000/projects/medium/the-meal-explorer](http://localhost:3000/projects/medium/the-meal-explorer) in your browser

## API Integration

The application uses TheMealDB API to fetch meal data, including search results, random meals, and detailed recipe information. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 