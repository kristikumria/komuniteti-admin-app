import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Appbar, Avatar, Badge, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { ChatConversation } from '../../navigation/types';
import { useThemedStyles } from '../../hooks/useThemedStyles';

interface ConversationHeaderProps {
  conversation: ChatConversation;
  onBackPress: () => void;
  onInfoPress?: () => void;
  showBackButton?: boolean;
  onlineIndicator?: boolean;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onBackPress,
  onInfoPress,
  showBackButton = true,
  onlineIndicator = true,
}) => {
  const { theme, commonStyles } = useThemedStyles();
  
  const renderOnlineStatus = () => {
    // For group conversations, show how many participants are online
    if (conversation.isGroup) {
      const onlineCount = conversation.participants.filter(p => p.isOnline).length;
      if (onlineCount > 0) {
        return (
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {onlineCount} {onlineCount === 1 ? 'person' : 'people'} online
          </Text>
        );
      }
      
      return (
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {conversation.participants.length} participants
        </Text>
      );
    }
    
    // For direct messages, show online/offline status of the other participant
    const otherParticipant = conversation.participants[0];
    if (otherParticipant?.isOnline) {
      return (
        <Text style={[styles.subtitle, { color: theme.colors.success }]}>
          Online
        </Text>
      );
    }
    
    return (
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        Offline
      </Text>
    );
  };

  const renderAvatar = () => {
    if (conversation.isGroup && conversation.image) {
      return (
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={40}
            source={{ uri: conversation.image }}
          />
          {onlineIndicator && conversation.participants.some(p => p.isOnline) && (
            <Badge
              size={12}
              style={[styles.onlineBadge, { backgroundColor: theme.colors.success }]}
            />
          )}
        </View>
      );
    } else if (conversation.isGroup) {
      // For group chats without an image, show first letter of the title
      return (
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={40}
            label={conversation.title.substring(0, 1).toUpperCase()}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            labelStyle={{ color: theme.colors.primary }}
          />
          {onlineIndicator && conversation.participants.some(p => p.isOnline) && (
            <Badge
              size={12}
              style={[styles.onlineBadge, { backgroundColor: theme.colors.success }]}
            />
          )}
        </View>
      );
    } else {
      // For one-on-one chats, show the participant's avatar
      const participant = conversation.participants[0];
      return (
        <View style={styles.avatarContainer}>
          {participant.image ? (
            <Avatar.Image
              size={40}
              source={{ uri: participant.image }}
            />
          ) : (
            <Avatar.Text
              size={40}
              label={participant.name.substring(0, 1).toUpperCase()}
              style={{ backgroundColor: theme.colors.primaryContainer }}
              labelStyle={{ color: theme.colors.primary }}
            />
          )}
          {onlineIndicator && participant.isOnline && (
            <Badge
              size={12}
              style={[styles.onlineBadge, { backgroundColor: theme.colors.success }]}
            />
          )}
        </View>
      );
    }
  };

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      {showBackButton && (
        <Appbar.BackAction onPress={onBackPress} />
      )}
      
      <TouchableOpacity 
        style={styles.titleContainer}
        onPress={onInfoPress}
        disabled={!onInfoPress}
      >
        {renderAvatar()}
        
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {conversation.title}
          </Text>
          
          {renderOnlineStatus()}
        </View>
      </TouchableOpacity>
      
      <Appbar.Action 
        icon="dots-vertical" 
        onPress={onInfoPress}
        style={styles.menuButton}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  menuButton: {
    marginLeft: 'auto',
  },
}); 