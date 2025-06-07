# Movie Seat Booking

An interactive movie seat booking interface built with Next.js and React that allows users to select seats for a movie showing with real-time price calculation.

![Movie Seat Booking Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/movie-seat-booking.png?updatedAt=1749294794338)

## Features

- **Interactive Seat Selection**:
  - Visual representation of theater layout
  - Seat status indicators (available, occupied, selected)
  - Multiple seat selection support

- **Real-time Price Calculation**:
  - Dynamic ticket cost updates based on selections
  - Support for different pricing tiers

- **Movie Selection**:
  - Ability to choose from multiple movies
  - Price adjustments based on movie selection

- **Persistent Selection**:
  - Saves seat selections to local storage
  - Retrieves previous selections on page reload

- **Accessibility Features**: 
  - Keyboard navigation support
  - ARIA attributes for screen readers
  - High contrast visual indicators

## Implementation Details

### Component Structure

The movie seat booking component is built with the following structure:
```
MovieSeatBooking
├── Movie Selector
│   ├── Dropdown Menu
│   └── Price Display
├── Legend
│   ├── Available Seat Indicator
│   ├── Selected Seat Indicator
│   └── Occupied Seat Indicator
├── Seat Grid
│   ├── Screen Visualization
│   ├── Seat Rows
│   └── Individual Seats (interactive)
└── Booking Summary
    ├── Selected Seat Count
    ├── Total Price
    └── Confirmation Button
```

### State Management

- Uses React's `useState` hook to track selected seats and movie choice
- Implements `useEffect` to synchronize with local storage
- Maintains seat status in a structured data model
- Calculates prices reactively based on selections

### User Interaction

- Click/tap to select or deselect seats
- Visual feedback when hovering over and selecting seats
- Clear indication of unavailable seats
- Real-time updates to selection count and total price

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- LocalStorage API for persistence
- CSS Grid/Flexbox for seat layout
- Custom animations for selection feedback

## Accessibility

The movie seat booking implements the following accessibility features:

- Keyboard navigation support for seat selection
- Screen reader announcements for seat status changes
- Color combinations with sufficient contrast
- Focus indicators for interactive elements

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license.