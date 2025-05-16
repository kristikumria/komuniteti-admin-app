import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, Surface } from 'react-native-paper';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  onPress?: () => void;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  color,
  onPress,
  subtitle,
  trend,
  trendLabel,
}) => {
  const { theme } = useThemedStyles();
  
  const iconBgColor = color || theme.colors.primary;
  const successColor = theme.colors.success; // Using theme success color
  
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  return (
    <View style={styles(theme).cardWrapper}>
      <Surface elevation={ElevationLevel.Level1} style={styles(theme).card}>
        <View style={styles(theme).cardInnerWrapper}>
          <CardWrapper
            style={styles(theme).cardContent}
            onPress={onPress}
          >
            <View style={[styles(theme).iconContainer, { backgroundColor: iconBgColor }]}>
              {icon}
            </View>
            
            <View style={styles(theme).textContent}>
              <Text variant="labelMedium" style={styles(theme).title}>{title}</Text>
              <Text variant="headlineSmall" style={styles(theme).value}>{value}</Text>
              
              {subtitle && (
                <Text variant="labelSmall" style={styles(theme).subtitle}>
                  {subtitle}
                </Text>
              )}
              
              {trend !== undefined && (
                <View style={styles(theme).trendContainer}>
                  {trend > 0 ? (
                    <TrendingUp 
                      size={14} 
                      color={successColor} 
                      style={{ marginRight: 4 }} 
                    />
                  ) : trend < 0 ? (
                    <TrendingDown 
                      size={14} 
                      color={theme.colors.error} 
                      style={{ marginRight: 4 }} 
                    />
                  ) : null}
                  <Text style={[
                    styles(theme).trend, 
                    { 
                      color: trend > 0 
                        ? successColor
                        : trend < 0 
                          ? theme.colors.error 
                          : theme.colors.onSurfaceVariant
                    }
                  ]}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </Text>
                  {trendLabel && (
                    <Text variant="labelSmall" style={styles(theme).trendLabel}>
                      {trendLabel}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </CardWrapper>
        </View>
      </Surface>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  cardWrapper: {
    width: '47%', // To fit 2 per row with some margin
    marginVertical: theme.spacing.s,
  },
  card: {
    borderRadius: theme.roundness * 1.5,
  },
  cardInnerWrapper: {
    overflow: 'hidden',
    borderRadius: theme.roundness * 1.5,
  },
  cardContent: {
    borderRadius: theme.roundness * 1.5,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  textContent: {
    width: '100%',
  },
  title: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  value: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  trend: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendLabel: {
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
}); 