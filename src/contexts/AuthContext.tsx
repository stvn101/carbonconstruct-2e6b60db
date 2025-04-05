
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  signInWithGitHub: () => Promise<void>; // Added this method to the interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      // Mock successful login
      const mockUser = {
        id: 'user-1',
        name: 'Demo User',
        email
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error('Login failed:', error);
      toast.error("Login failed, please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      // Mock successful registration
      const mockUser = {
        id: 'user-' + Date.now().toString(),
        name,
        email
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error("Registration failed, please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would redirect to GitHub OAuth
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating OAuth flow
      
      // Mock successful GitHub login
      const mockUser = {
        id: 'github-user-1',
        name: 'GitHub User',
        email: 'github-user@example.com'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Successfully logged in with GitHub!");
    } catch (error) {
      console.error('GitHub login failed:', error);
      toast.error("GitHub login failed, please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, signInWithGitHub }}>
      {children}
    </AuthContext.Provider>
  );
};
