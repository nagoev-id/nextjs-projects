# QR Code Scanner

An interactive QR code scanner application built with Next.js and React that allows users to upload and decode QR code images with instant results display.

![QR Code Scanner Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/qr-code-scanner-1.png?updatedAt=1748939566033)
![QR Code Scanner Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/qr-code-scanner-2.png?updatedAt=1748939563857)

## Features

- **QR Code Scanning**: Decode information from uploaded QR code images
- **File Upload**: Simple drag and drop or click to upload interface
- **Results Display**: Clear presentation of decoded QR code content
- **Image Preview**: Shows thumbnail of the scanned QR code
- **Copy to Clipboard**: One-click copying of decoded information
- **Loading States**: Visual feedback during scanning process
- **Error Handling**: Graceful error handling with user notifications
- **Reset Option**: Clear results and upload a new QR code

## Implementation Details

### Component Structure

The QR code scanner application is built with the following structure:

```
QRCodeScannerPage
├── Upload Area
│   ├── File Input (hidden)
│   ├── Upload Icon
│   ├── Instruction Text
│   └── QR Code Preview (conditional)
└── Results Area (conditional)
    ├── Decoded Text Display
    ├── Copy Button
    └── Close Button
```

### State Management

- Uses React's `useState` hook to track message text and QR code data
- Implements `useRef` for file input and image references
- Uses `useCallback` for optimized API handling and UI updates
- Manages loading, success, and error states during scanning
- Transitions between upload and results views based on scan status

### API Integration

- Connects to the QR Server API for QR code scanning
- Processes image files through FormData for API submission
- Handles API response parsing for decoded content
- Manages error states with appropriate user feedback
- Provides visual feedback during API requests

## Technical Implementation

The component uses:

- Next.js for the framework
- React hooks for state management
- TypeScript for type safety
- Axios for API requests
- FormData for file uploads
- URL.createObjectURL for image previews
- Sonner for toast notifications
- UI components from a shared component library

## User Experience

The QR code scanner provides:

- Simple, intuitive interface for uploading QR codes
- Clear visual feedback during scanning process
- Preview of uploaded QR code image
- Easy access to decoded information
- One-click copying to clipboard
- Error notifications for failed scans
- Quick reset for scanning multiple codes
- Responsive design for all device sizes

## Accessibility

The QR code scanner implements the following accessibility features:

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard accessible buttons and inputs
- Focus management between states
- Screen reader announcements for state changes
- Sufficient color contrast for text and controls

## Browser Compatibility

This component is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is part of a larger Next.js collection and is available under the MIT license. 