import * as React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { theme } from '../../theme';
import { ChatMessage, ChatAttachment } from '../../navigation/types';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showSender?: boolean;
  onPressImage?: (imageUrl: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showSender = false,
  onPressImage,
}) => {
  const messageTime = format(new Date(message.timestamp), 'h:mm a');
  
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <View style={styles.attachmentsContainer}>
        {message.attachments.map((attachment: ChatAttachment) => {
          if (attachment.type === 'image') {
            return (
              <TouchableOpacity 
                key={attachment.id}
                onPress={() => onPressImage && onPressImage(attachment.url)}
              >
                <Image
                  source={{ uri: attachment.thumbnailUrl || attachment.url }}
                  style={styles.imageAttachment}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }
          
          if (attachment.type === 'document') {
            return (
              <View style={styles.documentAttachment} key={attachment.id}>
                <MaterialIcons name="insert-drive-file" size={24} color={theme.colors.primary} />
                <Text style={styles.documentName} numberOfLines={1}>{attachment.name}</Text>
              </View>
            );
          }
          
          return null;
        })}
      </View>
    );
  };
  
  return (
    <View style={[
      styles.container, 
      isOwnMessage ? styles.ownContainer : styles.otherContainer
    ]}>
      {showSender && !isOwnMessage && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      
      <View style={[
        styles.bubble, 
        isOwnMessage ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText, 
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.content}
        </Text>
        
        {renderAttachments()}
      </View>
      
      <View style={styles.bottomRow}>
        <Text style={[
          styles.timeText, 
          isOwnMessage ? styles.ownTimeText : styles.otherTimeText
        ]}>
          {messageTime}
        </Text>
        
        {isOwnMessage && (
          <View style={styles.statusContainer}>
            {message.status === 'sending' && (
              <MaterialIcons name="access-time" size={14} color={theme.colors.grey} />
            )}
            {message.status === 'sent' && (
              <MaterialIcons name="check" size={14} color={theme.colors.grey} />
            )}
            {message.status === 'delivered' && (
              <MaterialIcons name="done-all" size={14} color={theme.colors.grey} />
            )}
            {message.status === 'read' && (
              <MaterialIcons name="done-all" size={14} color={theme.colors.primary} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: theme.colors.darkGrey,
    marginBottom: 2,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    marginRight: 4,
  },
  ownTimeText: {
    color: theme.colors.lightGrey,
    textAlign: 'right',
  },
  otherTimeText: {
    color: theme.colors.grey,
  },
  statusContainer: {
    marginLeft: 2,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  imageAttachment: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 4,
  },
  documentAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  documentName: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
});

export default MessageBubble; 