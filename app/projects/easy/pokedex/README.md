#   

A Next.js application for exploring Pokémon data with a clean, interactive interface and detailed information.

![Pokedex Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/pokedex-1.png?updatedAt=1748975564115)
![Pokedex Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/pokedex-2.png?updatedAt=1748975564083)

## Features

- **Pokémon Collection**: Browse through a collection of Pokémon with visual cards
- **Type-based Styling**: Each Pokémon card is color-coded based on its primary type
- **Pagination**: Navigate through multiple pages of Pokémon listings
- **Detailed Information**: View comprehensive details about each Pokémon
- **Modal Dialogs**: Examine Pokémon abilities, effects, and generation in modal windows
- **Responsive Grid**: Adaptive layout adjusts based on screen size
- **Dynamic Data Loading**: Fetches Pokémon data from the PokeAPI
- **Loading States**: Visual feedback during API requests
- **Error Handling**: User-friendly notifications for API failures

## Implementation Details

### Component Structure

The application is built with the following structure:

```
PokedexPage
├── Loading Spinner (conditional)
├── Error Message (conditional)
├── Pokémon Grid
│   └── Pokémon Cards
│       ├── Pokémon Image
│       ├── Pokémon ID
│       ├── Pokémon Name
│       └── Type Badge
├── Pagination Controls
│   ├── Previous Button
│   ├── Page Number Buttons
│   └── Next Button
└── Pokémon Details Dialog (conditional)
    ├── Dialog Header
    │   └── Pokémon Name
    ├── Dialog Content
    │   ├── Pokémon Image
    │   ├── Generation Info
    │   ├── Ability Effects
    │   └── Flavor Text
    └── Close Button
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized API calls and event handlers
- Custom pagination hook for data splitting and navigation
- Tracks loading, error, and success states for API interactions
- Manages selected Pokémon state for detail display

### API Integration

- Connects to PokeAPI for comprehensive Pokémon data
- Makes parallel requests for efficient data collection
- Implements separate API calls for detailed Pokémon information
- Formats and transforms API responses for optimal display
- Handles API errors with user-friendly notifications

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- Custom pagination hook
- Dialog component for Pokémon details
- Sonner for toast notifications
- Next.js Image for optimized image loading
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Alternative text for Pokémon images
- Proper dialog implementation for modal content
- Keyboard navigable pagination controls
- Type information conveyed by both color and text

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
4. Open [http://localhost:3000/projects/easy/pokedex](http://localhost:3000/projects/easy/pokedex) in your browser

## API Integration

The application uses the PokeAPI to fetch Pokémon data. It makes two types of API calls:
- Collection requests to get basic information about multiple Pokémon
- Detail requests to get comprehensive information about a specific Pokémon's abilities

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 