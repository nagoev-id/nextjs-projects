# Random User Generator

![Random User Generator Screenshot](https://ik.imagekit.io/nagoevid/nextjs-projects/random-user-generator.png?updatedAt=1748869576646)

## 📋 Description

An interactive application that fetches and displays random user profiles from the RandomUser.me API. Users can view different pieces of information about the generated profile and generate new random users with a click.

## 🚀 Features

- Fetches random user data from external API
- Displays user avatar image
- Interactive category selection (name, email, age, address, phone, password)
- One-click generation of new random users
- Loading state with spinner
- Error handling for failed API requests
- Clean, responsive UI with intuitive controls

## 🛠️ Technologies

- Next.js with App Router
- React Hooks (useState, useEffect, useCallback)
- TypeScript for type safety
- Tailwind CSS for styling
- React Icons for category icons
- Custom useAxios hook for API requests
- Next.js Image component for optimized images

## 🧠 Implementation Details

- Custom `useAxios` hook for managing API request states
- Type definitions for API responses and user data
- Category-based information display
- Conditional rendering based on request state
- Proper error handling and loading states
- Memory-efficient callback functions

## 📚 How It Works

1. On initial load, the application fetches a random user from the RandomUser.me API
2. The user's avatar is displayed at the top of the card
3. By default, the user's name is shown as the active category
4. Users can click on different category icons to view different information:
   - Name (default)
   - Email address
   - Age
   - Street address
   - Phone number
   - Password
5. Clicking the "Generate" button fetches a new random user profile

## 📱 Responsive Design

The interface adapts to different screen sizes:
- Centered card layout that works on all devices
- Properly sized avatar image
- Flexible text wrapping for longer values
- Responsive button layout for category selection

## 🔒 Accessibility

- Semantic HTML structure
- ARIA attributes for interactive elements
- Alt text for user avatar images
- Clear visual indication of selected category
- Proper error messaging

## 🧪 Learning Outcomes

This project demonstrates:
- Working with external APIs
- Managing request states (loading, error, success)
- Creating custom hooks for data fetching
- Dynamic content rendering
- Implementing a category-based UI
- Optimizing images with Next.js
- Handling potential API failures 