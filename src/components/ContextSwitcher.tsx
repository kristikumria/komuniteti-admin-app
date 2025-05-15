import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { Text, useTheme, Divider, ActivityIndicator } from 'react-native-paper';
import { ChevronDown, Building2, Briefcase, Check } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';
import { useContextData } from '../hooks/useContextData';

interface ContextSwitcherProps {
  containerStyle?: object;
}

export const ContextSwitcher = ({ containerStyle }: ContextSwitcherProps) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
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
  
  // Render an individual context option
  const renderContextOption = ({ item }: { item: any }) => {
    const isActive = userRole === 'business_manager'
      ? item.id === currentBusinessAccount?.id
      : item.id === currentBuilding?.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.contextOption,
          isActive && { backgroundColor: `${theme.colors.primary}15` }
        ]}
        onPress={() => handleSelectContext(item.id)}
      >
        <View style={styles.contextOptionContent}>
          <View style={styles.contextIconContainer}>
            {userRole === 'business_manager' ? (
              <Briefcase size={24} color={theme.colors.primary} />
            ) : (
              <Building2 size={24} color={theme.colors.primary} />
            )}
          </View>
          
          <View style={styles.contextDetails}>
            <Text style={styles.contextName}>{item.name}</Text>
            {item.address && (
              <Text style={styles.contextDescription}>{item.address}</Text>
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
      <View style={[styles.container, containerStyle]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        disabled={contextOptions.length <= 1}
      >
        <Text 
          style={[
            styles.buttonText, 
            { color: theme.colors.onSurface }
          ]}
          numberOfLines={1}
        >
          {contextLabel}
        </Text>
        
        {contextOptions.length > 1 && (
          <ChevronDown size={18} color={theme.colors.onSurface} />
        )}
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={[
              styles.modalContent,
              { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
            ]}
          >
            <Text style={styles.modalTitle}>
              {userRole === 'business_manager' ? 'Select Business Account' : 'Select Building'}
            </Text>
            
            <Divider style={styles.divider} />
            
            <FlatList
              data={contextOptions}
              renderItem={renderContextOption}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.contextList}
              ItemSeparatorComponent={() => <Divider style={styles.optionDivider} />}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>
                  {userRole === 'business_manager' 
                    ? 'No business accounts available' 
                    : 'No buildings assigned'
                  }
                </Text>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 36,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
    maxWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    marginTop: 80,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  contextList: {
    paddingBottom: 8,
  },
  contextOption: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  contextOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contextDetails: {
    flex: 1,
  },
  contextName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contextDescription: {
    fontSize: 12,
    opacity: 0.6,
  },
  optionDivider: {
    opacity: 0.2,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 24,
    opacity: 0.6,
  },
}); 