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
  MoreHorizontal,
  Building2
} from 'lucide-react-native';
import { AdministratorStackParamList, AdministratorTabParamList } from './types';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBreakpoint } from '../hooks/useBreakpoint';

// Import screens
import { AdministratorDashboard } from '../screens/administrator/Dashboard/Dashboard';
import { ResidentsList } from '../screens/administrator/Residents/ResidentsList';
import { ResidentDetails } from '../screens/administrator/Residents/ResidentDetails';
import { ResidentsTabletLayout } from '../screens/administrator/Residents/ResidentsTabletLayout';
import { AddResident } from '../screens/administrator/Residents/AddResident';
import { EditResident } from '../screens/administrator/Residents/EditResident';
// Import Units screens
import { UnitsList } from '../screens/administrator/Units/UnitsList';
import { UnitsTabletLayout } from '../screens/administrator/Units/UnitsTabletLayout';
import { ResidentialUnits } from '../screens/administrator/Units/ResidentialUnits';
import { BusinessUnits } from '../screens/administrator/Units/BusinessUnits';
import { BuildingUnits } from '../screens/administrator/Units/BuildingUnits';
import { UnitDetails } from '../screens/administrator/Units/UnitDetails';
import { AddUnit } from '../screens/administrator/Units/AddUnit';
import { EditUnit } from '../screens/administrator/Units/EditUnit';
// Import other screens
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
import { InfoPointsScreen, InfoPointsTabletLayout } from '../screens/shared/InfoPoints';
import { PollsScreen } from '../screens/shared/Polls/PollsScreen';
import { PollDetailsScreen } from '../screens/shared/Polls/PollDetailsScreen';
import { SettingsScreen, SettingsTabletLayout } from '../screens/shared/Settings';
import { MoreScreen } from '../screens/shared/More/MoreScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { ProfileTabletLayout } from '../screens/shared/ProfileTabletLayout';
// Import the tablet layouts
import { PaymentsTabletLayout } from '../screens/administrator/Payments/PaymentsTabletLayout';
import { ReportsTabletLayout } from '../screens/administrator/Reports/ReportsTabletLayout';
import { ChatTabletLayout } from '../screens/shared/Chat';
// Import the maintenance components but not MaintenanceList (removed duplicate)
import { MaintenanceDetail, MaintenanceForm, MaintenanceWorkers, MaintenanceWorkerDetail, MaintenanceAnalyticsComponent as MaintenanceAnalytics } from '../screens/shared/Maintenance/MaintenanceComponents';
// Import the unified MaintenanceReports screen
import MaintenanceReports from '../screens/administrator/MaintenanceReports';

const Tab = createBottomTabNavigator<AdministratorTabParamList>();
const Stack = createNativeStackNavigator<AdministratorStackParamList>();
const RootStack = createNativeStackNavigator<AdministratorStackParamList>();
const MainStack = createBottomTabNavigator<AdministratorTabParamList>();

// Individual Stack Navigators

// Units Stack Navigator
const UnitsStack = () => {
  const { isTablet } = useBreakpoint();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Units" 
        component={isTablet ? UnitsTabletLayout : UnitsList} 
      />
      <Stack.Screen name="UnitDetails" component={UnitDetails} />
      <Stack.Screen name="AddUnit" component={AddUnit} />
      <Stack.Screen name="EditUnit" component={EditUnit} />
      <Stack.Screen name="ResidentialUnits" component={ResidentialUnits} />
      <Stack.Screen name="BusinessUnits" component={BusinessUnits} />
      <Stack.Screen name="BuildingUnits" component={BuildingUnits} />
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
  const { isTablet } = useBreakpoint();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Chat" 
        component={isTablet ? ChatTabletLayout : ChatListScreen}
      />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="NewConversation" component={NewConversationScreen} />
    </Stack.Navigator>
  );
};

