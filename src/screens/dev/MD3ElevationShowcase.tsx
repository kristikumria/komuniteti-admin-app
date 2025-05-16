import React from 'react';
import { StyleSheet, View, ScrollView, Text as RNText } from 'react-native';
import { Surface, Text, Card, Button, Divider } from 'react-native-paper';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppHeader } from '../../components/AppHeader';
import { ElevationLevel, getElevationStyle } from '../../theme';
import type { AppTheme } from '../../theme/theme';

/**
 * A showcase screen to demonstrate the MD3 elevation system implementation
 * This screen serves as both documentation and a visual test for the elevation system
 */
export const MD3ElevationShowcase = () => {
  const { theme, commonStyles } = useThemedStyles();

  // Custom component to demonstrate elevation
  const ElevationExample = ({ level, title }: { level: ElevationLevel; title: string }) => (
    <Surface elevation={level} style={styles(theme).elevationSample}>
      <Text variant="labelMedium">{title}</Text>
      <Text variant="bodySmall">Elevation {level}</Text>
    </Surface>
  );

  // Custom component with getElevationStyle for direct styling
  const CustomElevatedBox = ({ level, title }: { level: ElevationLevel; title: string }) => (
    <View 
      style={[
        styles(theme).customElevationSample,
        getElevationStyle(level, theme)
      ]}
    >
      <Text variant="labelMedium">{title}</Text>
      <Text variant="bodySmall">Custom with Level {level}</Text>
    </View>
  );

  return (
    <View style={commonStyles.screenContainer}>
      <AppHeader
        title="MD3 Elevation System"
        subtitle="Implementation Guide"
        showBack
        elevation={ElevationLevel.Level3}
      />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).section}>
          <Text variant="headlineSmall" style={styles(theme).heading}>
            Elevation System
          </Text>
          <Text variant="bodyMedium" style={styles(theme).description}>
            Our MD3 implementation provides a consistent approach to elevation across 
            both iOS and Android. Each level serves a specific purpose in the UI hierarchy.
          </Text>

          <Divider style={styles(theme).divider} />
          
          {/* Surface Component Examples */}
          <Text variant="titleMedium" style={styles(theme).subheading}>
            Using Surface Component
          </Text>
          <Text variant="bodySmall" style={styles(theme).note}>
            The recommended way to implement elevation in most cases
          </Text>
          
          <View style={styles(theme).grid}>
            <ElevationExample level={ElevationLevel.Level0} title="Level 0" />
            <ElevationExample level={ElevationLevel.Level1} title="Level 1" />
            <ElevationExample level={ElevationLevel.Level2} title="Level 2" />
            <ElevationExample level={ElevationLevel.Level3} title="Level 3" />
            <ElevationExample level={ElevationLevel.Level4} title="Level 4" />
            <ElevationExample level={ElevationLevel.Level5} title="Level 5" />
          </View>
          
          {/* Custom Styling Examples */}
          <Text variant="titleMedium" style={styles(theme).subheading}>
            Using getElevationStyle
          </Text>
          <Text variant="bodySmall" style={styles(theme).note}>
            For custom components where Surface isn't suitable
          </Text>
          
          <View style={styles(theme).grid}>
            <CustomElevatedBox level={ElevationLevel.Level1} title="Level 1" />
            <CustomElevatedBox level={ElevationLevel.Level3} title="Level 3" />
            <CustomElevatedBox level={ElevationLevel.Level5} title="Level 5" />
          </View>
          
          {/* Real-world Examples */}
          <Text variant="titleMedium" style={styles(theme).subheading}>
            Real-world Usage Examples
          </Text>
          
          <Text variant="titleSmall" style={styles(theme).componentTitle}>
            Cards (Level 1)
          </Text>
          <Card style={styles(theme).card}>
            <Card.Content>
              <Text variant="titleMedium">Regular Card</Text>
              <Text variant="bodyMedium">This is a standard card with Level 1 elevation</Text>
            </Card.Content>
            <Card.Actions>
              <Button>Action</Button>
            </Card.Actions>
          </Card>
          
          <Text variant="titleSmall" style={styles(theme).componentTitle}>
            Active Card (Level 2)
          </Text>
          <Surface elevation={ElevationLevel.Level2} style={styles(theme).card}>
            <Card.Content>
              <Text variant="titleMedium">Active Card</Text>
              <Text variant="bodyMedium">
                This card has Level 2 elevation to indicate it's active or highlighted
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button>Cancel</Button>
              <Button mode="contained">Submit</Button>
            </Card.Actions>
          </Surface>
          
          <Text variant="titleSmall" style={styles(theme).componentTitle}>
            Modal-Like Container (Level 3)
          </Text>
          <Surface elevation={ElevationLevel.Level3} style={styles(theme).card}>
            <Card.Content>
              <Text variant="titleMedium">Modal Dialog</Text>
              <Text variant="bodyMedium">
                Level 3 elevation is used for modal-like components that float above the main content
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button>Cancel</Button>
              <Button mode="contained">Confirm</Button>
            </Card.Actions>
          </Surface>
        </View>
        
        <View style={styles(theme).section}>
          <Text variant="headlineSmall" style={styles(theme).heading}>
            Implementation Guide
          </Text>
          
          <Text variant="titleMedium" style={styles(theme).subheading}>
            Using Surface
          </Text>
          <View style={styles(theme).codeBox}>
            <RNText style={styles(theme).code}>
              {`<Surface elevation={ElevationLevel.Level2}>\n  <Text>Content</Text>\n</Surface>`}
            </RNText>
          </View>
          
          <Text variant="titleMedium" style={styles(theme).subheading}>
            Using getElevationStyle
          </Text>
          <View style={styles(theme).codeBox}>
            <RNText style={styles(theme).code}>
              {`<View style={[\n  styles.myComponent,\n  getElevationStyle(ElevationLevel.Level2, theme)\n]}>\n  <Text>Content</Text>\n</View>`}
            </RNText>
          </View>
          
          <Text variant="titleMedium" style={styles(theme).subheading}>
            Recommended Usage
          </Text>
          <View style={styles(theme).usageTable}>
            <View style={styles(theme).usageRow}>
              <Text variant="labelMedium" style={styles(theme).usageLevel}>Level 0</Text>
              <Text variant="bodyMedium">No elevation, flat surfaces</Text>
            </View>
            <View style={styles(theme).usageRow}>
              <Text variant="labelMedium" style={styles(theme).usageLevel}>Level 1</Text>
              <Text variant="bodyMedium">Cards, buttons, standard surfaces</Text>
            </View>
            <View style={styles(theme).usageRow}>
              <Text variant="labelMedium" style={styles(theme).usageLevel}>Level 2</Text>
              <Text variant="bodyMedium">Active cards, bottom sheets</Text>
            </View>
            <View style={styles(theme).usageRow}>
              <Text variant="labelMedium" style={styles(theme).usageLevel}>Level 3</Text>
              <Text variant="bodyMedium">Navigation drawer, dialogs</Text>
            </View>
            <View style={styles(theme).usageRow}>
              <Text variant="labelMedium" style={styles(theme).usageLevel}>Level 4</Text>
              <Text variant="bodyMedium">Floating action buttons</Text>
            </View>
            <View style={styles(theme).usageRow}>
              <Text variant="labelMedium" style={styles(theme).usageLevel}>Level 5</Text>
              <Text variant="bodyMedium">Menus, tooltips, maximum elevation</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  heading: {
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.s,
    fontWeight: 'bold',
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },
  subheading: {
    color: theme.colors.onBackground,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
  },
  note: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },
  divider: {
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: theme.spacing.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.l,
  },
  elevationSample: {
    width: '48%',
    minHeight: 80,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
  customElevationSample: {
    width: '48%',
    minHeight: 80,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
  },
  componentTitle: {
    color: theme.colors.onBackground,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
  },
  card: {
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
  codeBox: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.m,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  usageTable: {
    marginTop: theme.spacing.m,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  usageRow: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  usageLevel: {
    width: 80,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
}); 