import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface GridProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fluid?: boolean;
  padding?: number;
  spacing?: number;
}

/**
 * A responsive container component that works similar to Bootstrap's container.
 * It applies appropriate max-width constraints based on screen size.
 */
export const Grid: React.FC<GridProps> = ({
  children,
  style,
  fluid = false,
  padding = 16,
  spacing = 16,
}) => {
  const { breakpoint } = useBreakpoint();
  
  // Compute max width based on breakpoint unless fluid is true
  const maxWidth = fluid ? '100%' : (() => {
    switch (breakpoint) {
      case 'xs': return '100%';
      case 'sm': return 540;
      case 'md': return 720;
      case 'lg': return 960;
      case 'xl': return 1140;
      default: return '100%';
    }
  })();
  
  return (
    <View 
      style={[
        styles.container,
        { padding, maxWidth },
        style
      ]}
    >
      {React.Children.map(children, child => {
        // Pass down the spacing prop to Row components
        if (React.isValidElement(child) && 
            typeof child.type === 'function' && 
            (child.type as any).displayName === 'Row') {
          return React.cloneElement(child, { spacing });
        }
        return child;
      })}
    </View>
  );
};

// Set display name for child component recognition
Grid.displayName = 'Grid';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
}); 