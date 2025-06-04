# Eat and Split

A Next.js application for tracking shared expenses with friends and splitting bills with an intuitive, user-friendly interface.

![Eat and Split Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/eat-and-split.png?updatedAt=1748975560159)

## Features

- **Friend Management**: Add new friends with names and profile images
- **Bill Splitting**: Enter bill amounts and split costs between you and friends
- **Balance Tracking**: Automatically calculates and tracks who owes whom
- **Flexible Payment Options**: Choose who pays the bill and adjust balances accordingly
- **Dynamic Calculations**: Real-time calculation of each person's share
- **Visual Balance Status**: Clear visual indicators showing positive, negative, or balanced accounts
- **Responsive Design**: Optimized for all device sizes
- **User-friendly Interface**: Intuitive design for easy expense management

## Implementation Details

### Component Structure

The application is built with the following structure:

```
EatAndSplitPage
├── Friend List
│   ├── Friend Items
│   │   ├── Profile Image
│   │   ├── Name
│   │   ├── Balance Status
│   │   └── Select Button
│   └── Add Friend Button
├── Add Friend Form (conditional)
│   ├── Name Input
│   ├── Image URL Input
│   └── Submit Button
└── Split Bill Form (conditional)
    ├── Bill Amount Input
    ├── Your Expense Input
    ├── Friend's Expense (calculated)
    ├── Who is Paying Selector
    └── Split Bill Button
```

### State Management

- Uses React hooks for local state management
- Tracks friend list with balances
- Manages form states for adding friends and splitting bills
- Handles selection of current friend for bill splitting
- Maintains bill splitting calculations in real-time

### User Interaction

- Add new friends with name and profile image
- Select a friend to split a bill
- Enter bill details including total amount and your expense
- Choose who pays the bill (you or your friend)
- Submit the bill split to update balances
- View updated balance status for each friend

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Custom form handling with controlled components
- Dynamic calculation logic for expense splitting
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper label associations for form elements
- ARIA attributes for interactive components
- Keyboard navigable interface
- Focus management for forms
- Sufficient color contrast for balance indicators

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
4. Open [http://localhost:3000/projects/easy/eat-and-split](http://localhost:3000/projects/easy/eat-and-split) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 