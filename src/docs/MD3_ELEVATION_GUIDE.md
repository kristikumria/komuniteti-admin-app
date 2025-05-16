# Material Design 3 Elevation Guide

This guide outlines how to apply consistent elevation throughout the Komuniteti Admin App, following Material Design 3 principles.

## What is Elevation?

Elevation in Material Design 3 refers to the visual appearance of distance between surfaces. It's primarily represented using shadows, but can also include other visual cues. Proper use of elevation:

- Creates visual hierarchy and focus
- Indicates component states and importance
- Improves UI navigation and understanding
- Provides consistency across the application

## Elevation Levels

We've defined 6 standard elevation levels in `src/theme/elevation.ts`:

| Level | Value | Primary Use Cases |
|-------|-------|------------------|
| Level0 | 0 | Flat surfaces, backgrounds, disabled components |
| Level1 | 1 | Cards, buttons, basic surfaces |
| Level2 | 2 | Active cards, bottom sheets, app bars |
| Level3 | 3 | Navigation drawer, dialogs, modals |
| Level4 | 4 | Floating action buttons (FABs), pickers |
| Level5 | 5 | Dropdown menus, toast messages |

## How to Apply Elevation

### Using with React Native Paper Components

Most React Native Paper components (like Surface, Card, FAB) have built-in elevation support. Use our standard levels for consistency:

```tsx
import { Surface } from 'react-native-paper';
import { ElevationLevel } from '../theme';

// Card component
<Surface elevation={ElevationLevel.Level1} style={styles.card}>
  {/* Card content */}
</Surface>

// Modal or dialog
<Surface elevation={ElevationLevel.Level3} style={styles.modal}>
  {/* Modal content */}
</Surface>

// Floating Action Button (already has elevation, but confirm level)
<FAB
  icon="plus"
  style={styles.fab}
  // React Native Paper FABs should be set to Level4
/>
```

### Using with Custom Components

For custom components, use the `getElevationStyle` helper:

```tsx
import { StyleSheet, View } from 'react-native';
import { ElevationLevel, getElevationStyle } from '../theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const MyCustomComponent = () => {
  const { theme } = useThemedStyles();
  
  return (
    <View style={[
      styles.container, 
      getElevationStyle(ElevationLevel.Level2, theme)
    ]}>
      {/* Component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // other styles
  }
});
```

## Elevation Best Practices

1. **Consistency**: Use the defined elevation levels consistently throughout the app

2. **Hierarchy**: Higher elevation should indicate more importance or interactivity:
   - Level 1: Basic cards, subtle elevation
   - Level 2-3: Interactive elements, navigation surfaces
   - Level 4-5: Floating actions, overlays, highest priority items

3. **Dark Mode Awareness**: Our elevation utilities automatically adjust shadow appearance for dark mode

4. **Platform Adaptation**: Our utilities handle platform differences (Android vs iOS) automatically

5. **Maintain Contrast**: Ensure there's enough contrast between surfaces of different elevations

## Implementation Examples

### Cards and Lists

```tsx
// Regular list item
<Surface elevation={ElevationLevel.Level1} style={styles.listItem}>
  <ListItem {...props} />
</Surface>

// Active/selected list item
<Surface elevation={ElevationLevel.Level2} style={styles.activeListItem}>
  <ListItem {...props} />
</Surface>
```

### Modals and Dialogs

```tsx
<Surface elevation={ElevationLevel.Level3} style={styles.modal}>
  <Text>Modal Content</Text>
  <Button>Confirm</Button>
</Surface>
```

### Navigation Elements

```tsx
// Bottom navigation
<Surface elevation={ElevationLevel.Level2} style={styles.bottomNav}>
  {/* Navigation items */}
</Surface>

// Side drawer
<Surface elevation={ElevationLevel.Level3} style={styles.drawer}>
  {/* Drawer content */}
</Surface>
```

## Color and Elevation

Material Design 3 often uses subtle color changes along with elevation changes. When increasing elevation, consider:

- Slightly lightening surface colors in light mode
- Slightly darkening surface colors in dark mode

Our theme provides appropriate surface colors for different elevations.

## Testing Elevation

When implementing elevation:

1. Test on both Android and iOS
2. Test in both light and dark modes
3. Check accessibility - ensure shadows don't create readability issues
4. Verify that the elevation hierarchy makes sense across screens

## Common Issues and Solutions

### Shadows Not Appearing on Android

Make sure you're using the correct approach:

```tsx
// For React Native Paper components
<Surface elevation={ElevationLevel.Level2}>
  {/* Content */}
</Surface>

// For custom components
<View style={getElevationStyle(ElevationLevel.Level2, theme)}>
  {/* Content */}
</View>
```

### Inconsistent Shadow Appearance on iOS

iOS shadows require more configuration. Always use our `getElevationStyle` helper rather than manually configuring shadows.

### Z-Index Issues

Remember that elevation is visual - it doesn't automatically set z-index. For overlapping components, set both elevation and z-index:

```tsx
<View style={[
  getElevationStyle(ElevationLevel.Level4, theme),
  { zIndex: 10 } // Match higher elevation with higher z-index
]}>
  {/* Content */}
</View>
```

## Migrating Existing Components

When updating existing components:

1. Replace hardcoded elevation/shadow values with our standardized levels
2. Ensure the elevation level matches the component's purpose and importance
3. Use `ElevationLevel` enums instead of raw numbers
4. For custom shadows, replace with `getElevationStyle()`

## Further Reading

- [Material Design 3 Elevation Guidelines](https://m3.material.io/styles/elevation/overview)
- [React Native Paper Surface Documentation](https://callstack.github.io/react-native-paper/Surface.html) 