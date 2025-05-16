import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  marginBottom?: number;
  marginTop?: number;
}

/**
 * A component for consistent section headers across the application.
 * Follows MD3 design principles for typography and spacing.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightContent,
  marginBottom = 16,
  marginTop = 0,
}) => {
  const { theme } = useThemedStyles();
  
  return (
    <View 
      style={[
        styles(theme).container, 
        { 
          marginBottom, 
          marginTop,
        }
      ]}
    >
      <View style={styles(theme).titleContainer}>
        <View>
          <Text 
            variant="titleMedium" 
            style={styles(theme).title}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              variant="bodyMedium" 
              style={styles(theme).subtitle}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {rightContent && (
          <View style={styles(theme).rightContent}>
            {rightContent}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.onSurfaceVariant,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 