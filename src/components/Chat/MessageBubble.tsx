import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
  Vibration,
  Pressable
} from 'react-native';
import { Menu, Divider, useTheme } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ChatMessage } from '../../navigation/types';

interface MessageBubbleProps {
  message: ChatMessage;
  isFromCurrentUser: boolean;
  showAvatar: boolean;
  onReply: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
  showDate?: boolean;
  isDarkMode?: boolean;
  previousMessageSameSender?: boolean;
  nextMessageSameSender?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromCurrentUser,
  showAvatar,
  onReply,
  onDelete,
  showDate = false,
  isDarkMode = false,
  previousMessageSameSender = false,
  nextMessageSameSender = false
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const menuPosition = useRef({ x: 0, y: 0 });

  // Animate when the component mounts
  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [scaleAnim]);

  const openMenu = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(25);
    }
    setMenuVisible(true);
  };

  const closeMenu = () => setMenuVisible(false);

  const handleReply = () => {
    closeMenu();
    onReply(message);
  };

  const handleDelete = () => {
    closeMenu();
    onDelete(message.id);
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch (e) {
      return '??:??';
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const messageDate = new Date(timestamp);
      const today = new Date();
      
      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      return format(messageDate, 'MMMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  const renderStatus = () => {
    if (!isFromCurrentUser) return null;
    
    const statusIcon = () => {
      switch (message.status) {
        case 'sending':
          return <MaterialCommunityIcons name="clock-outline" size={14} color="#999" />;
        case 'sent':
          return <MaterialCommunityIcons name="check" size={14} color="#999" />;
        case 'delivered':
          return <MaterialCommunityIcons name="check-all" size={14} color="#999" />;
        case 'read':
          return <MaterialCommunityIcons name="check-all" size={14} color={theme.colors.primary} />;
        case 'failed':
          return <MaterialCommunityIcons name="alert-circle" size={14} color="#f44336" />;
        default:
          return null;
      }
    };
    
    return (
      <View style={styles.statusContainer}>
        {statusIcon()}
      </View>
    );
  };

  const renderAvatar = () => {
    if (!showAvatar) return null;

    return (
      <View style={styles.avatarContainer}>
        {message.senderImage ? (
          <Image source={{ uri: message.senderImage }} style={styles.avatar} />
        ) : (
          <View style={[
            styles.defaultAvatar,
            { backgroundColor: getAvatarColor(message.senderName) }
          ]}>
            <Text style={styles.avatarText}>
              {message.senderName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Get a consistent color based on sender name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#E57373', '#F06292', '#BA68C8', '#9575CD', 
      '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1',
      '#4DB6AC', '#81C784', '#AED581', '#DCE775'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Determine if this message should have rounded corners based on message grouping
  const getBubbleStyle = () => {
    const baseStyle = isFromCurrentUser ? styles.currentUserBubble : styles.otherUserBubble;
    const colorStyle = isFromCurrentUser 
      ? { backgroundColor: theme.colors.primary } 
      : { backgroundColor: isDarkMode ? '#333' : '#E8E8E8' };
    
    // Bubble shape based on message grouping
    let shapeStyle = {}; 
    
    if (previousMessageSameSender && nextMessageSameSender) {
      // Middle message in a sequence
      if (isFromCurrentUser) {
        shapeStyle = { borderRadius: 16, borderTopRightRadius: 4, borderBottomRightRadius: 4 };
      } else {
        shapeStyle = { borderRadius: 16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 };
      }
    } else if (previousMessageSameSender) {
      // Last message in a sequence
      if (isFromCurrentUser) {
        shapeStyle = { borderRadius: 16, borderTopRightRadius: 4 };
      } else {
        shapeStyle = { borderRadius: 16, borderTopLeftRadius: 4 };
      }
    } else if (nextMessageSameSender) {
      // First message in a sequence
      if (isFromCurrentUser) {
        shapeStyle = { borderRadius: 16, borderBottomRightRadius: 4 };
      } else {
        shapeStyle = { borderRadius: 16, borderBottomLeftRadius: 4 };
      }
    }
    
    return [baseStyle, colorStyle, shapeStyle];
  };

  // Render reply line with the themed color
  const renderReplyLine = () => {
    return (
      <View style={[styles.replyLine, { backgroundColor: theme.colors.primary }]} />
    );
  };

  return (
    <View>
      {showDate && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(message.timestamp)}</Text>
        </View>
      )}
      
      <View
        style={[
          styles.container,
          isFromCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
        ]}
      >
        {!isFromCurrentUser && renderAvatar()}

        <View style={{ flex: showAvatar ? 0.9 : 1 }}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Pressable
                onLongPress={openMenu}
                delayLongPress={200}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <View>
                    {!isFromCurrentUser && !previousMessageSameSender && (
                      <Text style={[
                        styles.senderName,
                        { color: getAvatarColor(message.senderName) }
                      ]}>
                        {message.senderName}
                      </Text>
                    )}
                    
                    {message.replyTo && (
                      <View style={[
                        styles.replyContainer,
                        { 
                          backgroundColor: isFromCurrentUser 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                        }
                      ]}>
                        {renderReplyLine()}
                        <View style={styles.replyContent}>
                          <Text style={[
                            styles.replyName,
                            { 
                              color: isFromCurrentUser 
                                ? '#fff' 
                                : (isDarkMode ? '#fff' : '#333')
                            }
                          ]}>
                            {message.replyTo.senderName}
                          </Text>
                          <Text style={[
                            styles.replyText,
                            { 
                              color: isFromCurrentUser 
                                ? 'rgba(255, 255, 255, 0.8)' 
                                : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)')
                            }
                          ]} numberOfLines={1}>
                            {message.replyTo.content}
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    <View style={getBubbleStyle()}>
                      <Text style={[
                        styles.messageText,
                        { color: isFromCurrentUser ? '#ffffff' : (isDarkMode ? '#ffffff' : '#212121') }
                      ]}>
                        {message.content}
                      </Text>
                    </View>
                    
                    <View style={styles.messageFooter}>
                      <Text style={[
                        styles.timeText,
                        { color: isDarkMode ? '#aaaaaa' : '#757575' }
                      ]}>
                        {formatTime(message.timestamp)}
                      </Text>
                      {renderStatus()}
                    </View>
                  </View>
                </Animated.View>
              </Pressable>
            }
          >
            <Menu.Item
              onPress={handleReply}
              title="Reply"
              leadingIcon="reply"
              titleStyle={styles.menuItem}
              contentStyle={styles.menuContent}
            />
            {isFromCurrentUser && (
              <>
                <Divider />
                <Menu.Item
                  onPress={handleDelete}
                  title="Delete"
                  leadingIcon="delete"
                  titleStyle={[styles.menuItem, { color: '#f44336' }]}
                  contentStyle={styles.menuContent}
                />
              </>
            )}
          </Menu>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
    marginLeft: 60,
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
    marginRight: 60,
  },
  currentUserBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '100%',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  otherUserBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '100%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 16,
  },
  timeText: {
    fontSize: 11,
    marginRight: 2,
  },
  statusContainer: {
    marginLeft: 4,
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e1e1e1',
  },
  defaultAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9e9e9e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 4,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    padding: 8,
    borderRadius: 12,
    borderTopLeftRadius: 4,
    maxWidth: '95%',
  },
  replyLine: {
    width: 2,
    height: '100%',
    marginRight: 8,
    borderRadius: 1,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  replyText: {
    fontSize: 12,
    marginTop: 2,
  },
  menuItem: {
    fontSize: 14,
  },
  menuContent: {
    maxWidth: 200,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
});