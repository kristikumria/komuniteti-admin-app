import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { 
  BarChart3, 
  Building, 
  UserCheck, 
  Wrench, 
  Bell,
  Settings as SettingsIcon 
} from 'lucide-react-native';
import { BusinessManagerStackParamList } from './types';

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
import { MessagesScreen } from '../screens/shared/Messages/MessagesScreen';
import { InfoPointsScreen } from '../screens/shared/InfoPoints/InfoPointsScreen';
import { PollsScreen } from '../screens/shared/Polls/PollsScreen';
import { OrganigramScreen } from '../screens/business-manager/Organigram/OrganigramScreen';
import { AnalyticsScreen } from '../screens/business-manager/Analytics/AnalyticsScreen';
import { SettingsScreen } from '../screens/shared/Settings/SettingsScreen';
import { ServicesScreen } from '../screens/business-manager/Services/ServicesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<BusinessManagerStackParamList>();

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

const NotificationsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="InfoPoints" component={InfoPointsScreen} />
      <Stack.Screen name="Polls" component={PollsScreen} />
      <Stack.Screen name="Organigram" component={OrganigramScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
    </Stack.Navigator>
  );
};

export const BusinessManagerNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen 
        name="DashboardTab"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="BuildingsTab"
        component={BuildingsStack}
        options={{
          tabBarLabel: 'Buildings',
          tabBarIcon: ({ color, size }) => (
            <Building size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="AdminsTab"
        component={AdminsStack}
        options={{
          tabBarLabel: 'Admins',
          tabBarIcon: ({ color, size }) => (
            <UserCheck size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ReportsTab"
        component={ReportsStack}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Wrench size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="NotificationsTab"
        component={NotificationsStack}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 