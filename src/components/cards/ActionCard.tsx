import React, { ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Surface, Text, useTheme, Icon } from 'react-native-paper';
import { ChevronRight } from 'lucide-react-native';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: ElevationLevel;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  showChevron?: boolean;
}

/**
 * An actionable card component with icon support for navigation and actions.
 * Follows Material Design 3 guidelines.
 * 
 * @example
 * <ActionCard
 *   title="View details"
 *   subtitle="Access additional information"
 *   icon={<User size={24} color={theme.colors.primary} />}
 *   onPress={() => navigation.navigate('Details')}
 *   showChevron
 * />
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  rightIcon,
  onPress,
  style,
  elevation = ElevationLevel.Level1,
  variant = 'elevated',
  disabled = false,
  showChevron = false,
}) => {
  const theme = useTheme() as AppTheme;
  
  // Get card styles based on variant
  const getCardStyles = () => {
    const baseStyles = {
      opacity: disabled ? 0.5 : 1,
    };
    
    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surfaceVariant,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          ...theme.elevation.level0,
        };
      case 'elevated':
      default:
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
        };
    }
  };

  const renderContent = () => (
    <View style={styles(theme).contentContainer}>
      {/* Left icon */}
      {icon && (
        <View style={styles(theme).iconContainer}>
          {icon}
        </View>
      )}
      
      {/* Title and subtitle */}
      <View style={styles(theme).textContainer}>
        <Text 
          variant="titleMedium" 
          style={styles(theme).title}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            variant="bodySmall" 
            style={styles(theme).subtitle}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Right icon or chevron */}
      <View style={styles(theme).rightContainer}>
        {rightIcon}
        {showChevron && !rightIcon && (
          <ChevronRight 
            size={20} 
            color={theme.colors.onSurfaceVariant} 
          />
        )}
      </View>
    </View>
  );

  // Wrap in TouchableOpacity if onPress is provided
  if (onPress && !disabled) {
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
        {renderContent()}
      </TouchableOpacity>
    );
  }
  
  // Otherwise use Surface
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
        {renderContent()}
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  iconContainer: {
    marginRight: theme.spacing.m,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContainer: {
    marginLeft: theme.spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.onSurface,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
}); 