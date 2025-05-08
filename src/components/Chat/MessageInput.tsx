import * as React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const { useState } = React;

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  placeholder?: string;
  isSending?: boolean;
  onAttach?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  isSending = false,
  onAttach,
}) => {
  const [messageText, setMessageText] = useState<string>('');

  const handleSend = async () => {
    if (!messageText.trim() || isSending) return;
    
    try {
      await onSend(messageText.trim());
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.inputContainer}>
        {onAttach && (
          <TouchableOpacity style={styles.attachButton} onPress={onAttach}>
            <MaterialIcons name="attach-file" size={24} color={theme.colors.grey} />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            (!messageText.trim() || isSending) ? styles.sendButtonDisabled : {}
          ]} 
          onPress={handleSend}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialIcons name="send" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.lightGrey,
  },
});

export default MessageInput; 