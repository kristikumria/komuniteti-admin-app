import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { 
  Searchbar, 
  Divider, 
  Checkbox, 
  Button, 
  Avatar,
  useTheme, 
  Chip,
  Surface
} from 'react-native-paper';
import { Header } from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { ChatParticipant } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ElevationLevel } from '../../../theme';

// Mock user data for demonstration - in production, this would be moved to mockData.ts
const MOCK_USERS: ChatParticipant[] = [
  {
    id: '101',
    name: 'Arben Hoxha',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isOnline: true,
  },
  {
    id: '102',
    name: 'Sara Mati',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    isOnline: false,
    lastSeen: '2023-05-15T14:30:00Z',
  },
  {
    id: '103',
    name: 'Elton Zholi',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    isOnline: false,
    lastSeen: '2023-05-15T10:15:00Z',
  },
  {
    id: '104',
    name: 'Drita Koka',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    isOnline: true,
  },
  {
    id: '105',
    name: 'Gezim Basha',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    isOnline: false,
    lastSeen: '2023-05-14T18:20:00Z',
  },
  {
    id: '106',
    name: 'Teuta Leka',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    isOnline: true,
  },
  {
    id: '107',
    name: 'Dritan Mema',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    isOnline: true,
  },
  {
    id: '108',
    name: 'Liri Berisha',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    isOnline: true,
  },
  {
    id: '109',
    name: 'Klajdi Prendi',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/men/91.jpg',
    isOnline: false,
  },
  {
    id: '110',
    name: 'Anjeza Kuka',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/women/85.jpg',
    isOnline: true,
  },
];

// Export the props interface
export interface NewConversationScreenProps {
  onConversationCreated?: (conversationId: string) => void;
  onCancel?: () => void;
  userRole?: 'administrator' | 'business-manager';
}

/**
 * Screen for creating a new conversation
 * Allows selecting users and creating either 1:1 or group chats
 */
const NewConversationScreen: React.FC<NewConversationScreenProps> = ({
  onConversationCreated,
  onCancel,
  userRole = 'administrator',
}) => {
  const { theme, commonStyles } = useThemedStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAppSelector(state => state.auth.user);
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<ChatParticipant[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ChatParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  
  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would come from an API
        setFilteredUsers(MOCK_USERS);
      } catch (error) {
        console.error('Error loading users', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(MOCK_USERS);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = MOCK_USERS.filter(
      user => user.name.toLowerCase().includes(query) ||
              user.role.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery]);
  
  // Handle user selection
  const toggleUserSelection = (user: ChatParticipant) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  // Remove a selected user
  const removeSelectedUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };
  
  // Create the conversation
  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setCreatingConversation(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a conversation ID (in a real app, this would come from the backend)
      const newConversationId = `new_${Date.now()}`;
      
      // Navigate to the new conversation
      if (onConversationCreated) {
        onConversationCreated(newConversationId);
      } else {
        // @ts-ignore
        navigation.replace('ChatConversation', { conversationId: newConversationId });
      }
    } catch (error) {
      console.error('Error creating conversation', error);
    } finally {
      setCreatingConversation(false);
    }
  };
  
  // Handle back navigation
  const handleGoBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigation.goBack();
    }
  };
  
  // Render a user item
  const renderUserItem = ({ item }: { item: ChatParticipant }) => {
    const isSelected = selectedUsers.some(u => u.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          { backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surface }
        ]}
        onPress={() => toggleUserSelection(item)}
      >
        <View style={styles.userInfo}>
          {item.image ? (
            <Avatar.Image size={40} source={{ uri: item.image }} />
          ) : (
            <Avatar.Text size={40} label={item.name.substring(0, 1)} />
          )}
          
          <View style={styles.userDetails}>
            <Text style={[
              styles.userName, 
              { 
                color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                fontWeight: isSelected ? '700' : '500'
              }
            ]}>
              {item.name}
            </Text>
            <Text style={[styles.userRole, { color: theme.colors.onSurfaceVariant }]}>
              {item.role === 'admin' ? 'Administrator' : 'Resident'}
            </Text>
          </View>
        </View>
        
        <Checkbox
          status={isSelected ? 'checked' : 'unchecked'}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    );
  };
  
  // Render selected user chips
  const renderSelectedUsers = () => {
    if (selectedUsers.length === 0) return null;
    
    return (
      <Surface
        style={styles.selectedUsersContainer}
        elevation={ElevationLevel.Level1}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          {isGroup ? 'Group Members' : 'Recipients'}
        </Text>
        
        <View style={styles.chipContainer}>
          {selectedUsers.map(user => (
            <Chip
              key={user.id}
              mode="outlined"
              onClose={() => removeSelectedUser(user.id)}
              style={styles.chip}
              textStyle={{ color: theme.colors.onSurface }}
            >
              {user.name}
            </Chip>
          ))}
        </View>
      </Surface>
    );
  };
  
  // Render group settings
  const renderGroupSettings = () => {
    // Only show for multiple selections
    if (selectedUsers.length <= 1) return null;
    
    return (
      <Surface 
        style={styles.groupSettingsContainer}
        elevation={ElevationLevel.Level1}
      >
        <View style={styles.groupTypeRow}>
          <Text style={[styles.groupTypeText, { color: theme.colors.onSurface }]}>
            Create as group conversation
          </Text>
          <Checkbox
            status={isGroup ? 'checked' : 'unchecked'}
            onPress={() => setIsGroup(!isGroup)}
            color={theme.colors.primary}
          />
        </View>
        
        {isGroup && (
          <Searchbar
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
            style={[styles.groupNameInput, { backgroundColor: theme.colors.surfaceVariant }]}
            inputStyle={{ color: theme.colors.onSurface }}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        )}
      </Surface>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.dark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.surface}
        translucent={false}
      />
      
      <Header
        title="New Conversation"
        showBackButton={true}
        onBackPress={handleGoBack}
      />
      
      <View style={styles.content}>
        <Searchbar
          placeholder="Search people"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        
        {renderSelectedUsers()}
        {renderGroupSettings()}
        
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id}
            renderItem={renderUserItem}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No users found matching your search
                </Text>
              </View>
            )}
          />
        )}
      </View>
      
      <Surface 
        style={[styles.buttonContainer, { backgroundColor: theme.colors.surface }]}
        elevation={ElevationLevel.Level2}
      >
        <Button
          mode="contained"
          onPress={handleCreateConversation}
          loading={creatingConversation}
          disabled={selectedUsers.length === 0 || creatingConversation}
          style={styles.createButton}
        >
          {selectedUsers.length === 1 ? 'Start Conversation' : 'Create Group'}
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedUsersContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  groupSettingsContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  groupTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  groupTypeText: {
    fontSize: 16,
  },
  groupNameInput: {
    elevation: 0,
    borderRadius: 8,
    marginTop: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userRole: {
    fontSize: 14,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  createButton: {
    borderRadius: 8,
  },
  loader: {
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

export default NewConversationScreen; 