const MoreStack = () => {
  const { isTablet } = useBreakpoint();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreMain" component={MoreScreen} />
      <Stack.Screen 
        name="Settings" 
        component={isTablet ? SettingsTabletLayout : SettingsScreen} 
      />
      <Stack.Screen 
        name="InfoPointsScreen" 
        component={isTablet ? InfoPointsTabletLayout : InfoPointsScreen} 
      />
      <Stack.Screen name="PollsScreen" component={PollsScreen} />
      <Stack.Screen name="PollDetails" component={PollDetailsScreen} />
      <Stack.Screen name="ReportsStack" component={ReportsStack} />
      <Stack.Screen name="NotificationsTab" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="Messages" component={ChatListScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="NewConversation" component={NewConversationScreen} />
      <Stack.Screen name="MaintenanceReports" component={MaintenanceReports} />
      <Stack.Screen name="MaintenanceDetail" component={MaintenanceDetail} />
      <Stack.Screen name="MaintenanceForm" component={MaintenanceForm} />
      <Stack.Screen name="MaintenanceWorkers" component={MaintenanceWorkers} />
      <Stack.Screen name="MaintenanceWorkerDetail" component={MaintenanceWorkerDetail} />
      <Stack.Screen name="MaintenanceAnalytics" component={MaintenanceAnalytics} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const AdministratorTabNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const unreadChatCount = useSelector((state: RootState) => state.chat.unreadCount);
  const isDarkMode = useSelector((state: RootState) => state.settings.darkMode);
  const { isTablet } = useBreakpoint();
  
  // Colors based on dark/light mode
  const tabBarBackgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const activeIconColor = theme.colors.primary;
  const inactiveIconColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const activeLabelColor = theme.colors.primary;
  const inactiveLabelColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  
  // For iOS, we'll use a blur effect
  const isIOS = Platform.OS === 'ios';

  // Create a wrapper component for Dashboard
  const DashboardScreen = () => <AdministratorDashboard />;

  return (
    <MainStack.Navigator
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
          } else if (route.name === 'UnitsTab') {
            return <Building2 color={iconColor} size={iconSize} />;
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
      initialRouteName="DashboardTab"
    >
      <MainStack.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />

      <MainStack.Screen
        name="UnitsTab"
        component={UnitsStack}
        options={{
          tabBarLabel: 'Units',
        }}
      />

      <MainStack.Screen
        name="PaymentsTab"
        component={PaymentsStack}
        options={{
          tabBarLabel: 'Payments',
        }}
      />

      <MainStack.Screen
        name="ChatTab"
        component={ChatStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarBadge: unreadChatCount > 0 ? unreadChatCount : undefined,
        }}
      />

      <MainStack.Screen
        name="MoreTab"
        component={MoreStack}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </MainStack.Navigator>
  );
};

// Root Navigator that includes both tabs and standalone screens
export const AdministratorNavigator = () => {
  const theme = useTheme();
  const { isTablet } = useBreakpoint();

  // Create screen configurations
  const getScreens = () => (
    <>
      {/* Dashboard */}
      <Stack.Screen name="Dashboard" component={AdministratorDashboard} />
      
      {/* ... existing screens ... */}
      
      {/* Residents Management - conditional rendering based on device type */}
      <Stack.Screen 
        name="Residents" 
        component={isTablet ? ResidentsTabletLayout : ResidentsList} 
      />
      <Stack.Screen name="ResidentDetails" component={ResidentDetails} />
      <Stack.Screen name="AddResident" component={AddResident} />
      <Stack.Screen name="EditResident" component={EditResident} />
      
      {/* Units Management - conditional rendering based on device type */}
      <Stack.Screen 
        name="Units" 
        component={isTablet ? UnitsTabletLayout : UnitsList} 
      />
      <Stack.Screen name="UnitDetails" component={UnitDetails} />
      <Stack.Screen name="AddUnit" component={AddUnit} />
      <Stack.Screen name="EditUnit" component={EditUnit} />
      <Stack.Screen name="ResidentialUnits" component={ResidentialUnits} />
      <Stack.Screen name="BusinessUnits" component={BusinessUnits} />
      <Stack.Screen name="BuildingUnits" component={BuildingUnits} />
      
      {/* Payments Screens with tablet layout support */}
      <Stack.Screen 
        name="Payments" 
        component={isTablet ? PaymentsTabletLayout : PaymentsList}
      />
      <Stack.Screen 
        name="PaymentDetails" 
        component={PaymentDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddPayment" component={AddPayment} />
      <Stack.Screen name="ProcessPayment" component={ProcessPayment} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
      
      {/* Reports Screens with tablet layout support */}
      <Stack.Screen 
        name="Reports" 
        component={isTablet ? ReportsTabletLayout : ReportsList}
      />
      <Stack.Screen 
        name="ReportDetails" 
        component={ReportDetails}
        options={{ headerShown: false }}
      />
      
      {/* Chat Screens with tablet layout support */}
      <Stack.Screen 
        name="Messages" 
        component={isTablet ? ChatTabletLayout : ChatListScreen} 
      />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="NewConversation" component={NewConversationScreen} />
      
      {/* InfoPoints Screens with tablet layout support */}
      <Stack.Screen 
        name="InfoPoints" 
        component={isTablet ? InfoPointsTabletLayout : InfoPointsScreen}
      />
    </>
  );

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="AdministratorTabs" component={AdministratorTabNavigator} />
      
      {/* Standalone Screens */}
      {getScreens()}

      {/* Settings & Profile */}
      <RootStack.Screen 
        name="Settings" 
        component={isTablet ? SettingsTabletLayout : SettingsScreen} 
      />
      <RootStack.Screen 
        name="Profile" 
        component={isTablet ? ProfileTabletLayout : ProfileScreen} 
      />
      
      {/* Unified Maintenance & Reports Screen */}
      <RootStack.Screen 
        name="MaintenanceReports" 
        component={MaintenanceReports} 
      />
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