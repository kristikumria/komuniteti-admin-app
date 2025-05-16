// Export all types to make them available throughout the app

// Import declaration files
import './index.d.ts';
import './theme.d.ts';
import './store.d.ts';
import './declaration.d.ts';
import './react-native-paper.d.ts';

// Building types
export * from './buildingTypes';

// Administrator types
export * from './administratorTypes';

// Service types
export * from './serviceTypes';

// InfoPoint types
export * from './infoPointTypes';

// Maintenance types
export * from './maintenanceTypes';

// Notification types
export * from './notification';

// Do not export from infoPoint.ts as it duplicates InfoPoint type 