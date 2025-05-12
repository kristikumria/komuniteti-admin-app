import React, { ReactNode, useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

interface MobileFrameWrapperProps {
  children: ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  // Only apply the frame styling on web platform
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }
  
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
    <View style={styles.container}>
      <View style={[styles.phoneContainerOuter]}>
        <View style={[styles.phoneContainer, { width: phoneWidth, height: phoneHeight }]}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneContent}>
              {children}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.select({ web: '100vh' as any, default: '100%' }),
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phoneContainerOuter: {
    borderRadius: 20,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { 
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
    } as any : {}),
  },
  phoneContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    position: 'relative',
  },
  phoneFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  phoneContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
});