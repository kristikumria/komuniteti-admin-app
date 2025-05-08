import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme, Badge } from 'react-native-paper';
import { 
  BarChart3, 
  Building, 
  UserCheck, 
  MoreHorizontal
} from 'lucide-react-native';
import { BusinessManagerStackParamList } from './types';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens (will create these files next)
import { Dashboard } from '../screens/business-manager/Dashboard';
import { BuildingsList } from '../screens/business-manager/Buildings/BuildingsList';
import { BuildingDetails } from '../screens/business-manager/Buildings/BuildingDetails';
import { AddBuilding } from '../screens/business-manager/Buildings/AddBuilding';
import { EditBuilding } from '../screens/business-manager/Buildings/EditBuilding';
import { AssignAdministrator } from '../screens/business-manager/Administrators/AssignAdministrator';
import { AdministratorsList } from '../screens/business-manager/Administrators/AdministratorsList';
import { AdministratorDetails } from '../screens/business-manager/Administrators/AdministratorDetails';
import { ReportsList } from '../screens/business-manager/Reports/ReportsList';
import { ReportDetails } from '../screens/business-manager/Reports/ReportDetails';
import { NotificationsScreen } from '../screens/shared/Notifications/NotificationsScreen';
import { NotificationDetails } from '../screens/shared/Notifications/NotificationDetails';
import { NotificationSettings } from '../screens/shared/Settings/NotificationSettings';
import { MessagesScreen } from '../screens/shared/Messages/MessagesScreen';
import { InfoPointsScreen } from '../screens/shared/InfoPoints/InfoPointsScreen';
import { PollsScreen } from '../screens/shared/Polls/PollsScreen';
import { OrganigramScreen } from '../screens/business-manager/Organigram/OrganigramScreen';
import { AnalyticsScreen } from '../screens/business-manager/Analytics/AnalyticsScreen';
import { SettingsScreen } from '../screens/shared/Settings/SettingsScreen';
import { ServicesScreen } from '../screens/business-manager/Services/ServicesScreen';
import { MoreScreen } from '../screens/shared/More/MoreScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<BusinessManagerStackParamList>();
const RootStack = createNativeStackNavigator<BusinessManagerStackParamList>();

// Individual Stack Navigators
const BuildingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Buildings" component={BuildingsList} />
      <Stack.Screen name="BuildingDetails" component={BuildingDetails} />
      <Stack.Screen name="AddBuilding" component={AddBuilding} />
      <Stack.Screen name="EditBuilding" component={EditBuilding} />
      <Stack.Screen name="AssignAdministrator" component={AssignAdministrator} />
    </Stack.Navigator>
  );
};

const AdminsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Administrators" component={AdministratorsList} />
      <Stack.Screen name="AdministratorDetails" component={AdministratorDetails} />
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

const MoreStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreMain" component={MoreScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="InfoPointsScreen" component={InfoPointsScreen} />
      <Stack.Screen name="PollsScreen" component={PollsScreen} />
      <Stack.Screen name="NotificationsTab" component={NotificationsScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Organigram" component={OrganigramScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDarkMode = useSelector((state: RootState) => state.settings.darkMode);
  
  // Colors based on dark/light mode
  const tabBarBackgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const activeIconColor = theme.colors.primary;
  const inactiveIconColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const activeLabelColor = theme.colors.primary;
  const inactiveLabelColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  
  // For iOS, we'll use a blur effect
  const isIOS = Platform.OS === 'ios';
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          position: 'absolute',
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
            return <BarChart3 size={iconSize} color={iconColor} />;
          } else if (route.name === 'BuildingsTab') {
            return <Building size={iconSize} color={iconColor} />;
          } else if (route.name === 'AdminsTab') {
            return <UserCheck size={iconSize} color={iconColor} />;
          } else if (route.name === 'MoreTab') {
            return <MoreHorizontal size={iconSize} color={iconColor} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen 
        name="DashboardTab"
        component={Dashboard}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="BuildingsTab"
        component={BuildingsStack}
        options={{
          tabBarLabel: 'Buildings',
        }}
      />
      <Tab.Screen 
        name="AdminsTab"
        component={AdminsStack}
        options={{
          tabBarLabel: 'Admins',
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
export const BusinessManagerNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
      <RootStack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <RootStack.Screen name="NotificationDetails" component={NotificationDetails} />
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