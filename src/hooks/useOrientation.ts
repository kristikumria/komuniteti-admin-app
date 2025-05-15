import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

/**
 * Hook that detects the current device orientation
 * @returns The current orientation ('portrait' or 'landscape')
 */
export const useOrientation = (): Orientation => {
  // Get initial orientation
  const [orientation, setOrientation] = useState<Orientation>(
    getOrientation(Dimensions.get('window'))
  );

  // Update orientation when screen dimensions change
  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setOrientation(getOrientation(window));
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      // @ts-ignore - React Native types for newer versions are different
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return orientation;
};

/**
 * Helper function to determine orientation from dimensions
 */
const getOrientation = ({ width, height }: ScaledSize): Orientation => {
  return width >= height ? 'landscape' : 'portrait';
}; 