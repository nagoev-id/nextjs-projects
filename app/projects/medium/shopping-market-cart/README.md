# Shopping Market Cart

A Next.js application for browsing products and managing a shopping cart with real-time updates.

![Shopping Market Cart Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/shopping-market-cart-1.png?updatedAt=1748975566581)
![Shopping Market Cart Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/shopping-market-cart-2.png?updatedAt=1748975567215)

## Features

- **Product Catalog**: Browse a collection of products with images and prices
- **Shopping Cart**: Add and remove items from your cart
- **Quantity Control**: Increase or decrease the quantity of each item
- **Visual Indicators**: Badge showing item quantity on product cards
- **Price Formatting**: Properly formatted currency display
- **Responsive Design**: Optimized grid layout for all device sizes
- **Real-time Updates**: Cart updates instantly when items are added or removed

## Implementation Details

### Component Structure

The application is built with the following structure:

```
ShoppingMarketCartPage
├── Product Grid
│   └── Product Cards
│       ├── Product Image
│       ├── Quantity Badge
│       ├── Product Title
│       ├── Price Display
│       └── Cart Controls
│           ├── Add to Cart Button
│           └── Quantity Controls
│               ├── Decrease Button
│               ├── Quantity Display
│               └── Increase Button
└── Cart State Management
```

### State Management

- Uses Redux for global state management
- Implements RTK Query for API data fetching
- Uses `useCallback` and `useMemo` for optimized rendering
- Tracks cart items with quantity management
- Handles loading, error, and success states

### User Interaction

- Add products to cart with a single click
- Increase or decrease product quantity with intuitive controls
- Visual feedback with quantity badges on product cards
- Clear product images and information
- Formatted prices for better readability

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- Tailwind CSS for styling
- Next.js Image component for optimized image loading
- Lucide React for icons
- Helper functions for price formatting

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Sufficient color contrast
- Proper image alt text
- Clear visual feedback for interactions

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
4. Open [http://localhost:3000/projects/medium/shopping-market-cart](http://localhost:3000/projects/medium/shopping-market-cart) in your browser

## API Integration

The application uses a mock API to fetch product data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 