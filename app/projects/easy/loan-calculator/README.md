# Loan Calculator

A comprehensive loan calculation tool built with Next.js and React that helps users calculate monthly payments, total amounts, and interest for loans with real-time feedback.

![Loan Calculator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/loan-calculator.png?updatedAt=1748939633230)

## Features

- **Loan Amount Input**: Enter the principal amount for the loan
- **Interest Rate Selection**: Specify the annual interest rate percentage
- **Repayment Period**: Set the loan term in years
- **Real-time Calculation**: Instantly calculate monthly payments, total principal, and interest
- **Form Validation**: Input validation to ensure accurate calculations
- **Animated Results**: Smooth transition when displaying calculation results
- **Currency Formatting**: Clear presentation of monetary values with currency symbols

## Implementation Details

### Component Structure

The loan calculator application is built with the following structure:

```
LoanCalculatorPage
├── Calculator Form
│   ├── Loan Amount Input
│   ├── Interest Rate Input
│   ├── Repayment Period Input
│   └── Calculate Button
└── Results Display (conditional)
    ├── Monthly Payments
    ├── Total Principal Paid
    └── Total Interest Paid
```

### State Management

- Uses React's `useState` hook to track form values and calculation results
- Implements React Hook Form with Zod validation for form handling
- Uses `useCallback` for optimized event handlers
- Tracks loading, success, and error states during calculation
- Implements `useMemo` for memoized calculation results

### Calculation Logic

- Implements standard amortization formula for loan calculation
- Calculates monthly payment using the formula: `P * (r * (1 + r)^n) / ((1 + r)^n - 1)`
  - P = principal (loan amount)
  - r = monthly interest rate (annual rate / 100 / 12)
  - n = total number of payments (years * 12)
- Derives total amount paid and total interest from monthly payment

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Hook Form for input handling
- Zod for form validation
- Memoization for performance optimization
- UI components from a shared component library
- Sonner for toast notifications

## User Experience

The loan calculator provides:

- Clean, intuitive interface for loan parameters
- Instant feedback on calculation results
- Clear presentation of financial information
- Form validation with helpful error messages
- Smooth animations for result transitions
- Mobile-friendly responsive design

## Accessibility

The loan calculator implements the following accessibility features:

- Properly labeled form controls
- Error states with descriptive messages
- Focus management for form elements
- Semantic HTML structure
- Appropriate ARIA attributes for dynamic content

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 