import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ElevationLevel, getElevationStyle } from '../../theme';

/**
 * An example component demonstrating proper use of elevation in MD3
 * This can be used for reference or as a visual test for elevation across platforms
 */
export const ElevationExample = () => {
  const { theme } = useThemedStyles();

  // Example of creating a custom elevated component with our utility
  const CustomElevatedBox = ({ level, title }: { level: ElevationLevel; title: string }) => (
    <View 
      style={[
        styles(theme).customBox,
        getElevationStyle(level, theme)
      ]}
    >
      <Text variant="labelMedium">{title}</Text>
      <Text variant="bodySmall">Custom Component</Text>
      <Text variant="bodySmall">Level {level}</Text>
    </View>
  );

  return (
    <ScrollView style={styles(theme).container} contentContainerStyle={styles(theme).content}>
      <Text variant="headlineMedium" style={styles(theme).title}>
        Elevation System Example
      </Text>
      <Text variant="bodyMedium" style={styles(theme).description}>
        This example demonstrates the different elevation levels available in our MD3 implementation.
      </Text>

      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
        Using Surface Component
      </Text>
      <Text variant="bodySmall" style={styles(theme).sectionDescription}>
        The preferred way for most components
      </Text>

      <View style={styles(theme).row}>
        <Surface elevation={ElevationLevel.Level0} style={styles(theme).surface}>
          <View style={styles(theme).overflowContainer}>
            <Text variant="labelMedium">Level 0</Text>
            <Text variant="bodySmall">No elevation</Text>
          </View>
        </Surface>

        <Surface elevation={ElevationLevel.Level1} style={styles(theme).surface}>
          <View style={styles(theme).overflowContainer}>
            <Text variant="labelMedium">Level 1</Text>
            <Text variant="bodySmall">Cards, Buttons</Text>
          </View>
        </Surface>
      </View>

      <View style={styles(theme).row}>
        <Surface elevation={ElevationLevel.Level2} style={styles(theme).surface}>
          <View style={styles(theme).overflowContainer}>
            <Text variant="labelMedium">Level 2</Text>
            <Text variant="bodySmall">Active Cards</Text>
          </View>
        </Surface>

        <Surface elevation={ElevationLevel.Level3} style={styles(theme).surface}>
          <View style={styles(theme).overflowContainer}>
            <Text variant="labelMedium">Level 3</Text>
            <Text variant="bodySmall">Navigation Drawer</Text>
          </View>
        </Surface>
      </View>

      <View style={styles(theme).row}>
        <Surface elevation={ElevationLevel.Level4} style={styles(theme).surface}>
          <View style={styles(theme).overflowContainer}>
            <Text variant="labelMedium">Level 4</Text>
            <Text variant="bodySmall">FABs, Pickers</Text>
          </View>
        </Surface>

        <Surface elevation={ElevationLevel.Level5} style={styles(theme).surface}>
          <View style={styles(theme).overflowContainer}>
            <Text variant="labelMedium">Level 5</Text>
            <Text variant="bodySmall">Menus, Toasts</Text>
          </View>
        </Surface>
      </View>

      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
        Using getElevationStyle
      </Text>
      <Text variant="bodySmall" style={styles(theme).sectionDescription}>
        For custom components without Surface
      </Text>

      <View style={styles(theme).row}>
        <CustomElevatedBox level={ElevationLevel.Level1} title="Level 1" />
        <CustomElevatedBox level={ElevationLevel.Level2} title="Level 2" />
      </View>

      <View style={styles(theme).row}>
        <CustomElevatedBox level={ElevationLevel.Level3} title="Level 3" />
        <CustomElevatedBox level={ElevationLevel.Level4} title="Level 4" />
      </View>

      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
        Real World Examples
      </Text>

      {/* Example: Card with proper elevation */}
      <Surface elevation={ElevationLevel.Level1} style={styles(theme).card}>
        <View style={styles(theme).overflowContainer}>
          <Text variant="titleMedium">Regular Card</Text>
          <Text variant="bodyMedium" style={styles(theme).cardDescription}>
            Using Level 1 elevation for standard cards
          </Text>
          <View style={styles(theme).cardFooter}>
            <Button mode="text">Cancel</Button>
            <Button mode="contained">Confirm</Button>
          </View>
        </View>
      </Surface>

      {/* Example: "Active" Card with higher elevation */}
      <Surface elevation={ElevationLevel.Level2} style={styles(theme).card}>
        <View style={styles(theme).overflowContainer}>
          <Text variant="titleMedium">Active Card</Text>
          <Text variant="bodyMedium" style={styles(theme).cardDescription}>
            Using Level 2 elevation to highlight important or active cards
          </Text>
          <View style={styles(theme).cardFooter}>
            <Button mode="text">Cancel</Button>
            <Button mode="contained">Confirm</Button>
          </View>
        </View>
      </Surface>

      {/* Example: Modal-like component */}
      <Surface elevation={ElevationLevel.Level3} style={styles(theme).card}>
        <View style={styles(theme).overflowContainer}>
          <Text variant="titleMedium">Modal/Dialog</Text>
          <Text variant="bodyMedium" style={styles(theme).cardDescription}>
            Using Level 3 elevation for modal-like components
          </Text>
          <View style={styles(theme).cardFooter}>
            <Button mode="text">Cancel</Button>
            <Button mode="contained">Confirm</Button>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
  },
  title: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  description: {
    marginBottom: theme.spacing.l,
    color: theme.colors.onSurfaceVariant,
  },
  sectionTitle: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
    color: theme.colors.onBackground,
  },
  sectionDescription: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  surface: {
    width: '48%',
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    minHeight: 100,
  },
  customBox: {
    width: '48%',
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surfaceVariant,
    minHeight: 100,
  },
  card: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  cardDescription: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.s,
  },
  overflowContainer: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.roundness,
  },
}); 