# Mobile Store Cart

A Next.js application for browsing and purchasing mobile devices with an interactive shopping cart.

![Mobile Store Cart Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/mobile-store-cart-1.png?updatedAt=1748975562772)
![Mobile Store Cart Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/mobile-store-cart-2.png?updatedAt=1748975562841)

## Features

- **Product Catalog**: Browse a collection of mobile devices with images and prices
- **Shopping Cart**: Add and remove items from your cart
- **Quantity Control**: Increase or decrease the quantity of each item
- **Price Display**: View formatted prices with currency symbols
- **Responsive Design**: Optimized layout for all device sizes
- **Real-time Updates**: Cart updates instantly when items are added or removed

## Implementation Details

### Component Structure

The application is built with the following structure:

```
MobileStorePage
├── Product Grid
│   └── Device Cards
│       ├── Product Image
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
- Implements selectors for cart items and product data
- Uses `useCallback` and `useMemo` for optimized rendering
- Tracks cart items with quantity management
- Creates efficient mapping for quick item lookup

### User Interaction

- Add products to cart with a single click
- Increase or decrease product quantity with intuitive controls
- Visual feedback for cart actions
- Clear product images and information
- Formatted prices for better readability

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit for state management and API calls
- TypeScript for type safety
- Tailwind CSS for styling
- Next.js Image component for optimized image loading
- Lucide React for icons
- RTK Query for data fetching

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Sufficient color contrast
- Proper image alt text

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
4. Open [http://localhost:3000/projects/medium/mobile-store-cart](http://localhost:3000/projects/medium/mobile-store-cart) in your browser

## API Integration

The application uses a mock API to fetch mobile device data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 