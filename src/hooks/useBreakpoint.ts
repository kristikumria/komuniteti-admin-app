import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

/**
 * Breakpoint sizes in points
 */
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768, // iPad min width
  lg: 992, 
  xl: 1200,
};

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Hook to detect the current screen size category based on width
 * @returns Object with boolean flags for different device categories
 */
export const useBreakpoint = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  // Update dimensions when the screen size changes
  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    // Use the newer API that returns a subscription object
    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      // Modern API always has a remove method
      subscription.remove();
    };
  }, []);

  // Calculate breakpoint flags
  const { width } = dimensions;
  
  // Determine current breakpoint
  let breakpoint: Breakpoint = 'xs';
  if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
  else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
  else if (width >= BREAKPOINTS.md) breakpoint = 'md';
  else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';
  
  return {
    // Legacy properties
    isPhone: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.xl,
    isDesktop: width >= BREAKPOINTS.xl,
    // New properties
    breakpoint,
    width,
    breakpoints: BREAKPOINTS,
  };
}; 