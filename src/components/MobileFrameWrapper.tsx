import React, { ReactNode, useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';
import { NavigationIndependentTree } from '@react-navigation/native';

interface MobileFrameWrapperProps {
  children: ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  // Only apply the frame styling on web platform
  if (Platform.OS !== 'web') {
    return <NavigationIndependentTree>{children}</NavigationIndependentTree>;
  }
  
  const { theme } = useThemedStyles();
  const [windowHeight, setWindowHeight] = useState(0);
  
  useEffect(() => {
    // Set initial height
    setWindowHeight(window.innerHeight);
    
    // Update height on resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate responsive height with max constraints
  const maxPhoneHeight = Math.min(windowHeight * 0.9, 800);
  const phoneWidth = 375;
  const phoneHeight = maxPhoneHeight;

  return (
    <View style={styles(theme).container}>
      <View style={[styles(theme).phoneContainerOuter]}>
        <View style={[styles(theme).phoneContainer, { width: phoneWidth, height: phoneHeight }]}>
          <View style={styles(theme).phoneFrame}>
            <View style={styles(theme).phoneContent}>
              <NavigationIndependentTree>
                {children}
              </NavigationIndependentTree>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.select({ web: '100vh' as any, default: '100%' }),
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  phoneContainerOuter: {
    borderRadius: theme.roundness * 2.5,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { 
      boxShadow: `0 10px 25px ${theme.colors.shadow}40`
    } as any : {}),
  },
  phoneContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
    position: 'relative',
  },
  phoneFrame: {
    width: '100%',
    height: '100%',
    borderRadius: theme.roundness * 2.5,
  },
  phoneContent: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2.5,
  },
});