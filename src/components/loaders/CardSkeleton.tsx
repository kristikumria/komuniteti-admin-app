import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { AppTheme } from '../../theme/theme';
import { SkeletonLoader } from './SkeletonLoader';

interface CardSkeletonProps {
  hasHeader?: boolean;
  hasMedia?: boolean;
  hasDivider?: boolean;
  hasFooter?: boolean;
  height?: number;
  contentLines?: number;
  style?: ViewStyle;
  elevation?: 0 | 1 | 2 | 3 | 4;
}

/**
 * CardSkeleton component for displaying skeleton loading state
 * for cards, following Material Design 3 guidelines
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  hasHeader = true,
  hasMedia = false,
  hasDivider = false,
  hasFooter = false,
  height,
  contentLines = 3,
  style,
  elevation = 1,
}) => {
  const { theme } = useThemedStyles();
  
  return (
    <Surface
      style={[styles(theme).container, style]}
      elevation={elevation}
    >
      {/* Header */}
      {hasHeader && (
        <View style={styles(theme).header}>
          <View style={styles(theme).headerLeft}>
            <SkeletonLoader 
              shape="circle" 
              width={40} 
              height={40} 
            />
            <View style={styles(theme).headerTexts}>
              <SkeletonLoader
                width={120}
                height={16}
                style={styles(theme).title}
              />
              <SkeletonLoader
                width={80}
                height={12}
                style={styles(theme).subtitle}
              />
            </View>
          </View>
        </View>
      )}
      
      {/* Media */}
      {hasMedia && (
        <SkeletonLoader
          width="100%"
          height={160}
          style={styles(theme).media}
        />
      )}
      
      {/* Divider */}
      {hasDivider && (
        <View style={styles(theme).divider} />
      )}
      
      {/* Content */}
      <View style={styles(theme).content}>
        {Array.from({ length: contentLines }).map((_, index) => (
          <SkeletonLoader
            key={`content-line-${index}`}
            width={`${Math.max(60, 100 - index * 10)}%`}
            height={16}
            style={styles(theme).contentLine}
          />
        ))}
      </View>
      
      {/* Footer */}
      {hasFooter && (
        <View style={styles(theme).footer}>
          <SkeletonLoader
            width={60}
            height={24}
            shape="rounded"
          />
          <SkeletonLoader
            width={60}
            height={24}
            shape="rounded"
          />
        </View>
      )}
    </Surface>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    borderRadius: theme.shapes.corner.medium,
    marginVertical: theme.spacing.s,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTexts: {
    marginLeft: theme.spacing.m,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    opacity: 0.8,
  },
  media: {
    marginBottom: theme.spacing.s,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginVertical: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.m,
  },
  contentLine: {
    marginBottom: theme.spacing.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing.m,
    gap: theme.spacing.s,
  },
}); 