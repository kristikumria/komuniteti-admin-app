import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { User } from '../navigation/types';
import { UserRole } from '../store/slices/authSlice';

// Determine if we should use mock data for development
const USE_MOCK_DATA = true;

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock data for testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'business@example.com',
    name: 'Business Manager',
    role: 'business_manager' as UserRole,
    password: 'password123',
  },
  {
    id: '2',
    email: 'property@example.com',
    name: 'Administrator',
    role: 'administrator' as UserRole,
    password: 'password123',
  },
];

// Mock token generator
const generateMockToken = (user: User) => {
  // This is just a simple string, not a real JWT
  return `mock_token_${user.id}_${Date.now()}`;
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      return new Promise<AuthResponse>((resolve, reject) => {
        // Simulate network delay
        setTimeout(async () => {
          const user = MOCK_USERS.find(
            (user) => 
              user.email === credentials.email && 
              user.password === credentials.password
          );
          
          if (user) {
            const userData: User = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
            
            const token = generateMockToken(userData);
            
            // Save to AsyncStorage to persist the session
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            
            resolve({
              token,
              user: userData,
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 500); // 500ms delay to simulate network
      });
    }
    
    // Use real API if mock is disabled
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      return true;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      // For mock data
      if (USE_MOCK_DATA) {
        const token = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');
        
        if (!token || !userJson) return null;
        
        const user = JSON.parse(userJson) as User;
        return { user, token };
      }
      
      // For real API
      const token = await AsyncStorage.getItem('token');
      
      if (!token) return null;
      
      const decodedToken = jwtDecode<TokenPayload>(token);
      
      const user: User = {
        id: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken.role,
      };
      
      return { user, token };
    } catch (error) {
      return null;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 