/**
 * Material Design 3 Elevation Guide
 * 
 * This file provides standardized elevation values following 
 * the Material Design 3 guidelines for consistent shadows and surfaces.
 * 
 * React Native Paper provides elevation via its Surface component,
 * but this guide helps establish consistent usage patterns.
 */

import { Platform } from 'react-native';
import type { AppTheme } from './theme';

/**
 * Types of elevation according to MD3
 * Each level serves a specific purpose in the UI hierarchy
 */
export enum ElevationLevel {
  Level0 = 0,  // No elevation (flat)
  Level1 = 1,  // Subtle elevation (cards, subtle surfaces)
  Level2 = 2,  // Medium elevation (active cards, bottom sheets)
  Level3 = 3,  // Higher elevation (navigation drawer, dialogs)
  Level4 = 4,  // Highest elevation (FABs, pickers)
  Level5 = 5,  // Maximum elevation (overlay menus, etc)
}

/**
 * Gets appropriate shadow styling for a given elevation level
 * This ensures shadows look appropriate across platforms
 */
export const getElevationStyle = (level: ElevationLevel, theme: AppTheme) => {
  // No elevation - flat surface
  if (level === ElevationLevel.Level0) {
    return {
      elevation: 0,
      shadowOpacity: 0,
      borderWidth: 0,
    };
  }

  // Standard Android Material elevation through the 'elevation' prop
  if (Platform.OS === 'android') {
    return {
      elevation: level,
    };
  }

  // iOS-specific shadow implementation (more control)
  let shadowConfig = {
    shadowColor: theme.dark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  };

  // Increase shadow properties based on elevation level
  switch (level) {
    case ElevationLevel.Level1:
      shadowConfig.shadowOffset = { width: 0, height: 1 };
      shadowConfig.shadowOpacity = theme.dark ? 0.3 : 0.18;
      shadowConfig.shadowRadius = 2;
      break;
    case ElevationLevel.Level2:
      shadowConfig.shadowOffset = { width: 0, height: 2 };
      shadowConfig.shadowOpacity = theme.dark ? 0.4 : 0.2;
      shadowConfig.shadowRadius = 4;
      break;
    case ElevationLevel.Level3:
      shadowConfig.shadowOffset = { width: 0, height: 3 };
      shadowConfig.shadowOpacity = theme.dark ? 0.5 : 0.24;
      shadowConfig.shadowRadius = 6;
      break;
    case ElevationLevel.Level4:
      shadowConfig.shadowOffset = { width: 0, height: 4 };
      shadowConfig.shadowOpacity = theme.dark ? 0.6 : 0.3;
      shadowConfig.shadowRadius = 8;
      break;
    case ElevationLevel.Level5:
      shadowConfig.shadowOffset = { width: 0, height: 6 };
      shadowConfig.shadowOpacity = theme.dark ? 0.7 : 0.36;
      shadowConfig.shadowRadius = 12;
      break;
    default:
      // Default to level 1 for unknown values
      shadowConfig.shadowOffset = { width: 0, height: 1 };
      shadowConfig.shadowOpacity = theme.dark ? 0.3 : 0.18;
      shadowConfig.shadowRadius = 2;
  }

  return shadowConfig;
};

/**
 * Usage Guide:
 * 
 * 1. Cards and basic surfaces: ElevationLevel.Level1
 * 2. Active cards, bottom sheets: ElevationLevel.Level2
 * 3. Navigation drawer, modals: ElevationLevel.Level3
 * 4. Floating Action Buttons: ElevationLevel.Level4
 * 5. Dropdown menus: ElevationLevel.Level5
 * 
 * Example usage with React Native Paper:
 * 
 * <Surface elevation={ElevationLevel.Level2} style={additionalStyles}>
 *   ...content
 * </Surface>
 * 
 * Example with React Native:
 * 
 * const styles = StyleSheet.create({
 *   elevatedBox: {
 *     ...getElevationStyle(ElevationLevel.Level2, theme),
 *     // other styles
 *   }
 * });
 */

export default {
  ElevationLevel,
  getElevationStyle,
}; 