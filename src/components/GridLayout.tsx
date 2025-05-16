import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { AppTheme } from '../theme/theme';

interface GridLayoutProps {
  children: ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  style?: ViewStyle;
}

/**
 * A responsive grid layout component that adapts to different screen sizes
 * following Material Design 3 principles.
 * 
 * @example
 * <GridLayout columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={16}>
 *   <Item />
 *   <Item />
 *   <Item />
 * </GridLayout>
 */
export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap,
  rowGap,
  columnGap,
  style,
}) => {
  const theme = useTheme() as AppTheme;
  const breakpoint = useBreakpoint();
  
  // Calculate the number of columns based on breakpoint
  const getColumnCount = (): number => {
    if (typeof columns === 'number') {
      return columns;
    }
    
    // Default to 1 column if no specific breakpoint matches
    if (breakpoint.breakpoint === 'xl' && columns.xl) return columns.xl;
    if (breakpoint.breakpoint === 'lg' && columns.lg) return columns.lg;
    if (breakpoint.breakpoint === 'md' && columns.md) return columns.md;
    if (breakpoint.breakpoint === 'sm' && columns.sm) return columns.sm;
    return columns.xs || 1;
  };
  
  // Get the spacing values
  const getRowGap = (): number => rowGap !== undefined ? rowGap : gap !== undefined ? gap : theme.spacing.m;
  const getColumnGap = (): number => columnGap !== undefined ? columnGap : gap !== undefined ? gap : theme.spacing.m;
  
  // Convert children to array
  const childrenArray = React.Children.toArray(children);
  const columnCount = getColumnCount();
  
  return (
    <View style={[styles.container, style]}>
      {columnCount === 1 ? (
        // Single column layout (stacked)
        <View style={[styles.column, { gap: getRowGap() }]}>
          {childrenArray}
        </View>
      ) : (
        // Multi-column grid layout
        <View style={[styles.grid, { gap: getRowGap() }]}>
          {Array.from({ length: columnCount }).map((_, columnIndex) => (
            <View 
              key={`column-${columnIndex}`} 
              style={[
                styles.column, 
                { 
                  flex: 1,
                  marginRight: columnIndex < columnCount - 1 ? getColumnGap() : 0,
                }
              ]}
            >
              {childrenArray
                .filter((_, index) => index % columnCount === columnIndex)
                .map((child, index) => (
                  <View 
                    key={`item-${columnIndex}-${index}`} 
                    style={[
                      styles.item,
                      { marginBottom: getRowGap() }
                    ]}
                  >
                    {child}
                  </View>
                ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  item: {
    flex: 1,
  },
}); 