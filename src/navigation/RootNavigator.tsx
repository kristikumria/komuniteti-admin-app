import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { BusinessManagerNavigator } from './BusinessManagerNavigator';
import { AdministratorNavigator } from './AdministratorNavigator';
import { NotificationManager } from '../components/NotificationManager';
import { adaptNavigationTheme, useTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const paperTheme = useTheme();
  
  // Create adapted navigation theme from the current Paper theme
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialLight: paperTheme,
    materialDark: paperTheme,
  });
  
  // Use the theme that matches our current paper theme (light/dark)
  const navigationTheme = paperTheme.dark ? DarkTheme : LightTheme;

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