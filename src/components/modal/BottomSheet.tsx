import React, { ReactNode, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  ViewStyle,
  PanResponder,
} from 'react-native';
import { Surface, Text, IconButton, useTheme } from 'react-native-paper';
import { ChevronDown, X } from 'lucide-react-native';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: ReactNode;
  contentStyle?: ViewStyle;
  snapPoints?: Array<number | string>;
  initialSnapIndex?: number;
  dismissable?: boolean;
  hideHeader?: boolean;
  showDragIndicator?: boolean;
  showCloseButton?: boolean;
  height?: number | string;
  backdropOpacity?: number;
}

/**
 * A bottom sheet component that slides up from the bottom of the screen.
 * Follows Material Design 3 guidelines for mobile interfaces.
 * Supports gestures for expanding, collapsing, and dismissing.
 * 
 * @example
 * <BottomSheet
 *   visible={visible}
 *   onDismiss={() => setVisible(false)}
 *   title="Filter Options"
 *   showDragIndicator
 * >
 *   <FilterOptions onApply={() => setVisible(false)} />
 * </BottomSheet>
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onDismiss,
  title,
  children,
  contentStyle,
  snapPoints = ['50%'],
  initialSnapIndex = 0,
  dismissable = true,
  hideHeader = false,
  showDragIndicator = true,
  showCloseButton = true,
  height,
  backdropOpacity = 0.5,
}) => {
  const theme = useTheme() as AppTheme;
  const { height: screenHeight } = Dimensions.get('window');
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Calculate sheet height based on snapPoints
  const getSheetHeight = () => {
    if (height) {
      return typeof height === 'string' && height.includes('%')
        ? (parseInt(height, 10) / 100) * screenHeight
        : typeof height === 'number'
        ? height
        : screenHeight * 0.5;
    }
    
    const snapPoint = snapPoints[initialSnapIndex] || snapPoints[0];
    return typeof snapPoint === 'string' && snapPoint.includes('%')
      ? (parseInt(snapPoint, 10) / 100) * screenHeight
      : typeof snapPoint === 'number'
      ? snapPoint
      : screenHeight * 0.5;
  };
  
  const sheetHeight = getSheetHeight();
  
  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > sheetHeight * 0.4 || gestureState.vy > 0.5) {
          // User dragged down far enough or with enough velocity to close
          closeSheet();
        } else {
          // Return to opened position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;
  
  // Handle back button press
  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onDismiss();
          return true;
        }
      );
      
      return () => backHandler.remove();
    }
    return undefined;
  }, [visible, onDismiss]);
  
  // Handle animations
  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [visible]);
  
  const openSheet = () => {
    translateY.setValue(screenHeight);
    
    Animated.parallel([
      Animated.timing(backdropOpacityAnim, {
        toValue: backdropOpacity,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }),
    ]).start();
  };
  
  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(backdropOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };
  
  // Don't render if not visible
  if (!visible) {
    return null;
  }
  
  const dragHandleArea = hideHeader ? showDragIndicator ? 40 : 20 : title ? 60 : 40;
  
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={closeSheet}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles(theme).modalContainer}>
        <Animated.View
          style={[
            styles(theme).backdrop,
            {
              opacity: backdropOpacityAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles(theme).backdropTouchable}
            activeOpacity={1}
            onPress={dismissable ? closeSheet : undefined}
          />
        </Animated.View>
        
        <Animated.View
          style={[
            styles(theme).sheetContainer,
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [0, screenHeight],
                    outputRange: [0, screenHeight],
                    extrapolate: 'clamp',
                  }),
                },
              ],
              maxHeight: Math.min(sheetHeight, screenHeight * 0.9),
            },
          ]}
        >
          <Surface
            elevation={ElevationLevel.Level3}
            style={[styles(theme).sheet, contentStyle]}
          >
            {/* Drag handle area */}
            <View
              {...panResponder.panHandlers}
              style={[
                styles(theme).dragHandleContainer,
                { height: dragHandleArea },
              ]}
            >
              {showDragIndicator && (
                <View style={styles(theme).dragIndicator} />
              )}
              
              {!hideHeader && title && (
                <View style={styles(theme).headerContent}>
                  <Text variant="titleMedium" style={styles(theme).title}>
                    {title}
                  </Text>
                  
                  {showCloseButton && (
                    <IconButton
                      icon={() => <X size={20} color={theme.colors.onSurfaceVariant} />}
                      size={20}
                      onPress={closeSheet}
                      style={styles(theme).closeButton}
                    />
                  )}
                </View>
              )}
            </View>
            
            {/* Content */}
            <View style={styles(theme).content}>{children}</View>
          </Surface>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheetContainer: {
    width: '100%',
    borderTopLeftRadius: theme.roundness * 2,
    borderTopRightRadius: theme.roundness * 2,
    overflow: 'hidden',
  },
  sheet: {
    borderTopLeftRadius: theme.roundness * 2,
    borderTopRightRadius: theme.roundness * 2,
    backgroundColor: theme.colors.surface,
    minHeight: 100,
    width: '100%',
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xs,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: theme.spacing.xs,
  },
  headerContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
  },
  title: {
    color: theme.colors.onSurface,
    flex: 1,
    paddingRight: theme.spacing.m,
  },
  closeButton: {
    margin: 0,
  },
  content: {
    padding: theme.spacing.m,
  },
}); 