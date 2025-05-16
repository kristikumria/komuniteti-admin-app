import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Surface, 
  Text, 
  Button, 
  Divider,
  Card,
  Chip
} from 'react-native-paper';

import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppHeader } from '../../components/AppHeader';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

/**
 * A showcase screen that demonstrates the theme system, available tokens,
 * and how colors adapt in light and dark mode
 */
export const ThemeShowcase = () => {
  const { theme, commonStyles } = useThemedStyles();

  // Reusable color swatch component
  const ColorSwatch = ({ color, name, value }: { color: string, name: string, value: string }) => (
    <View style={styles(theme).colorSwatchContainer}>
      <View style={[styles(theme).colorSwatch, { backgroundColor: color }]} />
      <View style={styles(theme).colorInfo}>
        <Text variant="labelSmall" style={styles(theme).colorName}>{name}</Text>
        <Text variant="bodySmall" style={styles(theme).colorValue}>{value}</Text>
      </View>
    </View>
  );

  // Spacing showcase component
  const SpacingExample = ({ size, value }: { size: string, value: number }) => (
    <View style={styles(theme).spacingExample}>
      <Text variant="bodySmall" style={styles(theme).spacingLabel}>{size}</Text>
      <View style={[styles(theme).spacingBlock, { width: value, height: value }]} />
      <Text variant="bodySmall" style={styles(theme).spacingValue}>{value}px</Text>
    </View>
  );

  return (
    <View style={commonStyles.screenContainer}>
      <AppHeader
        title="Theme System"
        subtitle="Colors, Spacing, Typography"
        showBack
        elevation={ElevationLevel.Level3}
      />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).container}>
          <Text variant="headlineMedium" style={styles(theme).heading}>
            Material Design 3 Theme
          </Text>
          <Text variant="bodyMedium" style={styles(theme).description}>
            This showcase demonstrates the theme system used throughout the app, 
            including colors, spacing, typography, and dark mode support.
          </Text>

          <Surface elevation={ElevationLevel.Level1} style={styles(theme).themeToggleContainer}>
            <Text variant="titleMedium" style={styles(theme).themeToggleTitle}>
              Try It: Toggle Theme
            </Text>
            <Text variant="bodySmall" style={styles(theme).themeToggleDescription}>
              Switch between light and dark mode to see how colors adapt
            </Text>
            <ThemeToggle />
          </Surface>

          <Divider style={styles(theme).divider} />
          
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Primary Colors
          </Text>

          <Surface elevation={ElevationLevel.Level1} style={styles(theme).section}>
            <ColorSwatch color={theme.colors.primary} name="primary" value={theme.colors.primary} />
            <ColorSwatch color={theme.colors.onPrimary} name="onPrimary" value={theme.colors.onPrimary} />
            <ColorSwatch color={theme.colors.primaryContainer} name="primaryContainer" value={theme.colors.primaryContainer} />
            <ColorSwatch color={theme.colors.onPrimaryContainer} name="onPrimaryContainer" value={theme.colors.onPrimaryContainer} />
          </Surface>
          
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Surface Colors
          </Text>

          <Surface elevation={ElevationLevel.Level1} style={styles(theme).section}>
            <ColorSwatch color={theme.colors.background} name="background" value={theme.colors.background} />
            <ColorSwatch color={theme.colors.onBackground} name="onBackground" value={theme.colors.onBackground} />
            <ColorSwatch color={theme.colors.surface} name="surface" value={theme.colors.surface} />
            <ColorSwatch color={theme.colors.onSurface} name="onSurface" value={theme.colors.onSurface} />
            <ColorSwatch color={theme.colors.surfaceVariant} name="surfaceVariant" value={theme.colors.surfaceVariant} />
            <ColorSwatch color={theme.colors.onSurfaceVariant} name="onSurfaceVariant" value={theme.colors.onSurfaceVariant} />
          </Surface>

          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Status Colors
          </Text>

          <Surface elevation={ElevationLevel.Level1} style={styles(theme).section}>
            <ColorSwatch color={theme.colors.error} name="error" value={theme.colors.error} />
            <ColorSwatch color={theme.colors.onError} name="onError" value={theme.colors.onError} />
            <ColorSwatch color={theme.colors.success} name="success" value={theme.colors.success} />
            <ColorSwatch color={theme.colors.onSuccess} name="onSuccess" value={theme.colors.onSuccess} />
          </Surface>

          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Spacing Tokens
          </Text>

          <Surface elevation={ElevationLevel.Level1} style={styles(theme).section}>
            <View style={styles(theme).spacingRow}>
              <SpacingExample size="xs" value={theme.spacing.xs} />
              <SpacingExample size="s" value={theme.spacing.s} />
              <SpacingExample size="m" value={theme.spacing.m} />
            </View>
            <View style={styles(theme).spacingRow}>
              <SpacingExample size="l" value={theme.spacing.l} />
              <SpacingExample size="xl" value={theme.spacing.xl} />
              <SpacingExample size="xxl" value={theme.spacing.xxl} />
            </View>
          </Surface>

          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Theme-Aware Component Examples
          </Text>

          <Card style={styles(theme).exampleCard}>
            <Card.Title title="Theme-Aware Card" />
            <Card.Content>
              <Text variant="bodyMedium">
                This card component automatically adapts to the current theme.
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined">Cancel</Button>
              <Button mode="contained">Confirm</Button>
            </Card.Actions>
          </Card>

          <View style={styles(theme).chipExamples}>
            <Chip mode="flat" selected>Theme-aware chip</Chip>
            <Chip mode="outlined">Outlined chip</Chip>
          </View>

          <View style={styles(theme).buttonExamples}>
            <Button mode="contained">Primary Button</Button>
            <Button mode="outlined">Outlined Button</Button>
            <Button mode="contained-tonal">Tonal Button</Button>
            <Button mode="elevated">Elevated Button</Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  scrollView: {
    flex: 1,
  },
  heading: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  description: {
    marginBottom: theme.spacing.l,
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    marginVertical: theme.spacing.m,
  },
  section: {
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  colorSwatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  colorValue: {
    color: theme.colors.onSurfaceVariant,
  },
  themeToggleContainer: {
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    marginTop: theme.spacing.m,
  },
  themeToggleTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.onSurface,
  },
  themeToggleDescription: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  spacingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.m,
  },
  spacingExample: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacingBlock: {
    backgroundColor: theme.colors.primary,
    marginVertical: theme.spacing.xs,
  },
  spacingLabel: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
  },
  spacingValue: {
    color: theme.colors.onSurfaceVariant,
  },
  exampleCard: {
    marginBottom: theme.spacing.m,
  },
  chipExamples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  buttonExamples: {
    flexDirection: 'column',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
}); 