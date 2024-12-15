import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  fetchUserData: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5001/login/user', {
        credentials: 'include', 
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    fetch('http://localhost:5001/logout', { method: 'POST', credentials: 'include' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, fetchUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
