import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store/store';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { loginSuccess } from './src/store/slices/authSlice';
import { authService } from './src/services/authService';
import { MobileFrameWrapper } from './src/components/MobileFrameWrapper';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authService.getCurrentUser();
        
        if (userData) {
          store.dispatch(loginSuccess({
            user: userData.user,
            token: userData.token,
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    // You could return a loading screen here
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar style="auto" />
          <MobileFrameWrapper>
            <RootNavigator />
          </MobileFrameWrapper>
      </ThemeProvider>
    </Provider>
  );
}
