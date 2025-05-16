import React from 'react';
import { StyleSheet, View, ViewStyle, Animated, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../theme/theme';
import { useDarkMode } from '../DarkModeProvider';

interface SkeletonProps {
  width?: number | "auto" | `${number}%`;
  height?: number;
  style?: ViewStyle;
  circle?: boolean;
  borderRadius?: number;
}

interface ContentLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

/**
 * A skeleton loader for a rectangular shape
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  style,
  circle = false,
  borderRadius,
}) => {
  const theme = useTheme() as AppTheme;
  const { isDarkMode } = useDarkMode();
  const [fadeAnim] = React.useState(new Animated.Value(0.5));

  // Create the pulse animation
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles(theme).skeleton,
        {
          width,
          height,
          borderRadius: circle ? height / 2 : borderRadius || theme.roundness,
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.08)',
          opacity: fadeAnim,
        },
        circle && { width: height },
        style,
      ]}
    />
  );
};

/**
 * A content loader that displays skeleton placeholders while content is loading
 * and shows the actual content once loaded.
 * 
 * @example
 * <ContentLoader loading={isLoading}>
 *   <YourContent />
 * </ContentLoader>
 */
export const ContentLoader: React.FC<ContentLoaderProps> = ({
  loading,
  children,
  style,
  containerStyle,
}) => {
  const theme = useTheme() as AppTheme;

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <View style={[styles(theme).container, containerStyle]}>
      <View style={[styles(theme).placeholder, style]}>
        <Skeleton height={20} style={styles(theme).titleSkeleton} />
        <Skeleton height={16} style={styles(theme).lineSkeleton} />
        <Skeleton height={16} style={styles(theme).lineSkeleton} />
        <Skeleton height={16} width="60%" style={styles(theme).lineSkeleton} />
      </View>
    </View>
  );
};

/**
 * Card content loader - shows a card-like skeleton
 */
export const CardLoader: React.FC<{style?: ViewStyle}> = ({ style }) => {
  const theme = useTheme() as AppTheme;
  
  return (
    <View style={[styles(theme).cardLoader, style]}>
      <Skeleton height={120} />
      <View style={styles(theme).cardContent}>
        <Skeleton height={24} style={styles(theme).titleSkeleton} />
        <Skeleton height={16} style={styles(theme).lineSkeleton} />
        <Skeleton height={16} width="70%" style={styles(theme).lineSkeleton} />
      </View>
    </View>
  );
};

/**
 * List item content loader - shows a list item-like skeleton
 */
export const ListItemLoader: React.FC<{style?: ViewStyle}> = ({ style }) => {
  const theme = useTheme() as AppTheme;
  
  return (
    <View style={[styles(theme).listItemLoader, style]}>
      <Skeleton height={40} width={40} circle style={styles(theme).avatarSkeleton} />
      <View style={styles(theme).listItemContent}>
        <Skeleton height={18} width="60%" style={styles(theme).titleSkeleton} />
        <Skeleton height={14} width="90%" style={styles(theme).lineSkeleton} />
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    width: '100%',
  },
  placeholder: {
    padding: theme.spacing.m,
  },
  skeleton: {
    marginBottom: theme.spacing.xs,
  },
  titleSkeleton: {
    marginBottom: theme.spacing.s,
  },
  lineSkeleton: {
    marginBottom: theme.spacing.xs,
  },
  cardLoader: {
    borderRadius: theme.roundness,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    ...theme.elevation.level1,
  },
  cardContent: {
    padding: theme.spacing.m,
  },
  listItemLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.s,
  },
  avatarSkeleton: {
    marginRight: theme.spacing.m,
  },
  listItemContent: {
    flex: 1,
  },
}); 