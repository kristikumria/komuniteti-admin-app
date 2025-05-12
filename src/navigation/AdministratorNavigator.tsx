import React from 'react';
import { StyleSheet, View, Text as RNText, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme, Badge } from 'react-native-paper';
import { 
  BarChart3, 
  Users, 
  Wallet, 
  MessageSquare,
  MoreHorizontal 
} from 'lucide-react-native';
import { AdministratorStackParamList, AdministratorTabParamList } from './types';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import { Dashboard } from '../screens/administrator/Dashboard';
import { ResidentsList } from '../screens/administrator/Residents/ResidentsList';
import { ResidentDetails } from '../screens/administrator/Residents/ResidentDetails';
import { AddResident } from '../screens/administrator/Residents/AddResident';
import { EditResident } from '../screens/administrator/Residents/EditResident';
import { PaymentsList } from '../screens/administrator/Payments/PaymentsList';
import { PaymentDetails } from '../screens/administrator/Payments/PaymentDetails';
import { AddPayment } from '../screens/administrator/Payments/AddPayment';
import { ProcessPayment } from '../screens/administrator/Payments/ProcessPayment';
import { PaymentHistory } from '../screens/administrator/Payments/PaymentHistory';
import { ReportsList } from '../screens/administrator/Reports/ReportsList';
import { ReportDetails } from '../screens/administrator/Reports/ReportDetails';
import { NotificationsScreen } from '../screens/shared/Notifications/NotificationsScreen';
import { NotificationDetails } from '../screens/shared/Notifications/NotificationDetails';
import { NotificationSettings } from '../screens/shared/Settings/NotificationSettings';
import { ChatListScreen, ChatConversationScreen, NewConversationScreen } from '../screens/shared/Chat';
import { InfoPointsScreen } from '../screens/shared/InfoPoints/InfoPointsScreen';
import { PollsScreen } from '../screens/shared/Polls/PollsScreen';
import { PollDetailsScreen } from '../screens/shared/Polls/PollDetailsScreen';
import { SettingsScreen } from '../screens/shared/Settings/SettingsScreen';
import { MoreScreen } from '../screens/shared/More/MoreScreen';

const Tab = createBottomTabNavigator<AdministratorTabParamList>();
const Stack = createNativeStackNavigator<AdministratorStackParamList>();
const RootStack = createNativeStackNavigator<AdministratorStackParamList>();

// Individual Stack Navigators
const ResidentsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Residents" component={ResidentsList} />
      <Stack.Screen name="ResidentDetails" component={ResidentDetails} />
      <Stack.Screen name="AddResident" component={AddResident} />
      <Stack.Screen name="EditResident" component={EditResident} />
    </Stack.Navigator>
  );
};

const PaymentsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Payments" component={PaymentsList} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
      <Stack.Screen name="AddPayment" component={AddPayment} />
      <Stack.Screen name="ProcessPayment" component={ProcessPayment} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
    </Stack.Navigator>
  );
};

const ReportsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reports" component={ReportsList} />
      <Stack.Screen name="ReportDetails" component={ReportDetails} />
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chat" component={ChatListScreen} />
      <Stack.Screen 
        name="ChatConversation" 
        component={ChatConversationScreen}
      />
      <Stack.Screen 
        name="NewConversation" 
        component={NewConversationScreen}
      />
    </Stack.Navigator>
  );
};

const MoreStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreMain" component={MoreScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="InfoPointsScreen" component={InfoPointsScreen} />
      <Stack.Screen name="PollsScreen" component={PollsScreen} />
      <Stack.Screen name="PollDetails" component={PollDetailsScreen} />
      <Stack.Screen name="ReportsStack" component={ReportsStack} />
      <Stack.Screen name="NotificationsTab" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="Messages" component={ChatListScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="NewConversation" component={NewConversationScreen} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const unreadChatCount = useSelector((state: RootState) => state.chat.unreadCount);
  const isDarkMode = useSelector((state: RootState) => state.settings.darkMode);
  
  // Colors based on dark/light mode
  const tabBarBackgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const activeIconColor = theme.colors.primary;
  const inactiveIconColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const activeLabelColor = theme.colors.primary;
  const inactiveLabelColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  
  // For iOS, we'll use a blur effect
  const isIOS = Platform.OS === 'ios';

  // Create a wrapper component for Dashboard to ensure it's properly typed
  const DashboardScreen = () => <Dashboard />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0,
          elevation: 3,
          zIndex: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          ...(isIOS && {
            backgroundColor: 'transparent',
            elevation: 0,
          }),
        },
        tabBarItemStyle: {
          padding: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          paddingBottom: 4,
        },
        tabBarBackground: () => 
          isIOS ? (
            <BlurView 
              style={StyleSheet.absoluteFill}
              intensity={isDarkMode ? 35 : 80}
              tint={isDarkMode ? 'dark' : 'light'}
            />
          ) : null,
        tabBarActiveTintColor: activeLabelColor,
        tabBarInactiveTintColor: inactiveLabelColor,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = 22;
          const iconColor = focused ? activeIconColor : inactiveIconColor;
          
          if (route.name === 'DashboardTab') {
            return <BarChart3 color={iconColor} size={iconSize} />;
          } else if (route.name === 'ResidentsTab') {
            return <Users color={iconColor} size={iconSize} />;
          } else if (route.name === 'PaymentsTab') {
            return <Wallet color={iconColor} size={iconSize} />;
          } else if (route.name === 'ChatTab') {
            return (
              <View style={{ position: 'relative' }}>
                <MessageSquare color={iconColor} size={iconSize} />
                {unreadChatCount > 0 && (
                  <Badge 
                    style={styles.badge}
                    size={16}
                  >
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </Badge>
                )}
              </View>
            );
          } else if (route.name === 'MoreTab') {
            return <MoreHorizontal color={iconColor} size={iconSize} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="ResidentsTab"
        component={ResidentsStack}
        options={{
          tabBarLabel: 'Residents',
        }}
      />

      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsStack}
        options={{
          tabBarLabel: 'Payments',
        }}
      />

      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarBadge: unreadChatCount > 0 ? unreadChatCount : undefined,
        }}
      />

      <Tab.Screen
        name="MoreTab"
        component={MoreStack}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator that includes both tabs and standalone screens
export const AdministratorNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
      <RootStack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <RootStack.Screen name="NotificationDetails" component={NotificationDetails} />
      <RootStack.Screen name="NewConversation" component={NewConversationScreen} />
      <RootStack.Screen name="ChatConversation" component={ChatConversationScreen} />
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#e53935',
  },
}); 