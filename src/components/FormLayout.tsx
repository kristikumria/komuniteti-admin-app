import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Surface } from 'react-native-paper';
import { useAppSelector } from '../store/hooks';
import { commonStyles } from '../styles/commonStyles';
import type { AppTheme } from '../theme/theme';

interface FormLayoutProps {
  children: ReactNode;
  padding?: number;
  spacing?: number;
  useSurface?: boolean;
}

/**
 * A component for consistent form layout and styling
 */
export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  padding = 16,
  spacing = 16,
  useSurface = false,
}) => {
  const theme = useTheme<AppTheme>();
  
  // Calculate styles based on props
  const containerStyle = {
    padding,
  };
  
  // Wrap each child in a View with proper spacing
  const childrenWithSpacing = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    // Apply spacing to all except the last child
    const isLastChild = index === React.Children.count(children) - 1;
    
    // Wrap in a View with margin instead of trying to modify the child directly
    return (
      <View style={!isLastChild ? { marginBottom: spacing } : undefined}>
        {child}
      </View>
    );
  });
  
  // If using surface, wrap in a Surface component
  if (useSurface) {
    return (
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        <View style={containerStyle}>
          {childrenWithSpacing}
        </View>
      </Surface>
    );
  }
  
  // Otherwise just use a View
  return (
    <View style={[containerStyle, { backgroundColor: theme.colors.background }]}>
      {childrenWithSpacing}
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    borderRadius: 8,
    marginBottom: 16,
  },
}); 