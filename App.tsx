import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store/store';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import initializeMockStore from './src/store/mockStore';
import { MobileFrameWrapper } from './src/components/MobileFrameWrapper';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock store data
    initializeMockStore();
    setIsLoading(false);
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
