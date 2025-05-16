import React from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAccessibility } from './AccessibilityProvider';

interface FormLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  useSurface?: boolean;
  testID?: string;
  title?: string;
  subtitle?: string;
  maxWidth?: number;
  centered?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4;
  accessibilityLabel?: string;
}

/**
 * A component for consistent form layout and styling following Material Design 3 guidelines.
 * Provides proper keyboard avoiding behavior, optional scrolling, and surface elevation.
 * Includes responsive design and accessibility features.
 * 
 * @example
 * <FormLayout scrollable useSurface title="Create Account" subtitle="Please fill in your details">
 *   <MyFormContent />
 * </FormLayout>
 */
export const FormLayout = ({ 
  children, 
  scrollable = true, 
  padded = true,
  useSurface = false,
  testID,
  title,
  subtitle,
  maxWidth = 600,
  centered = true,
  elevation = 1,
  accessibilityLabel
}: FormLayoutProps) => {
  const { theme } = useThemedStyles();
  const { width } = useWindowDimensions();
  const { settings } = useAccessibility();
  
  // Apply reduced motion settings if enabled
  const animationDuration = settings.reduceMotion ? 0 : 300;
  
  // Determine if we're on a larger screen and should constrain width
  const isWideScreen = width > maxWidth + theme.spacing.l * 2;
  
  const renderHeader = () => {
    if (!title && !subtitle) return null;
    
    return (
      <View style={styles(theme).headerContainer}>
        {title && (
          <Text 
            variant="headlineSmall" 
            style={styles(theme).title}
            accessibilityRole="header"
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text 
            variant="bodyMedium" 
            style={styles(theme).subtitle}
            accessibilityRole="text"
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };
  
  const renderContent = () => {
    const content = (
      <View 
        style={[
          styles(theme).contentContainer, 
          !padded && styles(theme).noPadding,
          isWideScreen && centered && styles(theme).centeredContent,
          isWideScreen && { maxWidth },
        ]}
        accessibilityRole="none"
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible={!!accessibilityLabel}
      >
        {renderHeader()}
        {children}
      </View>
    );

    if (useSurface) {
      return (
        <Animated.View entering={FadeIn.duration(animationDuration)}>
          <Surface 
            style={[
              styles(theme).surface, 
              isWideScreen && centered && styles(theme).centeredSurface,
              isWideScreen && { maxWidth }
            ]} 
            elevation={elevation}
          >
            <View style={styles(theme).overflowContainer}>
              {content}
            </View>
          </Surface>
        </Animated.View>
      );
    }

    return content;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles(theme).container,
        isWideScreen && centered && styles(theme).centeredContainer
      ]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {scrollable ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles(theme).scrollContent,
            !padded && styles(theme).noPadding,
            isWideScreen && centered && styles(theme).centeredScroll
          ]}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
          accessibilityRole="scrollbar"
        >
          {renderContent()}
        </ScrollView>
      ) : (
        renderContent()
      )}
    </KeyboardAvoidingView>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    alignItems: 'center',
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  centeredContent: {
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  centeredScroll: {
    alignItems: 'center',
  },
  noPadding: {
    padding: 0,
  },
  surface: {
    margin: theme.spacing.m,
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surface,
  },
  centeredSurface: {
    alignSelf: 'center',
    width: '100%',
    marginHorizontal: 'auto',
  },
  overflowContainer: {
    overflow: 'hidden',
    borderRadius: theme.shapes.corner.medium,
  },
  headerContainer: {
    marginBottom: theme.spacing.m,
  },
  title: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  }
}); 