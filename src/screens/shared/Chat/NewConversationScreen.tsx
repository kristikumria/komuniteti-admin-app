import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  StatusBar
} from 'react-native';
import { Appbar, Checkbox, Chip, Divider, FAB, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useAppSelector } from '../../../store/hooks';

// Mock data for user selection
const MOCK_USERS = [
  {
    id: '101',
    name: 'Arben Hoxha',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    department: 'Administration',
    email: 'arben.hoxha@example.com'
  },
  {
    id: '102',
    name: 'Sara Mati',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    department: 'Administration',
    email: 'sara.mati@example.com'
  },
  {
    id: '103',
    name: 'Elton Zholi',
    role: 'manager',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    department: 'Building B',
    email: 'elton.zholi@example.com'
  },
  {
    id: '104',
    name: 'Drita Koka',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    department: 'Building B',
    email: 'drita.koka@example.com'
  },
  {
    id: '105',
    name: 'Gezim Basha',
    role: 'manager',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    department: 'Maintenance',
    email: 'gezim.basha@example.com'
  },
  {
    id: '106',
    name: 'Teuta Leka',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    department: 'Maintenance',
    email: 'teuta.leka@example.com'
  },
  {
    id: '107',
    name: 'Dritan Mema',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    department: 'Building A',
    email: 'dritan.mema@example.com',
    apartment: 'A-201'
  },
  {
    id: '108',
    name: 'Liri Berisha',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    department: 'Building C',
    email: 'liri.berisha@example.com',
    apartment: 'C-101'
  },
  {
    id: '109',
    name: 'Altin Krasniqi',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/men/78.jpg',
    department: 'Building A',
    email: 'altin.krasniqi@example.com',
    apartment: 'A-305'
  },
  {
    id: '110',
    name: 'Mirela Hasa',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    department: 'Building B',
    email: 'mirela.hasa@example.com',
    apartment: 'B-102'
  }
];

// Export the props interface
export interface NewConversationScreenProps {
  userRole?: 'administrator' | 'business-manager';
  onConversationCreated?: (conversationId: string) => void;
}

