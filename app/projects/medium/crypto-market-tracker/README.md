# Crypto Market Tracker

A Next.js application for tracking cryptocurrency market data in real-time.

![Crypto Market Tracker Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/crypto-market-tracker.png?updatedAt=1748975556860)

## Features

- **Cryptocurrency Listing**: View top cryptocurrencies with key market metrics
- **Real-time Search**: Filter cryptocurrencies by name, symbol, or ID
- **Advanced Sorting**: Sort by any column (price, market cap, volume, 24h change)
- **Price Trend Visualization**: Visual indicators for price movements
- **Detailed Information**: Access detailed information about each cryptocurrency
- **Responsive Design**: Optimized for all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
CryptoMarketTrackerPage
├── Search Bar
├── Cryptocurrency Table
│   ├── Table Headers (sortable)
│   └── Cryptocurrency Rows
│       ├── Coin Image and Symbol
│       ├── Price Information
│       ├── 24h Change
│       ├── Volume
│       ├── Market Cap
│       └── Price Trend Indicator
└── Cryptocurrency Detail Page
    ├── Coin Header with Image
    ├── Price Information
    ├── Market Data
    └── Description
```

### State Management

- Uses RTK Query for API data fetching and caching
- Implements `useState` hooks for search and sort state
- Uses `useCallback` and `useMemo` for optimized rendering
- Implements debounced search for performance optimization

### User Interaction

- Search input filters cryptocurrencies in real-time
- Column headers enable sorting in ascending/descending order
- Color-coded price changes (green for positive, red for negative)
- Visual trend indicators for quick market assessment
- Links to detailed cryptocurrency information pages

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- Tailwind CSS for styling
- CoinGecko API for cryptocurrency data
- Lodash for utility functions like debounce

## Accessibility

The application implements the following accessibility features:

- Semantic HTML table structure
- Proper ARIA attributes
- Keyboard navigable interface
- Sufficient color contrast
- Text alternatives for visual indicators

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
4. Open [http://localhost:3000/projects/medium/crypto-market-tracker](http://localhost:3000/projects/medium/crypto-market-tracker) in your browser

## API Integration

The application uses the CoinGecko API to fetch cryptocurrency data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Performance Optimizations

- Debounced search input to prevent excessive rendering
- Memoized sorting and filtering functions
- Conditional rendering based on data state
- Efficient state management with Redux Toolkit

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 