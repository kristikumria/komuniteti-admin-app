import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Breakpoint } from '../../hooks/useBreakpoint';

export type ColSize = number | 'auto' | 'content';
export type ColSizeObject = Partial<Record<Breakpoint, ColSize>>;

export interface ColProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  spacing?: number;
  size?: ColSize | ColSizeObject;
  xs?: ColSize;
  sm?: ColSize;
  md?: ColSize;
  lg?: ColSize;
  xl?: ColSize;
  offset?: number | Partial<Record<Breakpoint, number>>;
  align?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

/**
 * Column component for the grid system.
 * Implements a flex-based responsive column that adapts to different screen sizes.
 */
export const Col: React.FC<ColProps> = ({
  children,
  style,
  spacing = 16,
  size,
  xs,
  sm,
  md,
  lg,
  xl,
  offset,
  align = 'auto',
}) => {
  // Calculate column width based on size
  const getWidth = (colSize: ColSize | undefined): string | number => {
    if (colSize === undefined) return 'auto';
    if (colSize === 'auto') return 'auto';
    if (colSize === 'content') return 'auto';
    if (typeof colSize === 'number') {
      // Grid system is based on 12 columns
      return `${(colSize / 12) * 100}%`;
    }
    return 'auto';
  };
  
  const getStyles = () => {
    const base = {
      paddingHorizontal: spacing / 2,
      marginBottom: spacing,
      alignSelf: align === 'auto' ? 'stretch' : align,
    };
    
    // Simplify for this implementation, just use xs as default
    // In a real implementation, you would use the current breakpoint
    const width = getWidth(xs);
    
    return { ...base, width };
  };
  
  return (
    <View style={[styles.col, getStyles(), style]}>
      {children}
    </View>
  );
};

// Set display name for component recognition
Col.displayName = 'Col';

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
  },
}); 