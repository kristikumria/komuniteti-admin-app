import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
  Vibration,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { Menu, Divider, Text, useTheme, Surface, Badge, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { format, formatDistanceToNow } from 'date-fns';
import { ChatMessage } from '../../navigation/types';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';
import { formatFileSize } from '../../utils/formatUtils';

interface MessageBubbleProps {
  message: ChatMessage & { showSenderName?: boolean };
  isFromCurrentUser: boolean;
  showAvatar: boolean;
  onReply: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
  showDate?: boolean;
  isDarkMode?: boolean;
  previousMessageSameSender?: boolean;
  nextMessageSameSender?: boolean;
  attachments?: Array<{
    id: string;
    type: string;
    url?: string;
    name?: string;
    size?: number;
    mimeType?: string;
    width?: number;
    height?: number;
    extension?: string;
    icon?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  }>;
  isFocused?: boolean;
  onFocus?: () => void;
  focusRef?: (ref: any) => void;
}

/**
 * A message bubble component for chat conversations.
 * Follows Material Design 3 guidelines with proper theming and animations.
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromCurrentUser,
  showAvatar,
  onReply,
  onDelete,
  showDate = false,
  isDarkMode = false,
  previousMessageSameSender = false,
  nextMessageSameSender = false,
  attachments,
  isFocused = false,
  onFocus,
  focusRef
}) => {
  const theme = useTheme() as AppTheme;
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const menuPosition = useRef({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const bubbleRef = useRef<any>(null);

  // Provide the ref to parent component if needed for keyboard navigation
  React.useEffect(() => {
    if (focusRef && bubbleRef.current) {
      focusRef(bubbleRef.current);
    }
  }, [focusRef]);

  // Animate focus ring effect when focused changes
  React.useEffect(() => {
    if (isFocused) {
      // Could add a focus animation here
      if (onFocus) {
        onFocus();
      }
    }
  }, [isFocused, onFocus]);

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
          return <ActivityIndicator size={12} color={theme.colors.onSurfaceVariant} />;
        case 'sent':
          return <MaterialCommunityIcons name="check" size={14} color={theme.colors.onSurfaceVariant} />;
        case 'delivered':
          return <MaterialCommunityIcons name="check-all" size={14} color={theme.colors.onSurfaceVariant} />;
        case 'read':
          return <MaterialCommunityIcons name="check-all" size={14} color={theme.colors.primary} />;
        case 'failed':
          return <MaterialCommunityIcons name="alert-circle" size={14} color={theme.colors.error} />;
        default:
          return null;
      }
    };
    
    return (
      <View style={styles(theme).statusContainer}>
        {statusIcon()}
      </View>
    );
  };

  const renderAvatar = () => {
    if (!showAvatar) return null;

    return (
      <View style={styles(theme).avatarContainer}>
        {message.senderImage ? (
          <Image source={{ uri: message.senderImage }} style={styles(theme).avatar} />
        ) : (
          <View style={[
            styles(theme).defaultAvatar,
            { backgroundColor: getAvatarColor(message.senderName) }
          ]}>
            <Text variant="labelMedium" style={styles(theme).avatarText}>
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
      theme.colors.primary,
      theme.colors.secondary, 
      theme.colors.tertiary,
      theme.colors.primaryContainer,
      theme.colors.secondaryContainer,
      theme.colors.tertiaryContainer,
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Determine if this message should have rounded corners based on message grouping
  const getBubbleStyle = () => {
    const baseStyle = isFromCurrentUser ? styles(theme).currentUserBubble : styles(theme).otherUserBubble;
    const colorStyle = isFromCurrentUser 
      ? { backgroundColor: theme.colors.primary } 
      : { backgroundColor: isDarkMode 
          ? theme.colors.surfaceVariant 
          : theme.colors.surfaceVariant };
    
    // Bubble shape based on message grouping
    let shapeStyle = {}; 
    
    if (previousMessageSameSender && nextMessageSameSender) {
      // Middle message in a sequence
      if (isFromCurrentUser) {
        shapeStyle = { 
          borderRadius: theme.roundness * 2, 
          borderTopRightRadius: theme.roundness / 2, 
          borderBottomRightRadius: theme.roundness / 2 
        };
      } else {
        shapeStyle = { 
          borderRadius: theme.roundness * 2, 
          borderTopLeftRadius: theme.roundness / 2, 
          borderBottomLeftRadius: theme.roundness / 2 
        };
      }
    } else if (previousMessageSameSender) {
      // Last message in a sequence
      if (isFromCurrentUser) {
        shapeStyle = { 
          borderRadius: theme.roundness * 2, 
          borderTopRightRadius: theme.roundness / 2 
        };
      } else {
        shapeStyle = { 
          borderRadius: theme.roundness * 2, 
          borderTopLeftRadius: theme.roundness / 2 
        };
      }
    } else if (nextMessageSameSender) {
      // First message in a sequence
      if (isFromCurrentUser) {
        shapeStyle = { 
          borderRadius: theme.roundness * 2, 
          borderBottomRightRadius: theme.roundness / 2 
        };
      } else {
        shapeStyle = { 
          borderRadius: theme.roundness * 2, 
          borderBottomLeftRadius: theme.roundness / 2 
        };
      }
    }
    
    return [baseStyle, colorStyle, shapeStyle];
  };

  const renderMessageContent = () => {
    return (
      <View style={styles(theme).contentContainer}>
        {message.replyTo && renderReplyLine()}
        <Text 
          variant="bodyMedium"
          style={{ 
            color: isFromCurrentUser 
              ? theme.colors.onPrimary 
              : theme.colors.onSurfaceVariant 
          }}
        >
          {message.content}
        </Text>
      </View>
    );
  };

  const renderReplyLine = () => {
    if (!message.replyTo) return null;
    
    const replyTextColor = isFromCurrentUser 
      ? theme.colors.onPrimary + '99'  // With opacity
      : theme.colors.onSurfaceVariant + '99';  // With opacity
    
    return (
      <View style={styles(theme).replyContainer}>
        <View style={[
          styles(theme).replyLine, 
          { backgroundColor: replyTextColor }
        ]} />
        <View style={styles(theme).replyContent}>
          <Text 
            variant="labelMedium"
            style={{ color: replyTextColor }}
            numberOfLines={1}
          >
            {message.replyTo.senderName}
          </Text>
          <Text 
            variant="bodySmall"
            style={{ color: replyTextColor }}
            numberOfLines={1}
          >
            {message.replyTo.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessageDate = () => {
    if (!showDate) return null;
    
    return (
      <View style={styles(theme).dateContainer}>
        <Text 
          variant="labelSmall"
          style={styles(theme).dateText}
        >
          {formatDate(message.timestamp)}
        </Text>
      </View>
    );
  };

  const renderMessageTime = () => {
    return (
      <View style={styles(theme).timeContainer}>
        <Text 
          variant="labelSmall"
          style={{ 
            color: isFromCurrentUser 
              ? theme.colors.onPrimary + 'CC'  // With opacity
              : theme.colors.onSurfaceVariant + 'CC'  // With opacity
          }}
        >
          {formatTime(message.timestamp)}
        </Text>
        {renderStatus()}
      </View>
    );
  };

  // Render image attachments
  const renderImageAttachments = () => {
    const imageAttachments = attachments?.filter(att => att.type === 'image') || [];
    
    if (imageAttachments.length === 0) return null;
    
    // Handle multiple images differently
    if (imageAttachments.length > 1) {
      return (
        <View style={styles(theme).imageGrid}>
          {imageAttachments.map((attachment, index) => (
            <TouchableOpacity 
              key={attachment.id || index}
              style={styles(theme).gridImageContainer}
              onPress={() => setExpandedImage(attachment.url || null)}
            >
              <Image 
                source={{ uri: attachment.url }}
                style={styles(theme).gridImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    
    // Single image
    const attachment = imageAttachments[0];
    return (
      <TouchableOpacity 
        style={styles(theme).imageContainer}
        onPress={() => setExpandedImage(attachment.url || null)}
      >
        <Image 
          source={{ uri: attachment.url }}
          style={[
            styles(theme).image,
            // Use any to access potentially non-standard props
            (attachment as any).width && (attachment as any).height ? {
              aspectRatio: (attachment as any).width / (attachment as any).height
            } : undefined
          ]}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        {imageError && (
          <View style={styles(theme).imageErrorContainer}>
            <MaterialIcons name="broken-image" size={24} color={theme.colors.error} />
            <Text style={styles(theme).imageErrorText}>Failed to load image</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  // Render document attachments
  const renderDocumentAttachments = () => {
    const documentAttachments = attachments?.filter(att => att.type === 'document') || [];
    
    if (documentAttachments.length === 0) return null;
    
    return (
      <View style={styles(theme).documentsContainer}>
        {documentAttachments.map((doc, index) => (
          <TouchableOpacity 
            key={doc.id || index}
            style={[
              styles(theme).documentItem,
              { backgroundColor: isFromCurrentUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant }
            ]}
            onPress={() => {
              if (doc.url) {
                Linking.openURL(doc.url).catch(() => {
                  Alert.alert(
                    'Cannot Open File',
                    'The file could not be opened.',
                    [{ text: 'OK' }]
                  );
                });
              }
            }}
          >
            <View style={styles(theme).documentIconContainer}>
              <MaterialIcons 
                name={(doc as any).icon || 'description'} 
                size={24} 
                color={isFromCurrentUser ? theme.colors.onPrimary : theme.colors.primary} 
              />
            </View>
            <View style={styles(theme).documentInfo}>
              <Text 
                style={[styles(theme).documentName, { color: isFromCurrentUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {doc.name || `Document.${(doc as any).extension || 'file'}`}
              </Text>
              {doc.size && (
                <Text style={[styles(theme).documentSize, { color: isFromCurrentUser ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                  {formatFileSize(doc.size)}
                </Text>
              )}
            </View>
            <MaterialIcons 
              name="download" 
              size={20} 
              color={isFromCurrentUser ? theme.colors.onPrimary : theme.colors.primary} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render location attachments
  const renderLocationAttachments = () => {
    const locationAttachments = attachments?.filter(att => att.type === 'location') || [];
    
    if (locationAttachments.length === 0) return null;
    
    return (
      <View style={styles(theme).locationsContainer}>
        {locationAttachments.map((location, index) => {
          if (location.latitude === undefined || location.longitude === undefined) {
            return null;
          }
          
          return (
            <TouchableOpacity 
              key={location.id || index}
              style={styles(theme).locationItem}
              onPress={() => {
                Alert.alert(
                  'Open Map',
                  'Would you like to view this location in Maps?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Open', 
                      onPress: () => {
                        const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
                        Linking.openURL(url);
                      }
                    }
                  ]
                );
              }}
            >
              <View style={styles(theme).locationIconContainer}>
                <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles(theme).locationInfo}>
                <Text 
                  style={styles(theme).locationName}
                  numberOfLines={2}
                >
                  {location.name || 'Shared Location'}
                </Text>
                {location.address && (
                  <Text 
                    style={styles(theme).locationAddress}
                    numberOfLines={1}
                  >
                    {location.address}
                  </Text>
                )}
              </View>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Generate accessibility label for screen readers
  const getAccessibilityLabel = () => {
    const sender = isFromCurrentUser ? 'You' : message.senderName;
    const time = formatTime(message.timestamp);
    const date = formatDate(message.timestamp);
    const status = isFromCurrentUser ? `Status: ${message.status || 'sent'}` : '';
    
    let label = `Message from ${sender} at ${time} on ${date}. ${status}`;
    
    if (message.content) {
      label += ` Message: ${message.content}`;
    }
    
    if (message.attachments && message.attachments.length > 0) {
      const attachmentTypes = message.attachments.map(a => a.type).join(', ');
      label += ` Contains ${message.attachments.length} attachments: ${attachmentTypes}`;
    }
    
    return label;
  };
  
  // Generate accessibility hint for screen readers
  const getAccessibilityHint = () => {
    if (isFromCurrentUser) {
      return 'Double tap to open options. Long press to edit or delete.';
    } else {
      return 'Double tap to reply. Long press to see options.';
    }
  };

  return (
    <View>
      {showDate && renderMessageDate()}
      
      <Animated.View
        style={[
          styles(theme).messageRow,
          isFromCurrentUser ? styles(theme).currentUserRow : styles(theme).otherUserRow,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {!isFromCurrentUser && renderAvatar()}
        
        <Pressable
          ref={bubbleRef}
          onLongPress={openMenu}
          onPress={() => {
            // Simple press handles the "primary action" for keyboard users
            if (message.status === 'failed') {
              // For failed messages, primary action would be to retry
              Alert.alert('Retry sending message?');
            } else {
              // For regular messages, primary action is reply
              onReply(message);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={getAccessibilityLabel()}
          accessibilityHint={getAccessibilityHint()}
          accessibilityState={{ 
            selected: isFocused,
            disabled: false
          }}
          style={({ pressed }) => [
            getBubbleStyle(),
            pressed && { opacity: 0.9 },
            isFocused && styles(theme).focusedBubble
          ]}
        >
          {message.showSenderName && !isFromCurrentUser && (
            <Text style={styles(theme).senderName}>
              {message.senderName}
            </Text>
          )}
          
          {message.replyTo && renderReplyLine()}
          
          {message.content && renderMessageContent()}
          
          {message.attachments && renderImageAttachments()}
          
          {message.attachments && renderDocumentAttachments()}

          {message.attachments && renderLocationAttachments()}
          
          <View style={styles(theme).timeContainer}>
            {renderMessageTime()}
            {renderStatus()}
          </View>
        </Pressable>
      </Animated.View>
      
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={{ x: menuPosition.current.x, y: menuPosition.current.y }}
        contentStyle={styles(theme).menuContent}
      >
        <Menu.Item
          leadingIcon="reply"
          onPress={handleReply}
          title="Reply"
          titleStyle={styles(theme).menuItemText}
          style={styles(theme).menuItem}
        />
        {isFromCurrentUser && (
          <Menu.Item
            leadingIcon="delete-outline"
            onPress={handleDelete}
            title="Delete"
            titleStyle={[styles(theme).menuItemText, { color: theme.colors.error }]}
            style={styles(theme).menuItem}
          />
        )}
        <Menu.Item
          leadingIcon="content-copy"
          onPress={() => {
            closeMenu();
            // Copy text to clipboard
          }}
          title="Copy Text"
          titleStyle={styles(theme).menuItemText}
          style={styles(theme).menuItem}
        />
      </Menu>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: theme.spacing.xs / 2,
    marginHorizontal: theme.spacing.s,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  currentUserBubble: {
    padding: theme.spacing.s,
    maxWidth: '80%',
    borderRadius: theme.roundness * 2,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: ElevationLevel.Level1,
      },
    }),
  },
  otherUserBubble: {
    padding: theme.spacing.s,
    maxWidth: '80%',
    borderRadius: theme.roundness * 2,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: ElevationLevel.Level1,
      },
    }),
  },
  contentContainer: {
    marginBottom: theme.spacing.xs,
  },
  avatarContainer: {
    marginRight: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  defaultAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
  },
  senderName: {
    marginBottom: theme.spacing.xs,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  statusContainer: {
    marginLeft: theme.spacing.xs,
  },
  menu: {
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: ElevationLevel.Level2,
      },
    }),
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.s,
  },
  dateText: {
    color: theme.colors.onSurfaceVariant,
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  replyLine: {
    width: 2,
    marginRight: theme.spacing.xs,
    borderRadius: 1,
  },
  replyContent: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    minHeight: 150,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  imageErrorText: {
    color: 'white',
    marginTop: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  gridImageContainer: {
    width: '49%',
    aspectRatio: 1,
    margin: '0.5%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surfaceVariant,
  },
  documentsContainer: {
    marginBottom: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  documentIconContainer: {
    marginRight: 8,
  },
  documentInfo: {
    flex: 1,
    marginRight: 8,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
  },
  documentSize: {
    fontSize: 12,
    marginTop: 2,
  },
  locationsContainer: {
    marginBottom: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: theme.colors.surface,
  },
  locationIconContainer: {
    marginRight: 8,
  },
  locationInfo: {
    flex: 1,
    marginRight: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  locationAddress: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 0, 
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 0,
  },
  focusedBubble: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: theme.spacing.xs / 2,
    marginHorizontal: theme.spacing.s,
  },
  currentUserRow: {
    justifyContent: 'flex-end',
  },
  otherUserRow: {
    justifyContent: 'flex-start',
  },
  menuContent: {
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: ElevationLevel.Level2,
      },
    }),
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuItem: {
    padding: theme.spacing.s,
  },
});