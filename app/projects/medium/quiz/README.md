# Quiz Application

A Next.js application for configuring and taking interactive quizzes with customizable categories, difficulty levels, and question types.

![Quiz Application Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/quiz-1.png?updatedAt=1748975566133)
![Quiz Application Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/quiz-2.png?updatedAt=1748975566009)

## Features

- **Quiz Configuration**: Customize quiz settings including number of questions, category, difficulty, and question type
- **Multiple Categories**: Choose from over 20 different quiz categories
- **Difficulty Levels**: Select from easy, medium, or hard questions
- **Question Types**: Option for multiple-choice or true/false questions
- **Interactive Gameplay**: Answer questions with immediate feedback
- **Score Tracking**: View your progress and final score
- **Results Summary**: See detailed performance statistics after completing the quiz
- **Responsive Design**: Optimized for all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
QuizApplication
├── Configuration Page
│   ├── Amount Input
│   ├── Category Selector
│   ├── Difficulty Selector
│   ├── Question Type Selector
│   └── Start Quiz Button
├── Game Page
│   ├── Question Display
│   ├── Answer Options
│   ├── Progress Indicator
│   └── Next Question Button
└── Results Page
    ├── Final Score
    ├── Correct/Incorrect Breakdown
    ├── Play Again Button
    └── Return to Configuration Button
```

### State Management

- Uses Redux for global state management
- Implements RTK Query for API data fetching
- Uses React Hook Form with Zod for form validation
- Tracks quiz progress, answers, and score
- Manages question navigation and result calculation

### User Interaction

- Configure quiz parameters through an intuitive form
- Select answers from multiple options
- Navigate through questions with clear feedback
- View detailed results after completing the quiz
- Restart or reconfigure quiz after completion

## Technical Implementation

The application uses:

- Next.js for the framework
- Redux Toolkit with RTK Query for state management and API calls
- TypeScript for type safety
- React Hook Form with Zod for validation
- Tailwind CSS for styling
- Sonner for toast notifications
- Open Trivia Database API for quiz questions

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigable interface
- Clear focus states
- Sufficient color contrast
- Screen reader friendly content

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
4. Open [http://localhost:3000/projects/medium/quiz](http://localhost:3000/projects/medium/quiz) in your browser

## API Integration

The application uses the Open Trivia Database API to fetch quiz questions based on user configuration. The API calls are managed through Redux Toolkit's RTK Query for efficient data fetching and caching.

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 