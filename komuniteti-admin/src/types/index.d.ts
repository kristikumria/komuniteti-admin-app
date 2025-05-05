// Import all type declarations
import './theme';
import './store';

// Declare additional modules if needed
declare module 'expo-status-bar' {
  import { StatusBarStyle } from 'react-native';
  import * as React from 'react';
  
  export interface StatusBarProps {
    style?: StatusBarStyle | 'auto';
    hidden?: boolean;
    animated?: boolean;
    translucent?: boolean;
    networkActivityIndicatorVisible?: boolean;
    backgroundColor?: string;
    barStyle?: StatusBarStyle;
  }
  
  export const StatusBar: React.FC<StatusBarProps>;
} 