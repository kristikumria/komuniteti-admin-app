import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity, Animated, Dimensions, BackHandler } from 'react-native';
import { Text, Button, Divider, Chip, RadioButton, Surface, IconButton } from 'react-native-paper';
import { X, ArrowUp, ArrowDown, Filter, SortAsc } from 'lucide-react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';

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

/**
 * A modal component for filtering and sorting data.
 * Follows Material Design 3 guidelines with proper elevation, animations, and accessibility.
 * 
 * @example
 * <FilterModal 
 *   visible={showFilter}
 *   onDismiss={() => setShowFilter(false)}
 *   config={filterConfig}
 *   onApplyFilters={handleApplyFilters}
 * />
 */
export const FilterModal: React.FC<FilterModalProps> = ({
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
}) => {
  const { theme } = useThemedStyles();
  
  const isModalVisible = visible || isVisible || false;
  const handleDismiss = onDismiss || onClose || (() => {});
  const initialFilterValues = activeFilters || initialFilters;
  const initialSortValue = activeSort || initialSort;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  
  // Get active filter and sort counts
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const [filters, setFilters] = useState<Record<string, string[]>>(() => {
    const initialState: Record<string, string[]> = {};
    config?.filterGroups?.forEach(group => {
      initialState[group.id] = initialFilterValues[group.id] || [];
    });
    return initialState;
  });
  
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>(initialSortValue);
  
  // Handle animation when visibility changes
  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible, fadeAnim, slideAnim]);
  
  // Handle back button press to close modal
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isModalVisible) {
        handleDismiss();
        return true;
      }
      return false;
    });
    
    return () => backHandler.remove();
  }, [isModalVisible, handleDismiss]);
  
  // Update active filter count
  useEffect(() => {
    let count = 0;
    Object.values(filters).forEach(groupFilters => {
      count += groupFilters.length;
    });
    if (sort.field !== '') count++;
    setActiveFilterCount(count);
  }, [filters, sort]);
  
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
  
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleDismiss();
    });
  };
  
  return (
    <Modal
      visible={isModalVisible}
      animationType="none"
      transparent={true}
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View style={styles(theme).modalContainer}>
        <Animated.View 
          style={[
            styles(theme).overlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles(theme).overlayTouchable} 
            activeOpacity={1} 
            onPress={closeModal}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles(theme).modalWrap,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Surface style={styles(theme).modalContent} elevation={ElevationLevel.Level3}>
            <View style={styles(theme).modalOverflowContainer}>
              <View style={styles(theme).header}>
                <View style={styles(theme).headerContent}>
                  <Filter size={20} color={theme.colors.primary} style={styles(theme).headerIcon} />
                  <Text variant="titleLarge" style={styles(theme).title}>
                    Filters & Sorting
                  </Text>
                  {activeFilterCount > 0 && (
                    <Chip 
                      mode="flat" 
                      style={styles(theme).countChip}
                      textStyle={{ color: theme.colors.onPrimary }}
                    >
                      {activeFilterCount}
                    </Chip>
                  )}
                </View>
                <IconButton
                  icon={() => <X size={22} color={theme.colors.onSurfaceVariant} />}
                  onPress={closeModal}
                  accessibilityLabel="Close filters"
                />
              </View>
              
              <Divider style={styles(theme).divider} />
              
              <ScrollView 
                style={styles(theme).scrollView}
                contentContainerStyle={styles(theme).scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {config?.filterGroups?.map(group => (
                  <View key={group.id} style={styles(theme).section}>
                    <Text variant="titleMedium" style={styles(theme).sectionTitle}>
                      {group.name}
                    </Text>
                    
                    <View style={styles(theme).optionsContainer}>
                      {group.options.map(option => {
                        const isSelected = filters[group.id]?.includes(option.id);
                        return (
                          <Chip
                            key={option.id}
                            selected={isSelected}
                            onPress={() => handleToggleFilter(group.id, option.id, group.multiSelect)}
                            style={[
                              styles(theme).filterChip,
                              isSelected && { backgroundColor: theme.colors.primaryContainer }
                            ]}
                            textStyle={{
                              color: isSelected 
                                ? theme.colors.onPrimaryContainer
                                : theme.colors.onSurfaceVariant
                            }}
                            showSelectedCheck={false}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: isSelected }}
                            accessibilityLabel={`${option.label} filter ${isSelected ? 'active' : 'inactive'}`}
                          >
                            {option.label}
                          </Chip>
                        );
                      })}
                    </View>
                  </View>
                ))}
                
                {config?.sortOptions?.length > 0 && (
                  <View style={styles(theme).section}>
                    <View style={styles(theme).sectionHeader}>
                      <SortAsc size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
                        Sort By
                      </Text>
                    </View>
                    
                    {config?.sortOptions?.map(option => {
                      const isSelected = sort.field === option.id;
                      const isAscending = sort.direction === 'asc';
                      
                      return (
                        <Surface
                          key={option.id}
                          style={[
                            styles(theme).sortOption,
                            isSelected && styles(theme).selectedSortOption
                          ]}
                          elevation={isSelected ? ElevationLevel.Level2 : ElevationLevel.Level1}
                        >
                          <TouchableOpacity
                            style={styles(theme).sortOptionContent}
                            onPress={() => handleSort(option.id)}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: isSelected }}
                            accessibilityLabel={`Sort by ${option.label} ${isSelected ? (isAscending ? 'ascending' : 'descending') : ''}`}
                          >
                            <View style={styles(theme).sortOptionTextContainer}>
                              <RadioButton
                                value={option.id}
                                status={isSelected ? 'checked' : 'unchecked'}
                                onPress={() => handleSort(option.id)}
                                color={theme.colors.primary}
                              />
                              <Text variant="bodyLarge" style={styles(theme).sortOptionText}>
                                {option.label}
                              </Text>
                            </View>
                            
                            {isSelected && (
                              <View style={styles(theme).directionIcon}>
                                {isAscending ? (
                                  <ArrowUp size={20} color={theme.colors.primary} />
                                ) : (
                                  <ArrowDown size={20} color={theme.colors.primary} />
                                )}
                              </View>
                            )}
                          </TouchableOpacity>
                        </Surface>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
              
              <Surface 
                style={styles(theme).footer} 
                elevation={ElevationLevel.Level2}
              >
                <Button
                  mode="outlined"
                  onPress={handleReset}
                  style={styles(theme).resetButton}
                  labelStyle={{ color: theme.colors.error }}
                  disabled={!hasActiveFilters}
                  accessibilityLabel="Reset all filters and sorting"
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !hasActiveFilters }}
                >
                  Reset
                </Button>
                
                <Button
                  mode="contained"
                  onPress={handleApply}
                  style={styles(theme).applyButton}
                  accessibilityLabel={`Apply ${activeFilterCount} filters`}
                  accessibilityRole="button"
                >
                  Apply
                </Button>
              </Surface>
            </View>
          </Surface>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalWrap: {
    width: '100%',
    maxHeight: '90%',
    borderTopLeftRadius: theme.roundness * 3,
    borderTopRightRadius: theme.roundness * 3,
    overflow: 'hidden',
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.roundness * 3,
    borderTopRightRadius: theme.roundness * 3,
  },
  modalOverflowContainer: {
    overflow: 'hidden',
    borderTopLeftRadius: theme.roundness * 3,
    borderTopRightRadius: theme.roundness * 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: theme.spacing.xs,
  },
  title: {
    color: theme.colors.onSurface,
  },
  countChip: {
    backgroundColor: theme.colors.primary,
    height: 26,
    marginLeft: theme.spacing.s,
  },
  divider: {
    backgroundColor: theme.colors.outlineVariant,
  },
  scrollView: {
    maxHeight: '70%',
  },
  scrollContent: {
    paddingBottom: theme.spacing.l,
  },
  section: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.s,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  filterChip: {
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
  },
  sortOption: {
    marginBottom: theme.spacing.s,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  selectedSortOption: {
    backgroundColor: theme.colors.surfaceVariant + '40',
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.s,
  },
  sortOptionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionText: {
    marginLeft: theme.spacing.s,
    color: theme.colors.onSurface,
  },
  directionIcon: {
    padding: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surface,
  },
  resetButton: {
    flex: 1,
    marginRight: theme.spacing.s,
    borderColor: theme.colors.error,
  },
  applyButton: {
    flex: 1,
  },
});