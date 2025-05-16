import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Avatar, Badge, useTheme } from 'react-native-paper';
import { ChatConversation } from '../../navigation/types';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListItemProps {
  conversation: ChatConversation;
  onPress: (conversationId: string) => void;
  onLongPress?: (conversationId: string) => void;
  isSelected?: boolean;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  onPress,
  onLongPress,
  isSelected = false,
}) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffInHours < 24) {
        // For messages less than 24 hours old, show the time
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 48) {
        // For messages between 24 and 48 hours, show "Yesterday"
        return 'Yesterday';
      } else {
        // Use format-distance-to-now for older messages
        return formatDistanceToNow(date, { addSuffix: true });
      }
    } catch (e) {
      return '';
    }
  };

  const renderAvatar = () => {
    if (conversation.isGroup && conversation.image) {
      return (
        <Avatar.Image
          size={50}
          source={{ uri: conversation.image }}
        />
      );
    } else if (conversation.isGroup) {
      // For group chats without an image, show first letter of the title
      return (
        <Avatar.Text
          size={50}
          label={conversation.title.substring(0, 1).toUpperCase()}
          style={{ backgroundColor: theme.colors.primaryContainer }}
          labelStyle={{ color: theme.colors.primary }}
        />
      );
    } else {
      // For one-on-one chats, show the participant's avatar
      const participant = conversation.participants[0];
      if (participant.image) {
        return (
          <Avatar.Image
            size={50}
            source={{ uri: participant.image }}
          />
        );
      } else {
        return (
          <Avatar.Text
            size={50}
            label={participant.name.substring(0, 1).toUpperCase()}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            labelStyle={{ color: theme.colors.primary }}
          />
        );
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected ? theme.colors.primaryContainer : 'transparent',
          borderLeftWidth: isSelected ? 4 : 0,
          borderLeftColor: isSelected ? theme.colors.primary : 'transparent',
        },
      ]}
      onPress={() => onPress(conversation.id)}
      onLongPress={() => onLongPress && onLongPress(conversation.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {renderAvatar()}
        {conversation.participants.some(p => p.isOnline) && (
          <Badge
            size={14}
            style={[styles.onlineBadge, { backgroundColor: '#4CAF50' }]}
          />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text 
            style={[
              styles.title, 
              { 
                color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                fontWeight: isSelected || conversation.unreadCount > 0 ? '700' : '600'
              }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {conversation.title}
          </Text>
          <Text 
            style={[
              styles.time, 
              { 
                color: theme.colors.onSurfaceVariant,
                fontWeight: conversation.unreadCount > 0 ? '500' : '400'
              }
            ]}
          >
            {conversation.lastMessage ? formatMessageTime(conversation.lastMessage.timestamp) : ''}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.message, 
              { 
                color: conversation.unreadCount > 0 ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                fontWeight: conversation.unreadCount > 0 ? '500' : '400',
                opacity: conversation.unreadCount > 0 ? 1 : 0.8
              }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
          </Text>
          
          {conversation.unreadCount > 0 && (
            <Badge
              size={22}
              style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}
            >
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Badge>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    marginLeft: 'auto',
  },
}); 