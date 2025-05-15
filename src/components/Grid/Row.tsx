import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface RowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  spacing?: number;
  reverse?: boolean;
  wrap?: boolean;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * Row component for the grid system.
 * Implements a flexbox row that contains columns.
 */
export const Row: React.FC<RowProps> = ({
  children,
  style,
  spacing = 16,
  reverse = false,
  wrap = true,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
}) => {
  return (
    <View
      style={[
        styles.row,
        {
          flexDirection: reverse ? 'row-reverse' : 'row',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          marginHorizontal: -spacing / 2,
          alignItems,
          justifyContent,
        },
        style,
      ]}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && 
            typeof child.type === 'function' && 
            (child.type as any).displayName === 'Col') {
          return React.cloneElement(child, { spacing } as any);
        }
        return child;
      })}
    </View>
  );
};

// Set display name for component recognition
Row.displayName = 'Row';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
  },
}); 