import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { BusinessManagerNavigator } from './BusinessManagerNavigator';
import { AdministratorNavigator } from './AdministratorNavigator';
import { NotificationManager } from '../components/NotificationManager';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer>
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