# Komuniteti Admin App Design System

This document outlines the design system and UI guidelines for the Komuniteti Admin App. Following these guidelines will ensure a consistent user experience across the app.

## Theme System

The app uses React Native Paper with Material Design 3 (MD3) principles. The theme is configured in `src/theme/` and follows the MD3 color system.

### Using the Theme

Always access the theme via the `useTheme` hook from React Native Paper:

```tsx
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../theme/theme';

const MyComponent = () => {
  const theme = useTheme<AppTheme>();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      {/* Component content */}
    </View>
  );
};
```

### Color System

The theme defines a comprehensive color system following MD3 principles:

- **Primary colors**: Use for main UI elements (buttons, active tabs)
  - `primary`: Main brand color
  - `onPrimary`: Text/icons that appear on primary color
  - `primaryContainer`: Secondary elements using brand color
  - `onPrimaryContainer`: Text/icons on primaryContainer

- **Surface colors**: Use for backgrounds and cards
  - `surface`: Main background for cards and elements
  - `onSurface`: Text/icons on surface colors
  - `surfaceVariant`: Alternative surfaces
  - `surfaceContainer*`: Different levels of surface containers

- **Support colors**: For status and feedback
  - `error`: Error states and actions
  - `onError`: Text/icons on error color

### Typography

Use the predefined Text variants from React Native Paper:

```tsx
import { Text } from 'react-native-paper';

// Correct usage
<Text variant="headlineMedium">Headline</Text>
<Text variant="titleMedium">Title</Text>
<Text variant="bodyMedium">Body text</Text>
<Text variant="labelSmall">Label</Text>

// Avoid hardcoding font sizes and weights
```

### Elevation and Shadows

Use the theme's elevation system:

```tsx
import { Surface } from 'react-native-paper';

// Correct usage
<Surface elevation={1}>
  {/* Content */}
</Surface>

// Avoid custom shadow implementations
```

## Common Components

### Layout Components

- **ScreenContainer**: Wrapper for all screens
  ```tsx
  <ScreenContainer scrollable={true} useSurface={false}>
    {/* Screen content */}
  </ScreenContainer>
  ```

- **FormLayout**: For consistent form layouts
  ```tsx
  <FormLayout spacing={16} useSurface={true}>
    {/* Form fields */}
  </FormLayout>
  ```

### UI Components

- **Button**: Use the app's Button component
  ```tsx
  <Button 
    mode="contained"  // or "text", "outlined", "contained-tonal"
    onPress={handlePress}
    fullWidth
  >
    Button Text
  </Button>
  ```

- **Header**: Standard header for all screens
  ```tsx
  <Header 
    title="Screen Title"
    subtitle="Optional subtitle"
    showBack={true}
    showNotifications={true}
  />
  ```

## Common Styles

Use the predefined styles from `src/styles/commonStyles.ts`:

```tsx
import { commonStyles } from '../styles/commonStyles';

// Usage
<View style={commonStyles.card}>
  <Text style={commonStyles.heading}>Title</Text>
  <View style={commonStyles.row}>
    <Text style={commonStyles.paragraph}>Content</Text>
  </View>
</View>
```

## Dark Mode Support

The app supports light and dark modes. Avoid hardcoding colors, and use theme colors instead.

```tsx
// Correct
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.onBackground }}>Text</Text>
</View>

// Avoid
<View style={{ backgroundColor: '#FFFFFF' }}>
  <Text style={{ color: '#000000' }}>Text</Text>
</View>
```

## Responsive Design & Tablet Support

The app is designed to work seamlessly across different screen sizes, with particular focus on tablet optimization for administrator workflows.

### Responsive Grid System

Use the responsive grid components for layouts that adapt to different screen sizes:

```tsx
import { Grid, Row, Col } from '../components/Grid';

// Basic responsive grid
<Grid>
  <Row>
    <Col size={12} tablet={6} desktop={4}>
      {/* Content */}
    </Col>
    <Col size={12} tablet={6} desktop={4}>
      {/* Content */}
    </Col>
    <Col size={12} tablet={12} desktop={4}>
      {/* Content */}
    </Col>
  </Row>
</Grid>
```

### Adaptive Layouts

Use the `useBreakpoint` hook to conditionally render different layouts:

```tsx
import { useBreakpoint } from '../hooks/useBreakpoint';

const MyComponent = () => {
  const { isTablet, isDesktop } = useBreakpoint();
  
  return (
    <View>
      {isTablet ? (
        <TwoColumnLayout>
          <SidePanel />
          <MainContent />
        </TwoColumnLayout>
      ) : (
        <SingleColumnLayout>
          <MainContent />
        </SingleColumnLayout>
      )}
    </View>
  );
};
```

### Master-Detail Pattern

For tablet interfaces, prefer the master-detail pattern for list-detail views:

```tsx
import { MasterDetailView } from '../components/MasterDetailView';

const MyScreen = () => {
  return (
    <MasterDetailView
      masterContent={<ItemList />}
      detailContent={<ItemDetail />}
      ratio={0.3} // 30% for master, 70% for detail
    />
  );
};
```

### Touch Targets

Ensure all interactive elements meet minimum touch target sizes:

- Mobile: 44×44 pts minimum
- Tablet: 48×48 pts recommended

```tsx
// Proper touch target sizing
<TouchableOpacity 
  style={[
    commonStyles.touchTarget, 
    isTablet && commonStyles.touchTargetTablet
  ]}
  onPress={handlePress}
>
  <Icon name="edit" />
</TouchableOpacity>
```

### Orientation Support

Implement layouts that work in both portrait and landscape orientations:

```tsx
import { useOrientation } from '../hooks/useOrientation';

const MyComponent = () => {
  const { isLandscape } = useOrientation();
  
  return (
    <View style={[
      styles.container,
      isLandscape && styles.landscapeContainer
    ]}>
      {/* Content */}
    </View>
  );
};
```

## Best Practices

1. **Always use theme colors** instead of hardcoded hex values
2. **Use common components** for consistent UI (ScreenContainer, Header, FormLayout)
3. **Use Paper components** (Surface, Text, Card) with proper theme integration
4. **Follow MD3 spacing principles** using the theme's spacing system
5. **Apply consistent elevation** using the Surface component
6. **Support both light and dark modes** by using theme colors
7. **Use text variants** instead of custom font styling
8. **Optimize for tablet interfaces** where administrators will be using the app
9. **Test on multiple devices** to ensure cross-device compatibility
10. **Implement responsive patterns** for adaptable UI
11. **Leverage common styles** where possible
12. **Ensure proper contrast** between text and backgrounds

## Component Structure Template

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { commonStyles } from '../styles/commonStyles';
import type { AppTheme } from '../theme/theme';

export const MyComponent = () => {
  const theme = useTheme<AppTheme>();
  
  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium">Title</Text>
      <Text variant="bodyMedium">Content</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
``` 