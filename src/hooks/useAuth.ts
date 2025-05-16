import { useState, useEffect } from 'react';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'business_manager' | 'administrator' | 'resident';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user on mount
  useEffect(() => {
    // Mock implementation - in a real app, this would check tokens, session, etc.
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // Mock authenticated user for development
        const mockUser: User = {
          id: 'user-123',
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe',
          role: 'business_manager',
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock implementation - would make API call in real app
      const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: email,
        avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe',
        role: 'business_manager',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      // Mock implementation - would make API call in real app
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}; 