const NewConversationScreen: React.FC<NewConversationScreenProps> = ({ 
  userRole = 'administrator',
  onConversationCreated
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings?.darkMode) || false;
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // State for user selection and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<typeof MOCK_USERS[0][]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'name'>('select');
  
  // Filter users based on search query and selected users
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(MOCK_USERS.filter(user => 
        !selectedUsers.some(selected => selected.id === user.id) &&
        // Filter out current user
        user.id !== currentUser?.id
      ));
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = MOCK_USERS.filter(
        user => 
          (user.name.toLowerCase().includes(query) || 
           user.email.toLowerCase().includes(query) ||
           user.department.toLowerCase().includes(query)) &&
          !selectedUsers.some(selected => selected.id === user.id) &&
          user.id !== currentUser?.id
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, selectedUsers, currentUser]);
  
  const handleSelectUser = useCallback((user: typeof MOCK_USERS[0]) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchQuery('');
  }, []);
  
  const handleRemoveUser = useCallback((userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  }, []);
  
  const handleCreateConversation = useCallback(() => {
    if (selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user to chat with');
      return;
    }
    
    if (isGroup && !groupName.trim()) {
      Alert.alert('Error', 'Please enter a name for the group chat');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to create conversation
    setTimeout(() => {
      setLoading(false);
      
      // Generate a mock conversation ID
      const newConversationId = `conv-${Math.floor(Math.random() * 10000)}`;
      
      // Navigate to the new conversation
      if (onConversationCreated) {
        onConversationCreated(newConversationId);
      } else {
        // For backward compatibility, navigate directly
        navigation.navigate('ChatConversation', { conversationId: newConversationId });
      }
    }, 1500);
  }, [selectedUsers, isGroup, groupName, navigation, onConversationCreated]);
  
  const handleBack = useCallback(() => {
    if (step === 'name') {
      setStep('select');
    } else {
      navigation.goBack();
    }
  }, [step, navigation]);
  
  const handleNext = useCallback(() => {
    if (selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user to chat with');
      return;
    }
    
    if (selectedUsers.length === 1) {
      // For one-on-one chat, create directly
      handleCreateConversation();
    } else {
      // For multiple users, ask for group name
      setIsGroup(true);
      setStep('name');
    }
  }, [selectedUsers, handleCreateConversation]);
  
  const renderUserItem = useCallback(({ item }: { item: typeof MOCK_USERS[0] }) => (
    <TouchableOpacity
      style={[
        styles.userItem, 
        isDarkMode && styles.userItemDark
      ]}
      onPress={() => handleSelectUser(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userAvatar}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        ) : (
          <View style={[
            styles.defaultAvatar, 
            { backgroundColor: theme.colors.primary }
          ]}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.userName,
          isDarkMode && styles.textDark
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.userRole,
          isDarkMode && styles.textLightDark
        ]}>
          {item.role === 'resident' 
            ? `Resident (${item.apartment})` 
            : `${item.role.charAt(0).toUpperCase() + item.role.slice(1)} (${item.department})`}
        </Text>
      </View>
    </TouchableOpacity>
  ), [handleSelectUser, isDarkMode, theme.colors.primary]);
  
  const renderSelectScreen = () => (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            isDarkMode && styles.searchInputDark
          ]}
          placeholder="Search users..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery ? (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => setSearchQuery('')}
          >
            <MaterialIcons 
              name="clear" 
              size={20} 
              color={isDarkMode ? '#aaa' : '#999'} 
            />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <Text style={[
            styles.sectionTitle,
            isDarkMode && styles.textDark
          ]}>
            Selected {selectedUsers.length > 1 ? `users (${selectedUsers.length})` : 'user'}:
          </Text>
          
          <View style={styles.chipsContainer}>
            {selectedUsers.map(user => (
              <Chip
                key={user.id}
                style={[
                  styles.userChip,
                  isDarkMode && styles.userChipDark
                ]}
                textStyle={isDarkMode ? styles.textDark : undefined}
                onClose={() => handleRemoveUser(user.id)}
                avatar={
                  user.image ? (
                    <Image source={{ uri: user.image }} style={styles.chipAvatar} />
                  ) : undefined
                }
              >
                {user.name}
              </Chip>
            ))}
          </View>
          
          {selectedUsers.length > 1 && (
            <View style={styles.groupOptionContainer}>
              <Checkbox
                status={isGroup ? 'checked' : 'unchecked'}
                onPress={() => setIsGroup(!isGroup)}
                color={theme.colors.primary}
              />
              <Text 
                style={[
                  styles.groupOptionText,
                  isDarkMode && styles.textDark
                ]}
                onPress={() => setIsGroup(!isGroup)}
              >
                Create as group chat
              </Text>
            </View>
          )}
        </View>
      )}
      
      <Divider style={isDarkMode ? styles.dividerDark : undefined} />
      
      <Text style={[
        styles.sectionTitle,
        styles.usersListTitle,
        isDarkMode && styles.textDark
      ]}>
        {filteredUsers.length > 0 
          ? 'Select users to chat with:' 
          : searchQuery 
            ? 'No matching users found' 
            : 'All users have been selected'}
      </Text>
      
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Divider style={isDarkMode ? styles.dividerDark : undefined} />
        )}
        contentContainerStyle={[
          styles.userList,
          !filteredUsers.length && styles.emptyList
        ]}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons 
                name="search-off" 
                size={48} 
                color={isDarkMode ? '#555' : '#ccc'} 
              />
              <Text style={[
                styles.emptyText,
                isDarkMode && styles.textDark
              ]}>
                No users match your search
              </Text>
              <Text style={[
                styles.emptySubText,
                isDarkMode && styles.textLightDark
              ]}>
                Try a different search term
              </Text>
            </View>
          ) : selectedUsers.length > 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons 
                name="check-circle" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Text style={[
                styles.emptyText,
                isDarkMode && styles.textDark
              ]}>
                All users have been selected
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons 
                name="person-search" 
                size={48} 
                color={isDarkMode ? '#555' : '#ccc'} 
              />
              <Text style={[
                styles.emptyText,
                isDarkMode && styles.textDark
              ]}>
                No users available
              </Text>
            </View>
          )
        }
      />
      
      {selectedUsers.length > 0 && (
        <View style={[
          styles.bottomButtonContainer,
          { paddingBottom: Math.max(insets.bottom, 16) }
        ]}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {selectedUsers.length === 1 ? 'Start Chat' : 'Next'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
  
  const renderNameScreen = () => (
    <View style={styles.groupNameContainer}>
      <Text style={[
        styles.groupNameTitle,
        isDarkMode && styles.textDark
      ]}>
        Name your group chat
      </Text>
      
      <Text style={[
        styles.groupNameSubtitle,
        isDarkMode && styles.textLightDark
      ]}>
        Give your group a name that participants will recognize
      </Text>
      
      <View style={[
        styles.groupAvatarContainer,
        { backgroundColor: theme.colors.primary }
      ]}>
        <MaterialIcons name="group" size={48} color="#fff" />
      </View>
      
      <TextInput
        style={[
          styles.groupNameInput,
          isDarkMode && styles.groupNameInputDark
        ]}
        placeholder="Enter group name"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={groupName}
        onChangeText={setGroupName}
        autoFocus
      />
      
      <View style={styles.groupParticipantsContainer}>
        <Text style={[
          styles.participantsTitle,
          isDarkMode && styles.textDark
        ]}>
          Participants ({selectedUsers.length})
        </Text>
        
        <View style={styles.participantsList}>
          {selectedUsers.map(user => (
            <View key={user.id} style={styles.participantItem}>
              {user.image ? (
                <Image source={{ uri: user.image }} style={styles.participantAvatar} />
              ) : (
                <View style={[
                  styles.defaultParticipantAvatar,
                  { backgroundColor: theme.colors.primary }
                ]}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text 
                style={[
                  styles.participantName,
                  isDarkMode && styles.textDark
                ]}
                numberOfLines={1}
              >
                {user.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={[
        styles.bottomButtonContainer,
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}>
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={handleCreateConversation}
          disabled={!groupName.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.createButtonText}>
                Create Group Chat
              </Text>
              <MaterialIcons name="done" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <KeyboardAvoidingView 
      style={[
        styles.container,
        isDarkMode && styles.containerDark
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'} 
      />
      
      <Appbar.Header 
        style={[
          styles.header,
          isDarkMode && styles.headerDark
        ]}
        statusBarHeight={insets.top}
      >
        <Appbar.BackAction 
          onPress={handleBack} 
          color={isDarkMode ? '#FFFFFF' : '#000000'} 
        />
        <Appbar.Content 
          title={step === 'select' 
            ? 'New Conversation' 
            : 'Create Group'
          } 
          titleStyle={[
            styles.headerTitle,
            isDarkMode && styles.headerTitleDark
          ]} 
        />
      </Appbar.Header>
      
      {step === 'select' 
        ? renderSelectScreen() 
        : renderNameScreen()
      }
      
      {loading && step === 'select' && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[
            styles.loadingText,
            isDarkMode && styles.textDark
          ]}>
            Creating conversation...
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 1,
  },
  headerDark: {
    backgroundColor: '#121212',
    borderBottomColor: '#333',
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerTitleDark: {
    color: '#fff',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    position: 'relative',
  },
  searchInput: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  searchInputDark: {
    backgroundColor: '#2a2a2a',
    color: '#f0f0f0',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  selectedUsersContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textDark: {
    color: '#f0f0f0',
  },
  textLightDark: {
    color: '#a0a0a0',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  userChipDark: {
    backgroundColor: '#2a2a2a',
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  groupOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  groupOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  dividerDark: {
    backgroundColor: '#333',
  },
  usersListTitle: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  userList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  userItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  userItemDark: {
    backgroundColor: '#121212',
  },
  userAvatar: {
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  groupNameContainer: {
    padding: 16,
    flex: 1,
  },
  groupNameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  groupNameSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  groupAvatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  groupNameInput: {
    height: 56,
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    marginBottom: 24,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  groupNameInputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#f0f0f0',
  },
  groupParticipantsContainer: {
    flex: 1,
  },
  participantsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participantItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 72,
    marginRight: 12,
    marginBottom: 16,
  },
  participantAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
  },
  defaultParticipantAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
});

export default NewConversationScreen; 