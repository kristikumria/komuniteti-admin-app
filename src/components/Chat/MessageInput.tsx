import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Platform,
  Vibration,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Text, Surface, Menu } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import chatService from '../../services/chatService';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onAttachmentSelect?: (attachment: any) => void;
  replyingTo?: {
    id: string;
    senderName: string;
    content: string;
  } | null;
  onCancelReply?: () => void;
  sending?: boolean;
  placeholder?: string;
  isDarkMode?: boolean;
  onTypingStatusChange?: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachmentSelect,
  replyingTo,
  onCancelReply,
  sending = false,
  placeholder = "Type a message...",
  isDarkMode = false,
  onTypingStatusChange
}) => {
  const [inputText, setInputText] = useState('');
  const [height, setHeight] = useState(40);
  const [attachMenuVisible, setAttachMenuVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);
  const attachIconRotation = useRef(new Animated.Value(0)).current;
  const lastTypingTime = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Rotate attachment icon when menu is opened/closed
  useEffect(() => {
    Animated.timing(attachIconRotation, {
      toValue: attachMenuVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [attachMenuVisible]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  const handleTyping = (text: string) => {
    setInputText(text);
    
    // Handle typing indicator
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      if (onTypingStatusChange) {
        onTypingStatusChange(true);
      }
    } else if (isTyping && text.length === 0) {
      setIsTyping(false);
      if (onTypingStatusChange) {
        onTypingStatusChange(false);
      }
    }
    
    // Reset the typing timeout
    if (lastTypingTime.current) {
      clearTimeout(lastTypingTime.current);
    }
    
    // Set a new timeout to stop typing indication after 2 seconds of inactivity
    if (text.length > 0) {
      lastTypingTime.current = setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          if (onTypingStatusChange) {
            onTypingStatusChange(false);
          }
        }
      }, 2000);
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    setHeight(Math.min(Math.max(40, height), 120));
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
      setHeight(40);
      
      // Stop typing indication
      setIsTyping(false);
      if (onTypingStatusChange) {
        onTypingStatusChange(false);
      }
      
      if (lastTypingTime.current) {
        clearTimeout(lastTypingTime.current);
      }
      
      // Provide haptic feedback
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Vibration.vibrate(20);
      }
    }
  };

  const toggleAttachMenu = () => {
    setAttachMenuVisible(!attachMenuVisible);
    
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Vibration.vibrate(20);
    }
    
    // Hide keyboard when opening attach menu
    if (!attachMenuVisible) {
      Keyboard.dismiss();
    }
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
    
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Vibration.vibrate(20);
    }
    
    // Hide keyboard when opening emoji picker
    if (!emojiPickerVisible) {
      Keyboard.dismiss();
    }
  };

  const handleFocus = () => {
    // Close any open menus when input is focused
    setAttachMenuVisible(false);
    setEmojiPickerVisible(false);
  };

  // Handle image picking with multiple image support
  const pickImage = async () => {
    setAttachMenuVisible(false);
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to attach images.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        try {
          // Show uploading indicator
          setIsUploading(true);
          
          // If multiple images were selected, process them all
          if (result.assets.length > 1) {
            // Process multiple images
            const uploadPromises = result.assets.map(asset => 
              chatService.uploadAttachment({
                uri: asset.uri,
                type: asset.mimeType || 'image/jpeg',
                name: asset.uri.split('/').pop() || 'image.jpg',
                size: asset.fileSize || 0,
                width: asset.width,
                height: asset.height,
              })
            );
            
            const attachments = await Promise.all(uploadPromises);
            
            if (onAttachmentSelect) {
              onAttachmentSelect({
                type: 'multiple_images',
                attachments
              });
            }
          } else {
            // Process single image
            const asset = result.assets[0];
            const attachment = await chatService.uploadAttachment({
              uri: asset.uri,
              type: asset.mimeType || 'image/jpeg',
              name: asset.uri.split('/').pop() || 'image.jpg',
              size: asset.fileSize || 0,
              width: asset.width,
              height: asset.height,
            });
            
            if (onAttachmentSelect) {
              onAttachmentSelect(attachment);
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert(
            'Upload Failed',
            'Failed to upload the image. Please try again.',
            [{ text: 'OK' }]
          );
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Failed to Attach Image',
        'There was a problem selecting the image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle document picking with improved error handling
  const pickDocument = async () => {
    setAttachMenuVisible(false);
    try {
      // Android permissions handled automatically by DocumentPicker
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'application/zip',
          'application/x-zip-compressed'
        ],
        copyToCacheDirectory: true, // Copy the file to app's cache for more reliable access
        multiple: false,
      });
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        // User cancelled or no asset selected
        return;
      }
      
      const asset = result.assets[0];
      
      // Check file size (limit to 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (asset.size && asset.size > MAX_FILE_SIZE) {
        Alert.alert(
          'File Too Large',
          'Please select a file smaller than 10MB.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      try {
        // Show uploading indicator
        setIsUploading(true);
        
        // Upload document
        const attachment = await chatService.uploadAttachment({
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name,
          size: asset.size,
        });
        
        // Provide haptic feedback on successful selection
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Vibration.vibrate(50);
        }
        
        if (onAttachmentSelect) {
          onAttachmentSelect(attachment);
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        Alert.alert(
          'Upload Failed',
          'Failed to upload the document. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        'Failed to Attach Document',
        'There was a problem selecting the document. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Add new camera capture function
  const takePhoto = async () => {
    setAttachMenuVisible(false);
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your camera to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (onAttachmentSelect) {
          const asset = result.assets[0];
          onAttachmentSelect({
            type: 'image',
            uri: asset.uri,
            name: `camera_${new Date().getTime()}.jpg`,
            size: asset.fileSize || 0,
            mimeType: 'image/jpeg',
            width: asset.width,
            height: asset.height,
          });
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        'Failed to Take Photo',
        'There was a problem capturing the photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Add location sharing function
  const shareLocation = async () => {
    setAttachMenuVisible(false);
    
    // In a real app, you would implement actual location picking
    // This is a placeholder implementation
    Alert.alert(
      'Location Sharing',
      'Location sharing is not fully implemented in this version.',
      [{ text: 'OK' }]
    );
    
    // Mock data for demonstration
    if (onAttachmentSelect) {
      onAttachmentSelect({
        type: 'location',
        latitude: 41.3275,  // Example: Tirana, Albania coordinates
        longitude: 19.8187,
        name: 'Current Location',
      });
    }
  };

  // Start voice recording
  const startRecording = () => {
    // This would use actual voice recording APIs in a real app
    setIsRecording(true);
    setRecordingDuration(0);
    
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate(100);
    }
    
    // Start recording timer
    recordingInterval.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  // Stop voice recording
  const stopRecording = () => {
    setIsRecording(false);
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate(100);
    }
    
    // This would actually save and send the voice message in a real app
    if (recordingDuration > 1 && onAttachmentSelect) {
      onAttachmentSelect({
        type: 'voice',
        duration: recordingDuration,
        name: `Voice message (${formatDuration(recordingDuration)})`,
      });
    }
    
    setRecordingDuration(0);
  };

  // Cancel voice recording
  const cancelRecording = () => {
    setIsRecording(false);
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Vibration.vibrate([0, 50, 50, 50]);
    }
    
    setRecordingDuration(0);
  };

  // Format recording duration to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Animation value for the rotation
  const rotation = attachIconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <Surface style={[
        styles.container,
        { 
          borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'
        }
      ]}>
        {replyingTo && (
          <View style={[
            styles.replyContainer,
            { borderLeftColor: '#1363DF' },
            isDarkMode ? styles.replyContainerDark : styles.replyContainerLight
          ]}>
            <View style={styles.replyContent}>
              <Text
                style={[
                  styles.replyName,
                  { color: '#1363DF' }
                ]}
                numberOfLines={1}
              >
                Replying to {replyingTo.senderName}
              </Text>
              <Text
                style={styles.replyText}
                numberOfLines={1}
              >
                {replyingTo.content}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.replyCloseButton}
              onPress={onCancelReply}
            >
              <MaterialIcons name="close" size={20} color={isDarkMode ? '#aaa' : '#666'} />
            </TouchableOpacity>
          </View>
        )}
        
        {isRecording ? (
          <View style={styles.recordingContainer}>
            <View style={styles.recordingIndicator}>
              <MaterialCommunityIcons name="microphone" size={24} color="#e74c3c" />
              <Text style={styles.recordingText}>Recording... {formatDuration(recordingDuration)}</Text>
            </View>
            <View style={styles.recordingButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelRecording}>
                <MaterialIcons name="delete" size={24} color="#e74c3c" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={stopRecording}>
                <MaterialIcons name="send" size={24} color="#1363DF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.inputRow}>
            <Menu
              visible={attachMenuVisible}
              onDismiss={() => setAttachMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={styles.attachButton}
                  onPress={toggleAttachMenu}
                >
                  <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <MaterialIcons
                      name="add"
                      size={24}
                      color="#1363DF"
                    />
                  </Animated.View>
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={pickImage}
                leadingIcon="image"
                title="Photo"
              />
              <Menu.Item
                onPress={pickDocument}
                leadingIcon="file-document"
                title="Document"
              />
              <Menu.Item
                onPress={takePhoto}
                leadingIcon="camera"
                title="Take Photo"
              />
              <Menu.Item
                onPress={shareLocation}
                leadingIcon="map-marker"
                title="Location"
              />
            </Menu>
            
            <View style={[
              styles.inputContainer,
              isDarkMode ? styles.inputContainerDark : styles.inputContainerLight
            ]}>
              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  { height: Math.max(40, height) },
                  isDarkMode ? styles.inputDark : styles.inputLight
                ]}
                placeholder={placeholder}
                placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
                value={inputText}
                onChangeText={handleTyping}
                multiline
                maxLength={1000}
                onContentSizeChange={handleContentSizeChange}
                onFocus={handleFocus}
                blurOnSubmit={false}
                autoCapitalize="sentences"
              />
              
              {!inputText.trim() ? (
                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={toggleEmojiPicker}
                >
                  <MaterialIcons
                    name="emoji-emotions"
                    size={24}
                    color="#1363DF"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            
            {inputText.trim() ? (
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: '#1363DF' },
                  isUploading && styles.sendingButton
                ]}
                onPress={handleSend}
                disabled={isUploading}
              >
                {isUploading ? (
                  <MaterialCommunityIcons name="loading" size={24} color="white" />
                ) : (
                  <MaterialIcons name="send" size={24} color="white" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.micButton,
                  { backgroundColor: '#1363DF' }
                ]}
                onPress={startRecording}
                delayLongPress={500}
              >
                <MaterialIcons name="mic" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 8,
    elevation: 4,
  },
  containerLight: {
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  containerDark: {
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  attachButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    marginRight: 8,
    paddingLeft: 16,
    paddingRight: 8,
    maxHeight: 120,
  },
  inputContainerLight: {
    backgroundColor: '#f0f0f0',
  },
  inputContainerDark: {
    backgroundColor: '#333',
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    lineHeight: 20,
  },
  inputLight: {
    color: '#212121',
  },
  inputDark: {
    color: '#f5f5f5',
  },
  emojiButton: {
    padding: 8,
    marginBottom: 4,
  },
  sendButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingButton: {
    backgroundColor: '#999',
  },
  micButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  replyContainerLight: {
    backgroundColor: '#f5f5f5',
  },
  replyContainerDark: {
    backgroundColor: '#333',
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  replyText: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  replyCloseButton: {
    padding: 4,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#e74c3c',
  },
  recordingButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 8,
    marginRight: 16,
  },
});