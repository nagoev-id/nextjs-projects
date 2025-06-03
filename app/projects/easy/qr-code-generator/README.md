# QR Code Generator

A practical QR code generation tool built with Next.js and React that converts text or URLs into downloadable QR code images with customizable size options.

![QR Code Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/quote-generator-1.png?updatedAt=1748939563957)
![QR Code Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/quote-generator-2.png?updatedAt=1748939563941)

## Features

- **Text to QR Conversion**: Generate QR codes from any text or URL input
- **Size Customization**: Choose from multiple size options (100x100 to 700x700 pixels)
- **Real-time Preview**: Instantly view generated QR codes
- **Download Functionality**: Save QR codes as PNG images
- **Reset Option**: Clear generated QR code and start fresh
- **Form Validation**: Ensures valid input for QR code generation
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Implementation Details

### Component Structure

The QR code generator application is built with the following structure:

```
QRCodeGeneratorPage
├── Instruction Text
├── Generator Form
│   ├── Text/URL Input
│   ├── Size Selection Dropdown
│   └── Generate Button
└── QR Code Display (conditional)
    ├── QR Code Image
    ├── Download Button
    └── Clear Button
```

### State Management

- Uses React's `useState` hook to track QR code URL
- Implements React Hook Form with Zod validation for form handling
- Uses `useCallback` for optimized event handlers
- Uses `useMemo` for derived values like size options and current size
- Manages conditional rendering based on QR code generation status

### QR Code Generation and Download

- Leverages QR Server API for QR code generation
- Properly encodes input text for URL safety
- Implements canvas-based approach for downloading images
- Handles various edge cases in image loading and processing
- Provides visual feedback during generation and download

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- React Hook Form for form handling
- Zod for form validation
- Next.js Image component for optimized rendering
- Canvas API for image processing
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The QR code generator provides:

- Simple, intuitive interface for entering text or URLs
- Clear size options for different use cases
- Instant visual preview of generated QR codes
- Straightforward download process
- Error notifications for failed operations
- Helpful instruction text for first-time users
- Responsive design for all device sizes

## Accessibility

The QR code generator implements the following accessibility features:

- Semantic HTML structure
- Properly labeled form controls
- ARIA attributes for dynamic content
- Keyboard navigation support
- Screen reader support for generated content
- Sufficient color contrast for text and controls

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 