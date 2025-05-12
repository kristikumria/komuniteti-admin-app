import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../store/hooks';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

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
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings?.darkMode) ?? false;
  
  const cardBgColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const iconBgColor = color || theme.colors.primary;
  
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  return (
    <View style={styles.cardWrapper}>
      <Card 
        style={styles.card}
        elevation={2}
      >
        <View style={styles.cardInnerWrapper}>
        <CardWrapper
          style={[styles.cardContent, { backgroundColor: cardBgColor }]}
          onPress={onPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            {icon}
          </View>
          
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: isDarkMode ? '#e0e0e0' : '#666' }]}>{title}</Text>
            <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#333' }]}>{value}</Text>
            
            {subtitle && (
              <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#888' }]}>
                {subtitle}
              </Text>
            )}
            
            {trend !== undefined && (
              <View style={styles.trendContainer}>
                {trend > 0 ? (
                  <TrendingUp 
                    size={14} 
                    color="#4caf50" 
                    style={{ marginRight: 4 }} 
                  />
                ) : trend < 0 ? (
                  <TrendingDown 
                    size={14} 
                    color="#f44336" 
                    style={{ marginRight: 4 }} 
                  />
                ) : null}
                <Text style={[
                  styles.trend, 
                  { 
                    color: trend > 0 
                      ? '#4caf50' 
                      : trend < 0 
                        ? '#f44336' 
                        : isDarkMode 
                          ? '#aaa' 
                          : '#888' 
                  }
                ]}>
                  {trend > 0 ? '+' : ''}{trend}%
                </Text>
                {trendLabel && (
                  <Text style={[styles.trendLabel, { color: isDarkMode ? '#aaa' : '#888' }]}>
                    {trendLabel}
                  </Text>
                )}
              </View>
            )}
          </View>
        </CardWrapper>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '47%', // To fit 2 per row with some margin
    marginVertical: 8,
  },
  card: {
    borderRadius: 12,
  },
  cardInnerWrapper: {
    overflow: 'hidden',
  },
  cardContent: {
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  textContent: {
    width: '100%',
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trend: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
}); 