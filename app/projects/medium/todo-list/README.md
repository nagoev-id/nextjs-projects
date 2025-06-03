# Todo List

A Next.js application for managing tasks with filtering, categorization, and status tracking.

![Todo List Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/todo-list.png?updatedAt=1748975567048)

## Features

- **Task Creation**: Add new tasks with title, description, category, due date, and color
- **Task Management**: Mark tasks as complete/incomplete, edit, and delete tasks
- **Task Filtering**: Filter tasks by category and completion status
- **Visual Organization**: Color-coded tasks for visual categorization
- **Form Validation**: Comprehensive validation for task creation and editing
- **Responsive Design**: Optimized for all device sizes
- **Real-time Feedback**: Toast notifications for all actions

## Implementation Details

### Component Structure

The application is built with the following structure:

```
TodoListPage
├── Create Todo Form
│   ├── Title Input
│   ├── Description Input
│   ├── Category Selector
│   ├── Date Picker
│   ├── Color Picker
│   └── Submit Button
├── Todo Filters
│   ├── Category Filter
│   └── Status Filter
└── Todo List
    └── Todo Items
        ├── Color Indicator
        ├── Task Information
        │   ├── Title
        │   ├── Description
        │   ├── Category
        │   └── Due Date
        ├── Completion Toggle
        ├── Edit Button
        └── Delete Button
```

### State Management

- Uses RTK Query for API data fetching and mutations
- Implements React Hook Form with Zod for form validation
- Uses `useState` and `useCallback` hooks for local state management
- Manages filtered tasks based on category and completion status
- Handles loading, error, and success states

### User Interaction

- Create new tasks with detailed information
- Mark tasks as complete/incomplete with a single click
- Edit task details through a modal form
- Delete tasks with confirmation dialog
- Filter tasks by category or completion status
- Visual feedback for all actions through toast notifications

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for API calls and state management
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Sonner for toast notifications
- Shadcn UI components for consistent design

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Clear visual states for task completion
- Proper form labels and instructions
- Sufficient color contrast

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
4. Open [http://localhost:3000/projects/medium/todo-list](http://localhost:3000/projects/medium/todo-list) in your browser

## API Integration

The application uses a JSON Server backend to store and retrieve task data. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching, caching, and mutations.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 