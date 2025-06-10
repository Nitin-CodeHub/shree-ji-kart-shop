
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  isLoggedIn: boolean;
}

interface UserContextType {
  user: User | null;
  login: (userData: Omit<User, 'id' | 'isLoggedIn'>) => void;
  logout: () => void;
  updateUser: (userData: Partial<Omit<User, 'id' | 'isLoggedIn'>>) => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('shreeji-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: Omit<User, 'id' | 'isLoggedIn'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      isLoggedIn: true
    };
    setUser(newUser);
    localStorage.setItem('shreeji-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shreeji-user');
  };

  const updateUser = (userData: Partial<Omit<User, 'id' | 'isLoggedIn'>>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('shreeji-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isLoggedIn: !!user?.isLoggedIn
    }}>
      {children}
    </UserContext.Provider>
  );
};
