import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import { Moon, Sun } from 'lucide-react-native';
import { useDarkMode } from './DarkModeProvider';
import type { AppTheme } from '../theme/theme';

interface ThemeToggleProps {
  showLabel?: boolean;
  compact?: boolean;
  containerStyle?: object;
}

/**
 * A reusable theme toggle component that can be used across screens
 * Provides a consistent way to toggle between light and dark mode
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = true, 
  compact = false,
  containerStyle 
}) => {
  const theme = useTheme() as AppTheme;
  const { isDarkMode, toggleTheme } = useDarkMode();

  return (
    <View style={[
      styles(theme).container, 
      compact ? styles(theme).compactContainer : {}, 
      containerStyle
    ]}>
      {showLabel && (
        <Text 
          variant={compact ? "labelMedium" : "bodyMedium"} 
          style={styles(theme).label}
        >
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
      )}
      
      <View style={styles(theme).switchContainer}>
        {isDarkMode ? (
          <Moon 
            size={compact ? 18 : 22} 
            color={theme.colors.primary} 
            style={styles(theme).icon} 
          />
        ) : (
          <Sun 
            size={compact ? 18 : 22} 
            color={theme.colors.primary} 
            style={styles(theme).icon} 
          />
        )}
        
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          color={theme.colors.primary}
        />
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  compactContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
  },
  label: {
    color: theme.colors.onSurface,
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.s,
  }
}); 