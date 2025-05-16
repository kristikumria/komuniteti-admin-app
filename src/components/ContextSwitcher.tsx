import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, Animated, Dimensions } from 'react-native';
import { Text, Divider, ActivityIndicator, Surface, IconButton, useTheme } from 'react-native-paper';
import { ChevronDown, Building2, Briefcase, Check, X } from 'lucide-react-native';
import { useContextData } from '../hooks/useContextData';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';

interface ContextSwitcherProps {
  containerStyle?: object;
}

/**
 * A context switching component that allows users to switch between business accounts or buildings.
 * Follows Material Design 3 guidelines with proper animations, elevation, and accessibility.
 * 
 * @example
 * <ContextSwitcher />
 */
export const ContextSwitcher = ({ containerStyle }: ContextSwitcherProps) => {
  const { theme } = useThemedStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];
  
  const {
    userRole,
    currentBusinessAccount,
    businessAccounts,
    currentBuilding,
    assignedBuildings,
    isLoading,
    changeBusinessAccount,
    changeBuilding,
  } = useContextData();
  
  // Control animations when modal visibility changes
  useEffect(() => {
    if (modalVisible) {
      // Fade in the overlay
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      
      // Slide up the content
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out the overlay
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Slide down the content
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);
  
  // Determine label and options based on user role
  const contextLabel = userRole === 'business_manager' 
    ? (currentBusinessAccount?.name || 'Select Business Account')
    : (currentBuilding?.name || 'Select Building');
  
  const contextOptions = userRole === 'business_manager' 
    ? businessAccounts
    : assignedBuildings;
  
  // Handle selection of context
  const handleSelectContext = (id: string) => {
    if (userRole === 'business_manager') {
      changeBusinessAccount(id);
    } else {
      changeBuilding(id);
    }
    setModalVisible(false);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  // Render an individual context option
  const renderContextOption = ({ item }: { item: any }) => {
    const isActive = userRole === 'business_manager'
      ? item.id === currentBusinessAccount?.id
      : item.id === currentBuilding?.id;
    
    return (
      <TouchableOpacity
        style={[
          styles(theme).contextOption,
          isActive && { backgroundColor: theme.colors.primaryContainer }
        ]}
        onPress={() => handleSelectContext(item.id)}
        accessibilityRole="radio"
        accessibilityState={{ checked: isActive }}
        accessibilityLabel={`${item.name}${item.address ? `, ${item.address}` : ''}`}
      >
        <View style={styles(theme).contextOptionContent}>
          <View style={styles(theme).contextIconContainer}>
            {userRole === 'business_manager' ? (
              <Briefcase size={24} color={isActive ? theme.colors.onPrimaryContainer : theme.colors.primary} />
            ) : (
              <Building2 size={24} color={isActive ? theme.colors.onPrimaryContainer : theme.colors.primary} />
            )}
          </View>
          
          <View style={styles(theme).contextDetails}>
            <Text 
              variant="bodyLarge" 
              style={[
                styles(theme).contextName,
                isActive && { color: theme.colors.onPrimaryContainer }
              ]}
            >
              {item.name}
            </Text>
            {item.address && (
              <Text 
                variant="bodySmall" 
                style={[
                  styles(theme).contextDescription,
                  isActive && { color: theme.colors.onPrimaryContainer }
                ]}
              >
                {item.address}
              </Text>
            )}
          </View>
          
          {isActive && (
            <Check size={20} color={theme.colors.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles(theme).container, containerStyle]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={[styles(theme).container, containerStyle]}>
      <TouchableOpacity
        style={styles(theme).button}
        onPress={() => setModalVisible(true)}
        disabled={contextOptions.length <= 1}
        accessibilityRole="button"
        accessibilityLabel={`Currently selected: ${contextLabel}${contextOptions.length > 1 ? '. Tap to change.' : ''}`}
        accessibilityState={{
          disabled: contextOptions.length <= 1,
        }}
      >
        <Text 
          variant="bodyMedium"
          style={styles(theme).buttonText}
          numberOfLines={1}
        >
          {contextLabel}
        </Text>
        
        {contextOptions.length > 1 && (
          <ChevronDown size={18} color={theme.colors.onSurfaceVariant} />
        )}
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Animated.View
          style={[
            styles(theme).modalOverlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity
            style={styles(theme).modalOverlayTouchable}
            activeOpacity={1}
            onPress={closeModal}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
          />
            
          <Animated.View
            style={[
              styles(theme).modalContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Surface 
              style={styles(theme).modalContent}
              elevation={ElevationLevel.Level3}
            >
              <View style={styles(theme).modalHeader}>
                <Text variant="titleLarge" style={styles(theme).modalTitle}>
                  {userRole === 'business_manager' ? 'Select Business Account' : 'Select Building'}
                </Text>
                
                <IconButton
                  icon={() => <X size={20} color={theme.colors.onSurfaceVariant} />}
                  onPress={closeModal}
                  size={20}
                  accessibilityLabel="Close"
                />
              </View>
              
              <Divider style={styles(theme).divider} />
              
              <FlatList
                data={contextOptions}
                renderItem={renderContextOption}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles(theme).contextList}
                ItemSeparatorComponent={() => (
                  <Divider style={styles(theme).optionDivider} />
                )}
                ListEmptyComponent={() => (
                  <Text 
                    variant="bodyMedium"
                    style={styles(theme).emptyText}
                  >
                    {userRole === 'business_manager' 
                      ? 'No business accounts available' 
                      : 'No buildings assigned'
                    }
                  </Text>
                )}
              />
            </Surface>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    marginRight: theme.spacing.s,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    height: 36,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surfaceVariant + '20',
  },
  buttonText: {
    fontWeight: '500',
    marginRight: 4,
    maxWidth: 200,
    color: theme.colors.onSurface,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    margin: theme.spacing.l,
    marginTop: 80,
  },
  modalContent: {
    borderRadius: theme.roundness * 1.5,
    padding: theme.spacing.m,
    maxHeight: '80%',
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  modalTitle: {
    color: theme.colors.onSurface,
  },
  divider: {
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.outlineVariant,
  },
  contextList: {
    paddingBottom: theme.spacing.s,
  },
  contextOption: {
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  contextOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  contextDetails: {
    flex: 1,
  },
  contextName: {
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  contextDescription: {
    color: theme.colors.onSurfaceVariant,
  },
  optionDivider: {
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    padding: theme.spacing.m,
  },
}); 