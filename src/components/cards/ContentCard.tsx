import React, { ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface ContentCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  elevation?: ElevationLevel;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  onPress?: () => void;
  variant?: 'filled' | 'outlined' | 'elevated';
}

/**
 * A flexible card component that follows Material Design 3 principles.
 * Can be used in different variants: filled, outlined, or elevated.
 * 
 * @example
 * <ContentCard 
 *   title="Card Title" 
 *   subtitle="Optional subtitle"
 *   elevation={ElevationLevel.Level2}
 *   variant="elevated"
 * >
 *   <YourContent />
 * </ContentCard>
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  children,
  title,
  subtitle,
  elevation = ElevationLevel.Level1,
  style,
  contentStyle,
  headerStyle,
  onPress,
  variant = 'elevated',
}) => {
  const theme = useTheme() as AppTheme;
  
  // Get card styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          ...theme.elevation.level0,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
        };
    }
  };
  
  const cardContent = (
    <>
      {(title || subtitle) && (
        <View style={[styles(theme).header, headerStyle]}>
          {title && (
            <Text variant="titleMedium" style={styles(theme).title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="bodySmall" style={styles(theme).subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={[styles(theme).content, contentStyle]}>
        {children}
      </View>
    </>
  );
  
  // Use TouchableOpacity if card is pressable
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles(theme).container,
          getCardStyles(),
          style,
        ]}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }
  
  // Otherwise use Surface with proper elevation
  return (
    <Surface
      elevation={variant === 'elevated' ? elevation : 0}
      style={[
        styles(theme).container,
        getCardStyles(),
        style,
      ]}
    >
      <View style={styles(theme).overflowContainer}>
        {cardContent}
      </View>
    </Surface>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.m,
  },
  overflowContainer: {
    overflow: 'hidden',
    borderRadius: theme.roundness,
  },
  header: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  content: {
    padding: theme.spacing.m,
  },
  title: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
}); 