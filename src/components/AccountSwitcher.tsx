import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, RadioButton, IconButton } from 'react-native-paper';
import { User, Building2, ArrowRightLeft } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

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
  const { theme } = useThemedStyles();

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={[
        styles(theme).accountItem,
        currentAccountId === item.id && {
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.primary,
          borderWidth: 1
        }
      ]}
      onPress={() => onAccountSwitch(item.id)}
    >
      <View style={styles(theme).accountItemContent}>
        {item.icon ? (
          <Text style={styles(theme).accountIcon}>{item.icon}</Text>
        ) : (
          <View style={[styles(theme).accountAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
            <User size={20} color={theme.colors.primary} />
          </View>
        )}
        <View style={styles(theme).accountInfo}>
          <Text variant="bodyMedium" style={styles(theme).accountName}>
            {item.name}
          </Text>
          {item.email && (
            <Text variant="bodySmall" style={styles(theme).accountEmail}>
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
      <View style={styles(theme).modalContainer}>
        <View style={[styles(theme).modalContent]}>
          <View style={styles(theme).modalHeader}>
            <Text variant="titleMedium" style={styles(theme).headerTitle}>
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
            ItemSeparatorComponent={() => <Divider style={styles(theme).divider} />}
          />
          
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={{ marginTop: theme.spacing.m }}
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
  const { theme } = useThemedStyles();
  
  return (
    <TouchableOpacity 
      style={styles(theme).switchButton}
      onPress={onPress}
    >
      <View style={styles(theme).switchButtonContent}>
        {isBusinessManager ? (
          <>
            <Building2 size={20} color={theme.colors.primary} style={styles(theme).switchIcon} />
            <Text variant="bodyMedium">Switch Business Account</Text>
          </>
        ) : (
          <>
            <ArrowRightLeft size={20} color={theme.colors.primary} style={styles(theme).switchIcon} />
            <Text variant="bodyMedium">Switch Building</Text>
          </>
        )}
      </View>
      <Text style={styles(theme).arrowRight}>›</Text>
    </TouchableOpacity>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.scrim + '80',
    padding: theme.spacing.m,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  headerTitle: {
    color: theme.colors.onSurface,
  },
  accountItem: {
    padding: theme.spacing.s + 4, // 12px
    borderRadius: theme.roundness,
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
    marginRight: theme.spacing.s + 4, // 12px
  },
  accountIcon: {
    fontSize: 24,
    marginRight: theme.spacing.s + 4, // 12px
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  accountEmail: {
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    backgroundColor: theme.colors.outlineVariant,
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s + 4, // 12px
  },
  switchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchIcon: {
    marginRight: theme.spacing.s + 4, // 12px
  },
  arrowRight: {
    fontSize: 18,
    opacity: 0.5,
    color: theme.colors.onSurfaceVariant,
  }
}); 