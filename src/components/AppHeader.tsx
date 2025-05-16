import React from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ElevationLevel, getElevationStyle } from '../theme';
import type { AppTheme } from '../theme/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightActions?: React.ReactNode;
  elevation?: ElevationLevel;
}

/**
 * AppHeader component that follows Material Design 3 guidelines
 * with proper elevation support for both Android and iOS
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightActions,
  elevation = ElevationLevel.Level2,
}) => {
  const { theme } = useThemedStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Get appropriate elevation styles based on platform and theme
  const elevationStyle = getElevationStyle(elevation, theme);
  
  return (
    <View style={[
      styles(theme).headerContainer,
      elevationStyle,
      { paddingTop: insets.top }
    ]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <Appbar.Header 
        style={styles(theme).header}
        // Remove default elevation as we're handling it separately
        elevated={false}
      >
        {showBack && (
          <Appbar.BackAction onPress={handleBackPress} />
        )}
        
        <View style={styles(theme).titleContainer}>
          <Text variant="titleMedium" style={styles(theme).title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" style={styles(theme).subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {rightActions}
      </Appbar.Header>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    zIndex: 100,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0, // Remove default elevation
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: theme.colors.onSurface,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
}); 