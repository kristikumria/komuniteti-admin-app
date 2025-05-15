import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Building2, Plus } from 'lucide-react-native';

interface EmptyBuildingsListProps {
  searchQuery: string;
  onAddPress: () => void;
}

export const EmptyBuildingsList: React.FC<EmptyBuildingsListProps> = ({
  searchQuery,
  onAddPress,
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Building2 
        size={64} 
        color={theme.colors.onSurfaceVariant} 
        style={{ opacity: 0.6 }} 
      />
      
      <Text style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
        {searchQuery 
          ? "No buildings match your search" 
          : "No buildings found"
        }
      </Text>
      
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        {searchQuery 
          ? "Try adjusting your search criteria" 
          : "Add your first building to get started"
        }
      </Text>
      
      {!searchQuery && (
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={onAddPress}
        >
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>Add Building</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 