# Image Editor

A powerful Next.js application for applying filters and transformations to images with a user-friendly interface.

![Image Editor Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/image-editor.png?updatedAt=1748975561581)

## Features

- **Image Upload**: Upload images directly from your device
- **Real-time Filtering**: Apply and adjust filters with immediate visual feedback
- **Multiple Filters**: Brightness, saturation, inversion, and grayscale controls
- **Image Transformations**: Rotate (90° increments) and flip (horizontal/vertical)
- **Filter Intensity**: Adjust filter strength using intuitive sliders (0-200%)
- **Reset Option**: Quickly revert to original image settings
- **Download Results**: Save edited images with all applied modifications
- **Canvas-based Rendering**: High-quality image processing using HTML5 Canvas
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Implementation Details

### Component Structure

The application is built with the following structure:

```
ImageEditorPage
├── Image Upload Section
│   ├── File Input
│   └── Upload Button
├── Preview Canvas
│   └── Edited Image Display
├── Filter Controls
│   ├── Filter Type Buttons
│   └── Intensity Slider
├── Transform Controls
│   ├── Rotate Buttons
│   └── Flip Buttons
└── Action Buttons
    ├── Reset Filters
    └── Save Image
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Uses custom hooks for image upload functionality
- Tracks filter settings, active filter, rotation angle, and flip states
- Maintains canvas rendering context for image processing

### Image Processing

- Renders images to HTML5 Canvas for manipulation
- Applies CSS filters for brightness, saturation, inversion, and grayscale
- Uses canvas transformations for rotation and flipping
- Generates downloadable images with all modifications applied
- Optimizes re-rendering with proper dependency tracking

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- HTML5 Canvas API for image processing
- CSS Filter API for visual effects
- Custom image upload hook
- React Icons for UI elements
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper ARIA attributes for interactive elements
- Keyboard navigable controls
- Descriptive button labels
- Focus management for form elements
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
4. Open [http://localhost:3000/projects/easy/image-editor](http://localhost:3000/projects/easy/image-editor) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 