// This file contains global type declarations for the application

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Global FAB styles definition for consistent FAB styling across the app
interface GlobalFABStyle {
  fab: {
    position: 'absolute';
    bottom: 100;
    right: 16;
    margin: 0;
    width: 56;
    height: 56;
    borderRadius: 28;
    zIndex: 9999;
    elevation: 10;
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
  };
} 