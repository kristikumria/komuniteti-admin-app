import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Surface, 
  Text, 
  Button, 
  Divider,
  Card,
  useTheme
} from 'react-native-paper';

import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppHeader } from '../../components/AppHeader';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';
import { GridLayout } from '../../components/GridLayout';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

/**
 * A showcase screen that demonstrates responsive layouts using the new components
 */
export const ResponsiveLayoutShowcase = () => {
  const { theme, commonStyles } = useThemedStyles();
  const breakpoint = useBreakpoint();

  // Simple component to display current breakpoint
  const BreakpointInfo = () => (
    <Surface elevation={ElevationLevel.Level1} style={styles(theme).breakpointInfo}>
      <Text variant="titleMedium" style={styles(theme).infoTitle}>
        Current Breakpoint: <Text style={{ color: theme.colors.primary }}>{breakpoint.breakpoint}</Text>
      </Text>
      <Text variant="bodySmall" style={styles(theme).infoDescription}>
        Width: {breakpoint.width}px
      </Text>
      <Text variant="bodySmall" style={styles(theme).infoDescription}>
        Device Type: {
          breakpoint.isPhone ? 'Phone' : 
          breakpoint.isTablet ? 'Tablet' : 
          'Desktop'
        }
      </Text>
      <Divider style={{ marginVertical: theme.spacing.s }} />
      <Text variant="bodySmall" style={styles(theme).infoDescription}>
        Resize your window to see the layout adapt
      </Text>
    </Surface>
  );

  // Demo card for grid layout
  const DemoCard = ({ title, index }: { title: string, index: number }) => (
    <Card style={styles(theme).demoCard}>
      <Card.Content>
        <Text variant="titleMedium">{title}</Text>
        <Text variant="bodyMedium">Item {index}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={commonStyles.screenContainer}>
      <AppHeader
        title="Responsive Layout"
        subtitle="MD3 Adaptive Layouts"
        showBack
        elevation={ElevationLevel.Level3}
      />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).container}>
          <Text variant="headlineMedium" style={styles(theme).heading}>
            Responsive Layout Demo
          </Text>
          <Text variant="bodyMedium" style={styles(theme).description}>
            This showcase demonstrates the responsive layout capabilities using the responsive components.
          </Text>

          <BreakpointInfo />

          <Divider style={styles(theme).divider} />
          
          {/* ResponsiveContainer Demo */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            ResponsiveContainer
          </Text>
          <Text variant="bodyMedium" style={styles(theme).sectionDescription}>
            The ResponsiveContainer component constrains content width and adds appropriate padding.
          </Text>

          {/* Demo different maxWidth settings */}
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
            <View key={size} style={styles(theme).containerDemo}>
              <Text variant="labelMedium" style={styles(theme).containerLabel}>
                maxWidth="{size}"
              </Text>
              <Surface elevation={ElevationLevel.Level1} style={styles(theme).containerSurface}>
                <ResponsiveContainer maxWidth={size} style={styles(theme).demoContainer}>
                  <View style={styles(theme).demoContent}>
                    <Text>Content constrained to {size} width</Text>
                  </View>
                </ResponsiveContainer>
              </Surface>
            </View>
          ))}

          <Divider style={styles(theme).divider} />
          
          {/* GridLayout Demo */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            GridLayout
          </Text>
          <Text variant="bodyMedium" style={styles(theme).sectionDescription}>
            The GridLayout component creates responsive grids that adapt to screen size.
          </Text>
          
          <Surface elevation={ElevationLevel.Level1} style={styles(theme).section}>
            <Text variant="titleMedium" style={{ marginBottom: theme.spacing.m }}>
              Auto-responsive Grid ({`{ xs: 1, sm: 2, md: 3, lg: 4 }`})
            </Text>
            <GridLayout 
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} 
              gap={theme.spacing.m}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <DemoCard key={i} title="Auto Grid Item" index={i + 1} />
              ))}
            </GridLayout>
          </Surface>
          
          <Surface elevation={ElevationLevel.Level1} style={styles(theme).section}>
            <Text variant="titleMedium" style={{ marginBottom: theme.spacing.m }}>
              Fixed Column Grid (2 columns)
            </Text>
            <GridLayout 
              columns={2} 
              gap={theme.spacing.m}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <DemoCard key={i} title="Fixed Grid Item" index={i + 1} />
              ))}
            </GridLayout>
          </Surface>
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
  breakpointInfo: {
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  infoTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.onSurface,
  },
  infoDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
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
    marginBottom: theme.spacing.xs,
    color: theme.colors.onBackground,
  },
  sectionDescription: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  demoCard: {
    flex: 1,
    minHeight: 100,
  },
  containerDemo: {
    marginBottom: theme.spacing.m,
  },
  containerLabel: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.onSurfaceVariant,
  },
  containerSurface: {
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  demoContainer: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  demoContent: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.primary + '20', // semi-transparent
    width: '100%',
    alignItems: 'center',
    borderRadius: theme.roundness,
  },
}); 