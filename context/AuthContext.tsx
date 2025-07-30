import { db } from '@/common/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// --- INTERFACES ---
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

// --- CONTEXT ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = '@yoga_app_user_session';

// --- PROVIDER COMPONENT ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocalSession = async () => {
      try {
        const userJson = await AsyncStorage.getItem(STORAGE_KEY);
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLocalSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!password || typeof password !== 'string') {
        return { success: false, error: 'Invalid password provided.' };
      }

      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return { success: false, error: 'Incorrect email or password.' };
      }
      const userData = userDoc.data();
      
      if (!userData.password || typeof userData.password !== 'string') {
        return { success: false, error: 'Invalid user data.' };
      }

      const hashedInputPassword = CryptoJS.SHA256(password.toString()).toString();
      if (hashedInputPassword !== userData.password) {
        return { success: false, error: 'Incorrect email or password.' };
      }
      
      const loggedInUser: User = {
        id: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        createdAt: userData.createdAt,
      };

      setUser(loggedInUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unknown error occurred.' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!userData.password || typeof userData.password !== 'string') {
        return { success: false, error: 'Invalid password provided.' };
      }

      const userDocRef = doc(db, 'users', userData.email);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return { success: false, error: 'An account with this email already exists.' };
      }


      const hashedPassword = CryptoJS.SHA256(userData.password).toString();

      const newUserDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(userDocRef, newUserDoc);
      
      // Set user directly instead of calling login to avoid state loop
      const loggedInUser: User = {
        id: userData.email,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        createdAt: newUserDoc.createdAt,
      };

      setUser(loggedInUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      return { success: true };

    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to create account.' };
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// --- HOOK ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}