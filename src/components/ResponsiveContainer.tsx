import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { AppTheme } from '../theme/theme';

interface ResponsiveContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centerContent?: boolean;
  gutter?: 'none' | 'xs' | 's' | 'm' | 'l';
}

/**
 * A responsive container to wrap content with appropriate sizing and spacing
 * based on the current screen size. Helps implement consistent responsive layouts.
 * 
 * @example
 * <ResponsiveContainer maxWidth="md" centerContent>
 *   <YourComponent />
 * </ResponsiveContainer>
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  maxWidth = 'full',
  centerContent = false,
  gutter = 'm',
}) => {
  const theme = useTheme() as AppTheme;
  const breakpoint = useBreakpoint();
  
  // Determine max width based on the prop
  const getMaxWidth = (): number | undefined => {
    switch (maxWidth) {
      case 'sm': return 540;
      case 'md': return 720;
      case 'lg': return 960;
      case 'xl': return 1140;
      case 'full': return undefined;
      default: return undefined;
    }
  };
  
  // Determine padding based on breakpoint and gutter
  const getPadding = (): number => {
    if (gutter === 'none') return 0;
    
    // Use theme spacing values for consistency
    const gutterValues = {
      xs: theme.spacing.xs,
      s: theme.spacing.s,
      m: theme.spacing.m,
      l: theme.spacing.l,
    };
    
    // Default to 'm' if an invalid value is provided
    return gutterValues[gutter] || theme.spacing.m;
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: getMaxWidth(),
          paddingHorizontal: getPadding(),
          alignItems: centerContent ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
}); 