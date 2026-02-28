import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: Role, email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ktu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (role: Role, email: string) => {
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      const mockUser: User = {
        id: role === 'student' ? 'S101' : 'T202',
        name: role === 'student' ? 'John Doe' : 'Dr. Smith',
        email,
        role,
        department: 'Computer Science',
        semester: role === 'student' ? 6 : undefined,
        studentId: role === 'student' ? 'KTU/CS/21/045' : undefined,
      };
      setUser(mockUser);
      localStorage.setItem('ktu_user', JSON.stringify(mockUser));
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ktu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
