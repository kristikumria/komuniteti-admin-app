// Import the crypto polyfill as the first import
import 'react-native-get-random-values';

// Import required React Native components
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App); 