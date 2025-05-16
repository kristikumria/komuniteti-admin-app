import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { Surface } from 'react-native-paper';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  divider?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  elevation?: ElevationLevel;
}

/**
 * A component for grouping related form fields together with an optional title and description.
 * Follows Material Design 3 guidelines.
 * 
 * @example
 * <FormSection
 *   title="Personal Information"
 *   description="Please provide your personal details"
 * >
 *   <FormField label="First Name">
 *     <TextInput value={firstName} onChangeText={setFirstName} />
 *   </FormField>
 *   <FormField label="Last Name">
 *     <TextInput value={lastName} onChangeText={setLastName} />
 *   </FormField>
 * </FormSection>
 */
export const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  description,
  style,
  contentStyle,
  divider = true,
  collapsed = false,
  onToggleCollapse,
  elevation = ElevationLevel.Level0,
}) => {
  const theme = useTheme() as AppTheme;
  
  return (
    <Surface
      elevation={elevation}
      style={[
        styles(theme).container,
        style,
      ]}
    >
      {title && (
        <View style={styles(theme).header}>
          <Text 
            variant="titleMedium" 
            style={styles(theme).title}
          >
            {title}
          </Text>
          {description && (
            <Text 
              variant="bodySmall" 
              style={styles(theme).description}
            >
              {description}
            </Text>
          )}
          {divider && (
            <Divider style={styles(theme).divider} />
          )}
        </View>
      )}
      
      {!collapsed && (
        <View style={[styles(theme).content, contentStyle]}>
          {children}
        </View>
      )}
    </Surface>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.surface,
  },
  header: {
    padding: theme.spacing.m,
  },
  title: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.s,
  },
  divider: {
    marginTop: theme.spacing.s,
  },
  content: {
    padding: theme.spacing.m,
  },
}); 