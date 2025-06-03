# Expense Tracker

A comprehensive personal finance tracking application built with Next.js and React that helps users monitor their income and expenses with real-time balance calculations and persistent storage.

![Expense Tracker Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/expense-tracker.png?updatedAt=1748937197118)

## Features

- **Balance Overview**: Real-time calculation and display of total balance
- **Income and Expense Tracking**: Separate tracking for both income and expense amounts
- **Transaction History**: Chronological list of all financial transactions
- **Transaction Management**: Add new transactions and delete existing ones
- **Persistent Storage**: Automatically saves all data to localStorage
- **Data Visualization**: Color-coded display of income and expenses
- **Form Validation**: Ensures valid transaction data with proper validation
- **Confirmation Dialogs**: Prevents accidental deletion of transactions
- **Clear All Option**: Reset the entire transaction history when needed

## Implementation Details

### Component Structure

The expense tracker application is built with the following structure:

```
ExpenseTrackerPage
├── Balance Overview
│   ├── Current Balance
│   └── Income/Expense Summary
│       ├── Income Display
│       └── Expense Display
├── Transaction Form
│   ├── Description Input
│   ├── Amount Input
│   └── Add Transaction Button
├── Transaction History
│   ├── Transaction Items
│   │   ├── Description
│   │   ├── Amount (color-coded)
│   │   └── Delete Button
│   └── Clear All Button
└── Confirmation Dialog
    ├── Dialog Title
    ├── Dialog Description
    └── Action Buttons
        ├── Confirm Button
        └── Cancel Button
```

### State Management

- Uses React's `useState` hook to track transactions and financial metrics
- Implements custom `useStorage` hook for localStorage persistence
- Uses React Hook Form with Zod validation for form handling
- Implements `useCallback` and `useMemo` for optimized operations
- Automatically recalculates financial totals when transactions change

### Financial Calculations

- Real-time calculation of total balance from all transactions
- Separate tracking of income (positive amounts) and expenses (negative amounts)
- Automatic formatting of monetary values with currency symbols
- Color-coding of values (green for income, red for expenses)

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety and interfaces
- React Hook Form for transaction input
- Zod for form validation
- UUID for generating unique transaction IDs
- LocalStorage for data persistence
- UI components from a shared component library
- Lucide React for icons
- Toast notifications for user feedback

## User Experience

The expense tracker provides:

- Clean, intuitive interface
- Real-time updates of financial totals
- Color-coded visual indicators
- Confirmation dialogs for destructive actions
- Form validation with helpful error messages
- Persistent data between sessions

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 