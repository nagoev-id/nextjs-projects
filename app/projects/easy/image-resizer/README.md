# Image Resizer

A Next.js application for easily resizing and optimizing images with a clean, user-friendly interface.

![Image Resizer Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/image-resizer.png?updatedAt=1748975563140)

## Features

- **Image Upload**: Easy drag-and-drop or click-to-upload functionality
- **Dimension Control**: Manually adjust width and height parameters
- **Aspect Ratio Locking**: Maintain proportions when resizing images
- **Quality Reduction**: Option to decrease image quality for smaller file sizes
- **Real-time Preview**: View your image while adjusting dimensions
- **One-click Download**: Generate and download the resized image instantly
- **Format Conversion**: Save resized images in optimized JPEG format
- **Responsive Design**: Works seamlessly on all device sizes

## Implementation Details

### Component Structure

The application is built with the following structure:

```
ImageResizerPage
├── Upload Area
│   ├── Image Preview (conditional)
│   └── Upload Prompt (conditional)
└── Control Panel
    ├── Dimension Inputs
    │   ├── Width Input
    │   └── Height Input
    ├── Option Toggles
    │   ├── Aspect Ratio Lock
    │   └── Quality Reduction
    └── Download Button
```

### State Management

- Uses React hooks for local state management
- Implements useCallback for optimized event handlers
- Custom hooks for image upload and resize functionality
- Tracks image dimensions and user preferences
- Manages canvas rendering for image processing

### Image Processing

- Creates dynamic canvas elements for image manipulation
- Applies user-specified dimensions while rendering
- Implements quality reduction when requested
- Generates downloadable images in JPEG format
- Creates unique filenames with timestamps

## Technical Implementation

The application uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- HTML5 Canvas API for image processing
- Custom hooks for business logic separation
- React Icons for visual elements
- Sonner for toast notifications
- UI components from a shared component library

## Accessibility

The application implements the following accessibility features:

- Semantic HTML structure
- Proper label associations for inputs
- Screen reader friendly controls
- Keyboard navigable interface
- Clear visual feedback for interactive elements
- Focus management for form controls

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
4. Open [http://localhost:3000/projects/easy/image-resizer](http://localhost:3000/projects/easy/image-resizer) in your browser

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 