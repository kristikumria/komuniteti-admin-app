import React, { useState } from 'react';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, Divider, Chip, RadioButton, TextInput } from 'react-native-paper';
import { X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';

export interface FilterOption {
  id: string;
  label: string;
  value: boolean;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface FilterConfig {
  filterGroups: {
    id: string;
    name: string;
    options: FilterOption[];
    multiSelect?: boolean;
  }[];
  sortOptions: SortOption[];
}

export interface FilterModalProps {
  visible?: boolean;
  isVisible?: boolean;
  onDismiss?: () => void;
  onClose?: () => void;
  config: FilterConfig;
  onApplyFilters: (filters: Record<string, string[]>, sort: { field: string; direction: 'asc' | 'desc' }) => void;
  initialFilters?: Record<string, string[]>;
  initialSort?: { field: string; direction: 'asc' | 'desc' };
  activeFilters?: Record<string, string[]>;
  activeSort?: { field: string; direction: 'asc' | 'desc' };
}

export const FilterModal = ({
  visible,
  isVisible,
  onDismiss,
  onClose,
  config = { filterGroups: [], sortOptions: [] },
  onApplyFilters,
  initialFilters = {},
  initialSort = { field: '', direction: 'asc' },
  activeFilters,
  activeSort
}: FilterModalProps) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const isModalVisible = visible || isVisible || false;
  const handleDismiss = onDismiss || onClose || (() => {});
  const initialFilterValues = activeFilters || initialFilters;
  const initialSortValue = activeSort || initialSort;
  
  const [filters, setFilters] = useState<Record<string, string[]>>(() => {
    const initialState: Record<string, string[]> = {};
    config?.filterGroups?.forEach(group => {
      initialState[group.id] = initialFilterValues[group.id] || [];
    });
    return initialState;
  });
  
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>(initialSortValue);
  
  const handleToggleFilter = (groupId: string, optionId: string, multiSelect?: boolean) => {
    setFilters(prev => {
      const currentGroup = [...(prev[groupId] || [])];
      
      if (multiSelect) {
        if (currentGroup.includes(optionId)) {
          return {
            ...prev,
            [groupId]: currentGroup.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [groupId]: [...currentGroup, optionId]
          };
        }
      } else {
        if (currentGroup.includes(optionId)) {
          return {
            ...prev,
            [groupId]: []
          };
        } else {
          return {
            ...prev,
            [groupId]: [optionId]
          };
        }
      }
    });
  };
  
  const handleSort = (fieldId: string) => {
    setSort(prev => {
      if (prev.field === fieldId) {
        return {
          field: fieldId,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        return {
          field: fieldId,
          direction: 'asc'
        };
      }
    });
  };
  
  const handleReset = () => {
    const resetFilters: Record<string, string[]> = {};
    config?.filterGroups?.forEach(group => {
      resetFilters[group.id] = [];
    });
    setFilters(resetFilters);
    setSort({ field: '', direction: 'asc' });
  };
  
  const handleApply = () => {
    if (typeof onApplyFilters === 'function') {
      onApplyFilters(filters, sort);
    }
    handleDismiss();
  };
  
  const hasActiveFilters = Object.values(filters).some(group => group.length > 0) || sort.field !== '';
  
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleDismiss}
    >
      <View 
        style={[
          styles.modalContainer,
          { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
        ]}
      >
        <View 
          style={[
            styles.modalContent,
            { 
              backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
              borderColor: isDarkMode ? '#333' : '#eee' 
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#333' }]}>
              Filters & Sorting
            </Text>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#fff' : '#333'} />
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.divider} />
          
          <ScrollView style={styles.scrollView}>
            {config?.filterGroups?.map(group => (
              <View key={group.id} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {group.name}
                </Text>
                
                <View style={styles.optionsContainer}>
                  {group.options.map(option => (
                    <Chip
                      key={option.id}
                      selected={filters[group.id]?.includes(option.id)}
                      onPress={() => handleToggleFilter(group.id, option.id, group.multiSelect)}
                      style={[
                        styles.filterChip,
                        filters[group.id]?.includes(option.id) && 
                          { backgroundColor: theme.colors.primary }
                      ]}
                      textStyle={{
                        color: filters[group.id]?.includes(option.id) ? '#fff' : isDarkMode ? '#fff' : '#333'
                      }}
                    >
                      {option.label}
                    </Chip>
                  ))}
                </View>
              </View>
            ))}
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Sort By
              </Text>
              
              {config?.sortOptions?.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }
                  ]}
                  onPress={() => handleSort(option.id)}
                >
                  <View style={styles.sortOptionContent}>
                    <RadioButton
                      value={option.id}
                      status={sort.field === option.id ? 'checked' : 'unchecked'}
                      onPress={() => handleSort(option.id)}
                      color={theme.colors.primary}
                    />
                    <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
                      {option.label}
                    </Text>
                  </View>
                  
                  {sort.field === option.id && (
                    sort.direction === 'asc' ? 
                      <ArrowUp size={20} color={theme.colors.primary} /> :
                      <ArrowDown size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <Divider style={styles.divider} />
          
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.resetButton}
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
            >
              Apply
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingTop: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  divider: {
    height: 1,
  },
  scrollView: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    margin: 4,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});