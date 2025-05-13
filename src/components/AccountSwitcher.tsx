import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, RadioButton, IconButton, useTheme } from 'react-native-paper';
import { User, Building2, ArrowRightLeft } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';

interface Account {
  id: string;
  name: string;
  role: string;
  email?: string;
  icon?: string;
}

interface AccountSwitcherProps {
  visible: boolean;
  onDismiss: () => void;
  onAccountSwitch: (accountId: string) => void;
  currentAccountId: string;
  accounts: Account[];
  isBusinessManager: boolean;
}

export const AccountSwitcher = ({
  visible,
  onDismiss,
  onAccountSwitch,
  currentAccountId,
  accounts,
  isBusinessManager
}: AccountSwitcherProps) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={[
        styles.accountItem,
        currentAccountId === item.id && {
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.primary,
          borderWidth: 1
        }
      ]}
      onPress={() => onAccountSwitch(item.id)}
    >
      <View style={styles.accountItemContent}>
        {item.icon ? (
          <Text style={styles.accountIcon}>{item.icon}</Text>
        ) : (
          <View style={[styles.accountAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
            <User size={20} color={theme.colors.primary} />
          </View>
        )}
        <View style={styles.accountInfo}>
          <Text variant="bodyMedium" style={[styles.accountName, { color: isDarkMode ? '#fff' : '#333' }]}>
            {item.name}
          </Text>
          {item.email && (
            <Text variant="bodySmall" style={{ color: isDarkMode ? '#ccc' : '#666' }}>
              {item.email}
            </Text>
          )}
        </View>
        <RadioButton
          value={item.id}
          status={currentAccountId === item.id ? 'checked' : 'unchecked'}
          onPress={() => onAccountSwitch(item.id)}
          color={theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text variant="titleMedium" style={{ color: isDarkMode ? '#fff' : '#333' }}>
              {isBusinessManager ? 'Switch Business Account' : 'Switch Building'}
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
            />
          </View>
          
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            renderItem={renderAccountItem}
            ItemSeparatorComponent={() => <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />}
          />
          
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={{ marginTop: 16 }}
          >
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export const AccountSwitcherButton = ({
  onPress,
  isBusinessManager
}: {
  onPress: () => void;
  isBusinessManager: boolean;
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.switchButton}
      onPress={onPress}
    >
      <View style={styles.switchButtonContent}>
        {isBusinessManager ? (
          <>
            <Building2 size={20} color={theme.colors.primary} style={styles.switchIcon} />
            <Text variant="bodyMedium">Switch Business Account</Text>
          </>
        ) : (
          <>
            <ArrowRightLeft size={20} color={theme.colors.primary} style={styles.switchIcon} />
            <Text variant="bodyMedium">Switch Building</Text>
          </>
        )}
      </View>
      <Text style={styles.arrowRight}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  accountItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontWeight: '500',
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchIcon: {
    marginRight: 12,
  },
  arrowRight: {
    fontSize: 18,
    opacity: 0.5,
  }
}); 