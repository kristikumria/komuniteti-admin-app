import { useRef, useCallback, useEffect, useState } from 'react';
import { Keyboard, findNodeHandle, AccessibilityInfo, Platform } from 'react-native';
import { useAccessibility } from '../components/AccessibilityProvider';

/**
 * Hook for implementing keyboard navigation in React Native components.
 * Provides utilities to manage focus between elements and handle keyboard navigation.
 * 
 * @param itemsCount - The total number of items that can be focused
 * @param initialFocusIndex - The initial index to focus (defaults to 0)
 * @param onSelectItem - Callback when an item is selected/activated
 * @returns Object with focus utilities and state
 */
export const useKeyboardNavigation = (
  itemsCount: number,
  initialFocusIndex: number = 0,
  onSelectItem?: (index: number) => void
) => {
  const { settings } = useAccessibility();
  const [focusedIndex, setFocusedIndex] = useState(initialFocusIndex);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const itemRefs = useRef<(React.RefObject<any> | null)[]>(Array(itemsCount).fill(null));
  
  // Initialize refs for each item
  useEffect(() => {
    itemRefs.current = Array(itemsCount).fill(null).map((_, i) => 
      itemRefs.current[i] || { current: null }
    );
  }, [itemsCount]);
  
  // Monitor keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Move focus to the next item
  const focusNext = useCallback(() => {
    if (focusedIndex < itemsCount - 1) {
      setFocusedIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        focusItemAt(nextIndex);
        return nextIndex;
      });
    }
  }, [focusedIndex, itemsCount]);

  // Move focus to the previous item
  const focusPrevious = useCallback(() => {
    if (focusedIndex > 0) {
      setFocusedIndex(prevIndex => {
        const nextIndex = prevIndex - 1;
        focusItemAt(nextIndex);
        return nextIndex;
      });
    }
  }, [focusedIndex]);

  // Focus a specific item by index
  const focusItemAt = useCallback((index: number) => {
    if (index >= 0 && index < itemsCount && itemRefs.current[index]?.current) {
      const node = findNodeHandle(itemRefs.current[index]?.current);
      if (node) {
        if (Platform.OS === 'android') {
          // For Android, we can directly send accessibility focus
          AccessibilityInfo.setAccessibilityFocus(node);
        } else if (Platform.OS === 'ios') {
          // For iOS, we need to use the native method on the node
          if (itemRefs.current[index]?.current?.focus) {
            itemRefs.current[index]?.current?.focus();
          }
        }
      }
    }
  }, [itemsCount]);

  // Select/activate the currently focused item
  const selectFocusedItem = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < itemsCount && onSelectItem) {
      onSelectItem(focusedIndex);
    }
  }, [focusedIndex, itemsCount, onSelectItem]);

  // Provide a ref setter for components to use
  const setItemRef = useCallback((index: number, ref: any) => {
    if (index >= 0 && index < itemsCount) {
      itemRefs.current[index] = { current: ref };
    }
  }, [itemsCount]);

  // Handle keyboard navigation (useful for testing on simulators or when using keyboard accessories)
  const handleKeyPress = useCallback((e: any) => {
    if (settings.screenReaderEnabled) {
      // Don't interfere with screen reader navigation
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        focusNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        focusPrevious();
        break;
      case 'Enter':
      case ' ': // Space key
        selectFocusedItem();
        break;
      default:
        break;
    }
  }, [focusNext, focusPrevious, selectFocusedItem, settings.screenReaderEnabled]);

  return {
    focusedIndex,
    setFocusedIndex,
    focusNext,
    focusPrevious,
    focusItemAt,
    selectFocusedItem,
    setItemRef,
    handleKeyPress,
    isKeyboardVisible,
    itemRefs: itemRefs.current
  };
}; 