import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { BusinessManagerNavigator } from './BusinessManagerNavigator';
import { AdministratorNavigator } from './AdministratorNavigator';
import { NotificationManager } from '../components/NotificationManager';
import { adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create adapted navigation themes
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: MD3LightTheme,
  materialDark: MD3DarkTheme,
});

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector(state => state.settings?.darkMode);
  const systemColorScheme = useColorScheme();
  
  // Determine if we should use dark mode based on user preference or system setting
  const useDarkMode = isDarkMode ?? (systemColorScheme === 'dark');
  const navigationTheme = useDarkMode ? DarkTheme : LightTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <NotificationManager>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'business_manager' ? (
          <Stack.Screen name="BusinessManager" component={BusinessManagerNavigator} />
        ) : (
          <Stack.Screen name="Administrator" component={AdministratorNavigator} />
        )}
      </Stack.Navigator>
      </NotificationManager>
    </NavigationContainer>
  );
}; 