import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ViewStyle, StyleProp, ListRenderItem } from 'react-native';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { KeyboardFocusableItem } from './KeyboardFocusableItem';
import { useAccessibility } from '../AccessibilityProvider';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppTheme } from '../../theme/theme';

interface KeyboardNavigableListProps<T> {
  data: T[];
  renderItem?: (item: T, index: number, isFocused: boolean, focusProps: any) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  initialFocusIndex?: number;
  onItemSelect?: (item: T, index: number) => void;
  listStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  itemHeight?: number;
  scrollToFocused?: boolean;
  accessibilityLabel?: string;
  itemLabelExtractor?: (item: T) => string;
}

function KeyboardNavigableList<T>({
  data,
  renderItem,
  keyExtractor,
  initialFocusIndex = 0,
  onItemSelect,
  listStyle,
  horizontal = false,
  itemHeight,
  scrollToFocused = true,
  accessibilityLabel,
  itemLabelExtractor,
}: KeyboardNavigableListProps<T>) {
  const { settings } = useAccessibility();
  const { theme } = useThemedStyles();
  const styles = createStyles(theme);
  const [listRef, setListRef] = useState<FlatList<T> | null>(null);
  
  // Set up keyboard navigation with our custom hook
  const {
    focusedIndex,
    setFocusedIndex,
    focusNext,
    focusPrevious,
    focusItemAt,
    selectFocusedItem,
    setItemRef,
    handleKeyPress
  } = useKeyboardNavigation(
    data.length,
    initialFocusIndex,
    (index) => {
      if (onItemSelect && data[index]) {
        onItemSelect(data[index], index);
      }
    }
  );
  
  // Handle list scroll to keep focused item visible
  useEffect(() => {
    if (scrollToFocused && listRef && focusedIndex >= 0) {
      listRef.scrollToIndex({
        index: focusedIndex,
        animated: !settings.reduceMotion,
        viewPosition: 0.5, // Center the item
      });
    }
  }, [focusedIndex, listRef, scrollToFocused, settings.reduceMotion]);
  
  // Custom item renderer that wraps the provided renderItem with accessibility props
  const renderItemWithFocus: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      const isFocused = index === focusedIndex;
      
      // Props to pass to the rendered item
      const focusProps = {
        onFocus: () => focusItemAt(index),
        onSelect: () => selectFocusedItem(),
        setRef: (ref: any) => setItemRef(index, ref),
      };
      
      return (
        <View
          style={itemHeight ? { height: itemHeight } : undefined}
          accessible={false} // The inner content has accessibility properties
        >
          {renderItem && renderItem(item, index, isFocused, focusProps)}
        </View>
      );
    },
    [focusedIndex, focusItemAt, selectFocusedItem, setItemRef, itemHeight, renderItem]
  );
  
  // Get a displayable label for an item
  const getItemLabel = useCallback((item: T): string => {
    if (itemLabelExtractor) {
      return itemLabelExtractor(item);
    }
    
    // Try to convert item to string
    if (item !== null && item !== undefined) {
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'number' || typeof item === 'boolean') {
        return item.toString();
      }
      if (typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
        return item.name;
      }
      if (typeof item === 'object' && 'title' in item && typeof item.title === 'string') {
        return item.title;
      }
    }
    
    return 'Item';
  }, [itemLabelExtractor]);
  
  // Simplified renderItem for when users just want basic list items
  const renderSimpleItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      const isFocused = index === focusedIndex;
      
      return (
        <KeyboardFocusableItem
          index={index}
          focused={isFocused}
          onFocus={() => setFocusedIndex(index)}
          onPress={() => {
            if (onItemSelect) {
              onItemSelect(item, index);
            }
          }}
          setRef={setItemRef}
          label={getItemLabel(item)}
          accessibilityLabel={`Item ${index + 1} of ${data.length}`}
          accessibilityHint="Double tap to select"
        />
      );
    },
    [data.length, focusedIndex, onItemSelect, setFocusedIndex, setItemRef, getItemLabel]
  );
  
  // Function to handle scroll errors (scroll to index failures)
  const handleScrollToIndexFailed = useCallback(
    (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
      const offset = info.index * (info.averageItemLength || 50);
      
      if (listRef) {
        listRef.scrollToOffset({
          offset,
          animated: !settings.reduceMotion,
        });
        
        // Try again after a short delay to scroll to exact item
        setTimeout(() => {
          if (listRef && listRef.scrollToIndex) {
            listRef.scrollToIndex({
              index: info.index,
              animated: !settings.reduceMotion,
            });
          }
        }, 100);
      }
    },
    [listRef, settings.reduceMotion]
  );
  
  return (
    <View 
      style={[styles.container, listStyle]}
      accessible={false}
      accessibilityLabel={accessibilityLabel}
    >
      <FlatList
        ref={(ref) => setListRef(ref)}
        data={data}
        renderItem={renderItem ? renderItemWithFocus : renderSimpleItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        horizontal={horizontal}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        getItemLayout={
          itemHeight
            ? (_, index) => ({
                length: itemHeight,
                offset: itemHeight * index,
                index,
              })
            : undefined
        }
        initialScrollIndex={initialFocusIndex}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="list"
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
});

export { KeyboardNavigableList }; 