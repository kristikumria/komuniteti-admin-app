import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { useTheme, Surface } from 'react-native-paper';
import { useAppSelector } from '../store/hooks';
import { commonStyles } from '../styles/commonStyles';
import type { AppTheme } from '../theme/theme';

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  safeArea?: boolean;
  useSurface?: boolean;
}

/**
 * A container component that provides consistent layout and styling for all screens.
 * Use this component as the root component for all screens to maintain UI consistency.
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  paddingHorizontal = 16,
  paddingVertical = 16,
  backgroundColor,
  safeArea = true,
  useSurface = false,
}) => {
  const theme = useTheme<AppTheme>();
  
  // Use theme's dark mode state, not from redux
  const bgColor = backgroundColor || theme.colors.background;
  const barStyle = theme.dark ? 'light-content' : 'dark-content';
  
  const Container = safeArea ? SafeAreaView : View;
  const ContentContainer = scrollable ? ScrollView : View;
  
  // Apply styles based on whether we want a surface or just a plain container
  const containerStyles = [
    commonStyles.screenContainer,
    { backgroundColor: bgColor }
  ];
  
  const contentStyles = [
    scrollable ? styles.scrollView : styles.contentView,
    {
      paddingHorizontal,
      paddingVertical,
    },
  ];
  
  // If using Surface, wrap the content in a Surface component
  if (useSurface) {
    return (
      <Container style={containerStyles}>
        <StatusBar barStyle={barStyle} backgroundColor={bgColor} />
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
          <ContentContainer style={contentStyles}>
            {children}
          </ContentContainer>
        </Surface>
      </Container>
    );
  }
  
  // Otherwise, use the regular container
  return (
    <Container style={containerStyles}>
      <StatusBar barStyle={barStyle} backgroundColor={bgColor} />
      <ContentContainer style={contentStyles}>
        {children}
      </ContentContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentView: {
    flex: 1,
  },
  surface: {
    flex: 1,
    borderRadius: 0,
  },
}); 