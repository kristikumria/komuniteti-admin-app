import 'react-native-paper';

declare module 'react-native-paper' {
  // Extend the MD3Colors type to include missing surface container colors
  export interface MD3Colors {
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
  }
} 