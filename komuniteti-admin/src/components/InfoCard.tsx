import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../store/hooks';

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
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const cardBgColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const iconBgColor = color || theme.colors.primary;
  
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  return (
    <View style={styles.cardWrapper}>
      <Card style={styles.card}>
        <View style={{ borderRadius: 12 }}>
          <View style={{ overflow: 'hidden', borderRadius: 12 }}>
            <CardWrapper
              style={[styles.cardContent, { backgroundColor: cardBgColor }]}
              onPress={onPress}
            >
              <View style={styles.content}>
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
              </View>
            </CardWrapper>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 8,
  },
  card: {
    borderRadius: 12,
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
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
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