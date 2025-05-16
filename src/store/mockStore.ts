/**
 * This file contains mock data initialization for development and testing purposes.
 * It populates the Redux store with sample data for various slices.
 */
import { store } from './store';
import { setUser } from './slices/authSlice';
import { toggleDarkMode, setLanguage } from './slices/settingsSlice';
import { createBuilding } from './slices/buildingSlice';
import { createInfoPoint } from './slices/infoPointSlice';
import { createNotification } from './slices/notificationsSlice';

/**
 * Initializes the Redux store with mock data for development
 */
const initializeMockStore = () => {
  // Only initialize mock data in development mode
  if (process.env.NODE_ENV !== 'development') {
    console.log('Mock store initialization skipped in production environment');
    return;
  }

  console.log('Initializing mock store data for development...');

  // Initialize mock auth user
  store.dispatch(
    setUser({
      id: 'mock-user-id',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'administrator',
    })
  );

  // Initialize mock settings
  store.dispatch(toggleDarkMode());
  store.dispatch(setLanguage('en'));

  // Initialize a mock building
  store.dispatch(
    createBuilding({
      name: 'Sample Building',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      country: 'USA',
      units: 24,
      floors: 6,
      buildYear: 2010,
      totalArea: 5000,
      description: 'A sample building for development',
    })
  );

  // Initialize a mock info point based on the InfoPointForm implementation
  store.dispatch(
    createInfoPoint({
      title: 'Welcome to the community',
      content: 'This is a sample information point for testing.',
      category: 'general',
      pinned: false,
      published: true,
      attachments: [], // Required field
    })
  );

  // Initialize a mock notification
  store.dispatch(
    createNotification({
      title: 'New Payment Due',
      message: 'You have a new payment due this month',
      icon: 'cash',
      type: 'payment',
      read: false,
    })
  );

  console.log('Mock store initialized successfully');
};

export default initializeMockStore; 