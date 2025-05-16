import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <MaterialIcons 
        name={icon} 
        size={80} 
        color={theme.colors.primary} 
        style={{ opacity: 0.7 }} 
      />
      
      <Text 
        style={[styles.title, { color: theme.colors.onSurface }]}
        variant="headlineSmall"
      >
        {title}
      </Text>
      
      <Text 
        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        variant="bodyMedium"
      >
        {description}
      </Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={onAction}
        >
          <Text style={styles.actionButtonText}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: '80%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
}); 