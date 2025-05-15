# Komuniteti Admin App

A React Native mobile application for property management administrators.

## Features

- Authentication (login, registration, forgot password)
- Role-based navigation (Business Manager vs. Administrator)
- State management with Redux Toolkit
- Form handling with React Hook Form and Yup validation
- UI components with React Native Paper
- Real-time features with Socket.io
- TypeScript support
- Dashboard views for both user roles
- Building management (creation, editing, deletion)
- Resident management (registration, profile editing, removal)
- Payment processing and history tracking
- Comprehensive notification system
- Material Design 3 (MD3) token-based styling system with dark mode support
- Responsive layouts optimized for both phones and tablets
- Chat functionality (in progress):
  - One-to-one messaging
  - Message composition and history viewing
  - Message status indicators (sending, sent, delivered, read)
  - UI foundation for file attachments and group conversations

## Project Structure

```
src/
  ├── assets/         # Images, fonts, etc.
  ├── components/     # Shared UI components
  │   ├── Buildings/  # Building-related components
  │   ├── Chat/       # Chat-related components
  │   ├── Grid/       # Responsive grid components
  │   ├── Payments/   # Payment-related components
  │   └── UI/         # Common UI components
  ├── hooks/          # Custom React hooks
  ├── navigation/     # Navigation configuration
  ├── screens/        # App screens
  │   ├── administrator/ # Administrator-specific screens
  │   ├── business/   # Business manager-specific screens
  │   └── shared/     # Screens shared between roles
  ├── services/       # API services
  │   ├── authService.ts    # Authentication service
  │   ├── buildingService.ts # Building management
  │   ├── chatService.ts    # Chat functionality
  │   ├── paymentService.ts # Payment processing
  │   └── socketService.ts  # Real-time communication
  ├── store/          # Redux setup
  │   ├── slices/     # Redux slices for different features
  │   └── store.ts    # Redux store configuration
  ├── styles/         # Global styles and styling utilities
  ├── theme/          # MD3 theming system
  └── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd komuniteti-admin
   npm install
   ```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Check MD3 migration status
npm run md3-check
```

## Tech Stack

- React Native
- Expo
- TypeScript
- Redux Toolkit
- React Navigation
- React Native Paper with Material Design 3
- React Hook Form with Yup
- Socket.io-client
- Async Storage
- JWT Decode
- Axios

## Design System

The app uses Material Design 3 (MD3) for consistent styling across the application:

- Theme tokens for colors, typography, spacing, and elevation
- Dark mode support with proper contrast
- Consistent component styling using the `useThemedStyles` hook
- Responsive layouts for both phone and tablet form factors

The design system implementation is guided by:
- `src/styles/MD3_IMPLEMENTATION_GUIDE.md` - Comprehensive guide for using MD3
- `MD3_MIGRATION_PLAN.md` - Phased approach to migrating the codebase

## Customization

The app theme is customizable through the theme configuration in `src/theme/theme.ts`. The primary color is set to Komuniteti brand blue (#1363DF).

## Project Status

The application is being actively developed with the following completed features:
- Core authentication and navigation
- Building and resident management
- Payment processing and history
- Notification system
- MD3 design foundation (theme tokens, helper hooks, common styles)
- Responsive tablet layout foundation

Features in progress:
- MD3 implementation across all components
- Chat functionality (resolving TypeScript issues and improving socket integration)
- InfoPoints system

Upcoming features include:
- Group chat and file attachments
- Polls and surveys
- Maintenance request tracking
- Advanced reporting
- Organigram visualization 