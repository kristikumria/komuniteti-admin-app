import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../store/hooks';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  marginBottom?: number;
  marginTop?: number;
}

/**
 * A component for consistent section headers across the application.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightContent,
  marginBottom = 16,
  marginTop = 0,
}) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings?.darkMode) ?? false;
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          marginBottom, 
          marginTop,
          borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      ]}
    >
      <View style={styles.titleContainer}>
        <View>
          <Text style={[
            styles.title,
            { color: isDarkMode ? '#ffffff' : theme.colors.onBackground }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.subtitle,
              { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : theme.colors.onSurfaceVariant }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightContent && (
          <View style={styles.rightContent}>
            {rightContent}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 