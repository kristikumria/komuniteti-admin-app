# Material Design 3 Implementation Guide

This guide explains how to properly implement Material Design 3 (MD3) in the Komuniteti Admin App. Following these guidelines ensures consistent styling and proper dark mode support across the application.

## Core Principles

1. **Theme-aware styling**: All styles should respond to the current theme
2. **Token-based design**: Use theme tokens instead of hardcoded values
3. **Paper components**: Use React Native Paper components with proper variants
4. **Consistent elevation**: Follow the elevation model for shadows and surfaces

## How to Access Theme Tokens

Always use the `useThemedStyles` hook to access both the theme and common styles:

```tsx
import { useThemedStyles } from '../hooks/useThemedStyles';

const MyComponent = () => {
  const { theme, commonStyles } = useThemedStyles();
  
  // Now you can use theme tokens
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* Component content */}
    </View>
  );
};
```

## Converting Styles to Theme-Aware Styles

### Before (using hardcoded values):

```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  description: {
    fontSize: 14,
    color: '#666666',
  },
});
```

### After (using MD3 tokens):

```tsx
const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  title: {
    color: theme.colors.onSurface,
    // Use Text variant="titleMedium" instead of styling directly
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    // Use Text variant="bodyMedium" instead of styling directly
  },
});
```

## Using React Native Paper Components

Always prefer Paper components with proper variants:

### Text Components

Use Text component with variants instead of custom styling:

```tsx
// Incorrect
<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Title</Text>

// Correct
<Text variant="titleLarge">Title</Text>
```

Available text variants:
- `displayLarge`, `displayMedium`, `displaySmall`
- `headlineLarge`, `headlineMedium`, `headlineSmall`
- `titleLarge`, `titleMedium`, `titleSmall`
- `bodyLarge`, `bodyMedium`, `bodySmall`
- `labelLarge`, `labelMedium`, `labelSmall`

### Surface & Elevation

Use Surface component with elevation for consistent shadows:

```tsx
// Incorrect
<View style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  elevation: 5,
}}>
  {/* content */}
</View>

// Correct
<Surface elevation={2}>
  {/* content */}
</Surface>
```

Elevation levels:
- `0`: No elevation (flat)
- `1`: Cards, elevated buttons
- `2`: Floating action buttons, menus
- `3`: Navigation drawers, modal sheets

### Buttons

Use the Button component with appropriate modes:

```tsx
<Button 
  mode="contained" 
  onPress={handlePress}
>
  Primary Action
</Button>

<Button 
  mode="outlined" 
  onPress={handlePress}
>
  Secondary Action
</Button>
```

Button modes:
- `contained`: Primary actions (solid background)
- `outlined`: Secondary actions (outlined)
- `text`: Tertiary actions (text only)
- `contained-tonal`: Less prominent primary actions
- `elevated`: Elevated buttons with shadow

## Color System

The MD3 color system includes specific tokens for different contexts:

### Primary Colors
- `primary`: Main brand color
- `onPrimary`: Text on primary color
- `primaryContainer`: Secondary elements using brand color
- `onPrimaryContainer`: Text on primaryContainer

### Surface Colors
- `surface`: Main container backgrounds
- `onSurface`: Text on surface
- `surfaceVariant`: Alternative surface
- `onSurfaceVariant`: Text on surfaceVariant
- `surfaceDisabled`: Disabled elements
- `surfaceContainer*`: Container backgrounds with different elevations

### Status Colors
- `error`: Error states
- `onError`: Text on error color
- `errorContainer`: Error container backgrounds
- `onErrorContainer`: Text on errorContainer

## Using Common Styles

The app provides common styles through the `useThemedStyles` hook:

```tsx
const { commonStyles } = useThemedStyles();

return (
  <View style={commonStyles.screenContainer}>
    <View style={commonStyles.card}>
      {/* Card content */}
    </View>
  </View>
);
```

## Creating Themed Components

When creating new components, follow this pattern:

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

interface MyComponentProps {
  title: string;
  description: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  description 
}) => {
  const { theme } = useThemedStyles();
  
  return (
    <Surface elevation={1} style={styles(theme).container}>
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyMedium" style={styles(theme).description}>
        {description}
      </Text>
    </Surface>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.m,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.s,
  },
});
```

## Dark Mode Support

When using theme tokens correctly, your components will automatically support dark mode. The `ThemeProvider` handles theme switching based on user preferences.

## Migration Process

Follow these steps when migrating components to MD3:

1. Replace `useTheme` with `useThemedStyles`
2. Convert static styles to theme-aware styles: `styles` -> `styles(theme)`
3. Replace hardcoded colors with theme tokens
4. Replace hardcoded spacing with theme.spacing tokens
5. Replace Text styling with appropriate variants
6. Use Surface with elevation instead of custom shadows
7. Test in both light and dark modes

## Best Practices Checklist

- Use theme tokens for colors instead of hardcoded hex values
- Use theme tokens for spacing (padding, margin)
- Use theme tokens for border radius (theme.roundness)
- Use Paper components with proper variants
- Use Surface with proper elevation for shadows
- Make styles functions that accept the theme
- Test components in both light and dark mode
- Use the useThemedStyles hook for consistent access to theme and common styles
- Avoid conditional styling based on isDarkMode (let the theme handle it)
- Use proper elevation for surfaces and containers

## Common Mistakes to Avoid

- ❌ Using hardcoded colors (`#FFFFFF`, `black`, etc.)
- ❌ Using numeric padding/margin without theme tokens
- ❌ Accessing theme with useTheme without type safety
- ❌ Creating custom shadow styles instead of using elevation
- ❌ Implementing isDarkMode checks (redundant with theme)
- ❌ Inconsistent styling patterns across components

Following these guidelines will ensure a consistent user experience and proper dark mode support throughout the app. 