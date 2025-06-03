# Cocktail Explorer

An interactive cocktail discovery application built with Next.js, React, TypeScript, and Redux Toolkit. This application allows users to browse random cocktails, search for specific drinks by name or ingredients, and view detailed recipes and preparation instructions.

![Cocktail Explorer Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/cocktail-explorer-1.png?updatedAt=1748975558455)
![Cocktail Explorer Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/cocktail-explorer-2.png?updatedAt=1748975558877)

## Features

- **Cocktail Discovery**: Browse a collection of random cocktails on the home page
- **Advanced Search**: Search for cocktails by name, category, glass type, or ingredients
- **Detailed Information**: View comprehensive details about each cocktail including:
  - High-quality image
  - Name and category
  - Glass type
  - Alcoholic/Non-alcoholic status
  - Complete list of ingredients
  - Step-by-step preparation instructions
  
- **User-Friendly Interface**: Reset search functionality and intuitive navigation
- **Responsive Design**: Adapts to different screen sizes with optimized layouts

## Implementation Details

### Component Structure

The application is built with the following structure:

```
Cocktail Explorer
├── Home Page (Search & Browse)
│   ├── Search Form
│   ├── Results Display
│   └── Cocktail Cards
└── Cocktail Detail Page
    ├── Cocktail Image
    ├── Basic Information
    ├── Ingredients List
    └── Preparation Instructions
```

### State Management

- Uses Redux Toolkit for global state management
- Local state for form handling and UI interactions
- React Hook Form with Zod for form validation

### Data Management

- Includes a comprehensive cocktail database
- Efficient filtering and search algorithms
- Random cocktail selection for discovery

### Styling

- Custom UI components with responsive design
- Adaptive grid layouts for different screen sizes
- Visual feedback for user interactions

## Technical Implementation

The application uses:

- **Next.js** for routing and server-side rendering
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Hook Form** with **Zod** for form validation
- **Tailwind CSS** for styling with responsive design

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigable interface
- Proper image alt texts

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 