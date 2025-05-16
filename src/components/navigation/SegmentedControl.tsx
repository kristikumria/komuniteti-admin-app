import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface SegmentItem {
  key: string;
  label: string;
  accessibilityLabel?: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  items: SegmentItem[];
  selectedKey: string;
  onChange: (key: string) => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  activeSegmentStyle?: ViewStyle;
  labelStyle?: TextStyle;
  activeLabelStyle?: TextStyle;
  scrollable?: boolean;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined';
  disabled?: boolean;
}

/**
 * A segmented control component for selecting between multiple options.
 * Follows Material Design 3 guidelines with smooth animations.
 * 
 * @example
 * <SegmentedControl
 *   items={[
 *     { key: 'day', label: 'Day' },
 *     { key: 'week', label: 'Week' },
 *     { key: 'month', label: 'Month' },
 *   ]}
 *   selectedKey={selectedView}
 *   onChange={setSelectedView}
 *   variant="filled"
 * />
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  selectedKey,
  onChange,
  style,
  containerStyle,
  activeSegmentStyle,
  labelStyle,
  activeLabelStyle,
  scrollable = false,
  fullWidth = false,
  variant = 'filled',
  disabled = false,
}) => {
  const theme = useTheme() as AppTheme;
  const [segmentWidths, setSegmentWidths] = useState<{ [key: string]: number }>({});
  const [segmentPositions, setSegmentPositions] = useState<{ [key: string]: number }>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animatedPosition = useRef(new Animated.Value(0)).current;
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  // Calculate segment width when segments change their layout
  const handleSegmentLayout = (key: string, event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    
    setSegmentWidths((prev) => ({
      ...prev,
      [key]: width,
    }));
    
    setSegmentPositions((prev) => ({
      ...prev,
      [key]: x,
    }));
  };
  
  // Handle container width changes
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
    setMounted(true);
  };
  
  // Update animated values when selected segment changes
  useEffect(() => {
    if (mounted && selectedKey in segmentWidths && selectedKey in segmentPositions) {
      Animated.parallel([
        Animated.timing(animatedPosition, {
          toValue: segmentPositions[selectedKey],
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedWidth, {
          toValue: segmentWidths[selectedKey],
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [selectedKey, segmentWidths, segmentPositions, mounted]);
  
  // Determine segment width based on fullWidth prop
  const getSegmentStyle = (key: string): ViewStyle => {
    if (fullWidth && !scrollable) {
      return {
        flex: 1,
      };
    }
    
    return {};
  };
  
  // Get styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.outline,
            ...theme.elevation.level0,
          },
          activeSegment: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.primary,
          },
          label: {
            color: theme.colors.onSurfaceVariant,
          },
          activeLabel: {
            color: theme.colors.primary,
          },
        };
      case 'filled':
      default:
        return {
          container: {
            backgroundColor: theme.colors.surfaceVariant,
          },
          activeSegment: {
            backgroundColor: theme.colors.primary,
          },
          label: {
            color: theme.colors.onSurfaceVariant,
          },
          activeLabel: {
            color: theme.colors.onPrimary,
          },
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  const Wrapper = scrollable ? ScrollView : View;
  const wrapperProps = scrollable
    ? {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles(theme).scrollContentContainer,
      }
    : {};
  
  return (
    <Surface
      elevation={variant === 'outlined' ? ElevationLevel.Level0 : ElevationLevel.Level1}
      style={[
        styles(theme).container,
        variantStyles.container,
        containerStyle,
      ]}
    >
      <View
        style={[styles(theme).segmentsContainer, fullWidth && styles(theme).fullWidth]}
        onLayout={handleContainerLayout}
      >
        {/* Animated active segment indicator */}
        <Animated.View
          style={[
            styles(theme).activeSegment,
            variantStyles.activeSegment,
            {
              left: animatedPosition,
              width: animatedWidth,
            },
            activeSegmentStyle,
          ]}
        />
        
        <Wrapper {...wrapperProps}>
          {items.map((item) => {
            const isActive = selectedKey === item.key;
            
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles(theme).segment,
                  getSegmentStyle(item.key),
                ]}
                onPress={() => !disabled && onChange(item.key)}
                onLayout={(e) => handleSegmentLayout(item.key, e)}
                disabled={disabled}
                accessibilityLabel={item.accessibilityLabel || item.label}
                accessibilityState={{ selected: isActive }}
                activeOpacity={0.7}
              >
                {item.icon && (
                  <View style={styles(theme).iconContainer}>{item.icon}</View>
                )}
                <Text
                  style={[
                    styles(theme).segmentLabel,
                    variantStyles.label,
                    labelStyle,
                    isActive && variantStyles.activeLabel,
                    isActive && activeLabelStyle,
                    disabled && styles(theme).disabledText,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Wrapper>
      </View>
    </Surface>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    borderRadius: theme.roundness * 1.5,
    overflow: 'hidden',
  },
  segmentsContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    zIndex: 1,
  },
  activeSegment: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: theme.roundness,
    zIndex: 0,
  },
  segmentLabel: {
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledText: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: theme.spacing.xs,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
}); 