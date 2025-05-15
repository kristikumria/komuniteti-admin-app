import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Searchbar, Button, useTheme } from 'react-native-paper';
import { Building2, Search, Plus } from 'lucide-react-native';

interface BuildingsHeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddPress: () => void;
}

export const BuildingsHeader: React.FC<BuildingsHeaderProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onAddPress,
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Button 
          mode="contained" 
          onPress={onAddPress}
          icon={({ size, color }) => <Plus size={size} color={color} />}
        >
          Add
        </Button>
      </View>
      
      <Searchbar
        placeholder="Search buildings..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        icon={({ size, color }) => <Search size={size} color={color} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
}); 