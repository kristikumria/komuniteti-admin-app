import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Button, Text, Portal, useTheme } from 'react-native-paper';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  content: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  content,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) => {
  const theme = useTheme();
  
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onCancel}
        style={styles.dialog}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            onPress={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button 
            onPress={onConfirm}
            loading={loading}
            disabled={loading}
            textColor={danger ? theme.colors.error : theme.colors.primary}
            mode={danger ? 'text' : 'contained'}
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 28,
  },
}); 