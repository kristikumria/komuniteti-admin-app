import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
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
  const getWidth = (colSize: ColSize | undefined): DimensionValue | undefined => {
    if (colSize === undefined) return 'auto';
    if (colSize === 'auto') return 'auto';
    if (colSize === 'content') return 'auto';
    if (typeof colSize === 'number') {
      // Grid system is based on 12 columns
      return `${(colSize / 12) * 100}%` as DimensionValue;
    }
    return 'auto';
  };
  
  // Create proper styles as a ViewStyle object
  const columnStyles: ViewStyle = {
    paddingHorizontal: spacing / 2,
    marginBottom: spacing,
    alignSelf: align === 'auto' ? 'stretch' : align,
    width: getWidth(xs),
  };
  
  return (
    <View style={[styles.col, columnStyles, style]}>
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