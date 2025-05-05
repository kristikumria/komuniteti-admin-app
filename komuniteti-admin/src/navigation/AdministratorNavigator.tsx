import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { 
  BarChart3, 
  Users, 
  Wallet, 
  Wrench, 
  Bell,
  MessageSquare
} from 'lucide-react-native';
import { AdministratorStackParamList } from './types';

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
import ChatListScreen from '../screens/administrator/Chat/ChatListScreen';
import ChatConversationScreen from '../screens/administrator/Chat/ChatConversationScreen';
import { InfoPointsScreen } from '../screens/shared/InfoPoints/InfoPointsScreen';
import { PollsScreen } from '../screens/shared/Polls/PollsScreen';
import { SettingsScreen } from '../screens/shared/Settings/SettingsScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<AdministratorStackParamList>();

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

const NotificationsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsTab" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Chat" 
        component={ChatListScreen} 
        options={{ 
          headerTitle: 'Messages',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }} 
      />
      <Stack.Screen 
        name="ChatConversation" 
        component={ChatConversationScreen}
        options={{ 
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
    </Stack.Navigator>
  );
};

export const AdministratorNavigator = () => {
  const theme = useTheme();
  const unreadChatCount = useSelector((state: RootState) => state.chat.unreadCount);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="ResidentsTab"
        component={ResidentsStack}
        options={{
          tabBarLabel: 'Residents',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsStack}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="ReportsTab"
        component={ReportsStack}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
          tabBarBadge: unreadChatCount > 0 ? unreadChatCount : undefined,
        }}
      />

      <Tab.Screen
        name="AlertsTab"
        component={NotificationsStack}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}; 