import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { AppTheme } from '../../theme/theme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAccessibility } from '../AccessibilityProvider';

type CardElevation = 0 | 1 | 2 | 3 | 4;

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  elevation?: CardElevation;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  rightAction?: React.ReactNode;
  leftIcon?: React.ReactNode;
  animateEntry?: boolean;
  headerStyle?: ViewStyle;
}

/**
 * Enhanced Card component following Material Design 3 guidelines
 * with improved accessibility and animation features
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  elevation = 1,
  style,
  contentStyle,
  onPress,
  testID,
  accessibilityLabel,
  accessibilityHint,
  rightAction,
  leftIcon,
  animateEntry = true,
  headerStyle,
}) => {
  const { theme } = useThemedStyles();
  const { settings } = useAccessibility();
  
  // Apply reduced motion settings if enabled
  const animationDuration = (settings.reduceMotion || !animateEntry) ? 0 : 300;
  
  const hasHeader = title || subtitle || leftIcon || rightAction;
  
  const renderHeader = () => {
    if (!hasHeader) return null;
    
    return (
      <View style={[styles(theme).header, headerStyle]}>
        <View style={styles(theme).headerLeft}>
          {leftIcon && (
            <View style={styles(theme).leftIcon}>
              {leftIcon}
            </View>
          )}
          
          {(title || subtitle) && (
            <View style={styles(theme).titleContainer}>
              {title && (
                <Text 
                  variant="titleMedium" 
                  style={styles(theme).title}
                  numberOfLines={1}
                  accessibilityRole="header"
                >
                  {title}
                </Text>
              )}
              
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
          )}
        </View>
        
        {rightAction && (
          <View style={styles(theme).rightAction}>
            {rightAction}
          </View>
        )}
      </View>
    );
  };
  
  const renderCardContent = () => (
    <Surface
      style={[styles(theme).container, style]}
      elevation={elevation}
    >
      {hasHeader && renderHeader()}
      <View style={[styles(theme).content, !hasHeader && styles(theme).contentWithoutHeader, contentStyle]}>
        {children}
      </View>
    </Surface>
  );
  
  if (onPress) {
    return (
      <Animated.View entering={FadeIn.duration(animationDuration)}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || title}
          accessibilityHint={accessibilityHint}
          testID={testID}
        >
          {renderCardContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View entering={FadeIn.duration(animationDuration)}>
      <View 
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {renderCardContent()}
      </View>
    </Animated.View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    borderRadius: theme.shapes.corner.medium,
    marginVertical: theme.spacing.s,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderBottomWidth: theme.shapes.border.thin,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftIcon: {
    marginRight: theme.spacing.s,
  },
  rightAction: {
    marginLeft: theme.spacing.s,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  content: {
    padding: theme.spacing.m,
  },
  contentWithoutHeader: {
    padding: theme.spacing.m,
  },
}); 