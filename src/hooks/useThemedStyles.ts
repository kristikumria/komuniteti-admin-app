import { useTheme } from 'react-native-paper';
import { getCommonStyles } from '../styles/commonStyles';
import type { AppTheme } from '../theme/theme';

/**
 * Hook to access theme and commonly used theme-aware styles
 * @returns An object containing the theme and themed common styles
 */
export const useThemedStyles = () => {
  const theme = useTheme<AppTheme>();
  const commonStyles = getCommonStyles(theme);

  return {
    theme,
    commonStyles,
  };
}; 