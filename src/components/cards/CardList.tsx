import React, { ReactElement } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, ViewStyle, ListRenderItem } from 'react-native';
import { Text } from 'react-native-paper';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { AppTheme } from '../../theme/theme';
import { EmptyState } from '../EmptyState';

interface CardListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIcon?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  showSeparators?: boolean;
  horizontal?: boolean;
  testID?: string;
  numColumns?: number;
  initialNumToRender?: number;
  keyExtractor?: (item: T, index: number) => string;
}

/**
 * CardList component for displaying lists of cards with loading states
 * and empty states, following Material Design 3 guidelines
 */
export const CardList = <T extends any>({
  data,
  renderItem,
  loading = false,
  refreshing = false,
  onRefresh,
  emptyStateTitle = 'No items found',
  emptyStateMessage = 'There are no items to display at this time.',
  emptyStateIcon,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  style,
  showSeparators = false,
  horizontal = false,
  testID,
  numColumns,
  initialNumToRender = 10,
  keyExtractor,
}: CardListProps<T>) => {
  const { theme } = useThemedStyles();
  
  const isEmpty = !loading && data.length === 0;
  
  // Show loading indicator when initially loading
  if (loading && !refreshing) {
    return (
      <View style={styles(theme).loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles(theme).loadingText} variant="bodyMedium">
          Loading...
        </Text>
      </View>
    );
  }
  
  // Show empty state when no data and not loading
  if (isEmpty) {
    return (
      <EmptyState
        title={emptyStateTitle}
        message={emptyStateMessage}
        icon={emptyStateIcon}
      />
    );
  }
  
  // Create typed render item function for FlatList
  const renderItemForFlatList: ListRenderItem<T> = ({ item, index }) => {
    return renderItem(item, index);
  };
  
  return (
    <FlatList
      data={data}
      renderItem={renderItemForFlatList}
      keyExtractor={keyExtractor || ((_, index) => `card-item-${index}`)}
      contentContainerStyle={[
        styles(theme).listContent,
        horizontal && styles(theme).horizontalContent,
        contentContainerStyle,
      ]}
      style={[styles(theme).list, style]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={
        showSeparators
          ? () => <View style={styles(theme).separator} />
          : undefined
      }
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      numColumns={numColumns}
      initialNumToRender={initialNumToRender}
      testID={testID}
      accessibilityRole="list"
    />
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.m,
    flexGrow: 1,
  },
  horizontalContent: {
    paddingVertical: theme.spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  separator: {
    height: theme.spacing.s,
  },
}); 