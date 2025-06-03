# Jobs Filter

A Next.js application for filtering and searching job listings with interactive tag filtering.

![Jobs Filter Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/jobs-filter.png?updatedAt=1748975562792)

## Features

- **Job Listings**: View a comprehensive list of job postings with detailed information
- **Tag Filtering**: Add filters by clicking on job skills and requirements
- **Search Functionality**: Search for jobs by position, company, location, or skills
- **Multiple Filters**: Combine multiple filters to narrow down job results
- **Clear Filters**: Remove individual filters or clear all filters at once
- **Visual Indicators**: Highlight featured and new job postings
- **Responsive Design**: Optimized for all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
JobsFilterPage
├── Search Input
├── Filter Section
│   ├── Active Filters
│   └── Clear Filters Button
└── Job Listings
    └── Job Cards
        ├── Company Logo
        ├── Job Information
        │   ├── Position
        │   ├── Company
        │   ├── Location
        │   └── Contract Type
        ├── Status Badges
        │   ├── New Badge
        │   └── Featured Badge
        └── Skill Badges
            └── Clickable Skill Tags
```

### State Management

- Uses Redux for global state management
- Implements selectors for filtered job positions
- Uses `useCallback` and `useMemo` for optimized rendering
- Manages filter state with add, remove, and clear actions
- Implements real-time search filtering

### User Interaction

- Click on skill tags to add them as filters
- Click on filter badges to remove individual filters
- Use the clear button to remove all filters at once
- Type in the search box to filter jobs by keywords
- Visual feedback for featured and new job listings

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit for state management
- TypeScript for type safety
- Tailwind CSS for styling
- Next.js Image component for optimized image loading
- SVG imports for company logos

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
4. Open [http://localhost:3000/projects/medium/jobs-filter](http://localhost:3000/projects/medium/jobs-filter) in your browser

## Data Integration

The application uses mock data stored in the project to simulate job listings. In a production environment, this could be replaced with an API integration for real job postings.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 