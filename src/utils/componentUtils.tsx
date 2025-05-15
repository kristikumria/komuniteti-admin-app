import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';

/**
 * A utility wrapper component to fix the common issue with Surface and overflow.
 * When setting overflow to hidden on Surface, the shadow will not be displayed correctly.
 * This component wraps the content in a separate View with the overflow style.
 * 
 * @param props.children The content to render inside the Surface
 * @param props.style Style to apply to the Surface component
 * @param props.contentStyle Style to apply to the inner content View (can include overflow: 'hidden')
 * @param props.elevation Elevation level for the Surface shadow
 */
export const SafeSurface: React.FC<{
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}> = ({ children, style, contentStyle, elevation = 1 }) => {
  return (
    <Surface style={style} elevation={elevation}>
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden',
  },
}); 