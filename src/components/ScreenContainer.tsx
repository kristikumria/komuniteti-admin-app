import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: number;
}

/**
 * A container component that provides consistent layout and styling for all screens.
 * Use this component as the root component for all screens to maintain UI consistency.
 */
export const ScreenContainer = ({ 
  children, 
  scrollable = true,
  padding = 16 
}: ScreenContainerProps) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      {scrollable ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={{ padding }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding }}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
}); 