import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PARENT_AUTH_KEY = 'parent_auth_session';
const PARENT_PIN_KEY = 'parent_pin';

interface ParentAuthState {
  isAuthenticated: boolean;
  pin: string;
  attempts: number;
  lastAttemptTime: number;
}

export const useParentAccess = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Check if user is already authenticated (session-based)
  const checkExistingSession = useCallback(async () => {
    try {
      const session = await AsyncStorage.getItem(PARENT_AUTH_KEY);
      if (session) {
        const sessionData = JSON.parse(session);
        const isValid = Date.now() - sessionData.timestamp < 15 * 60 * 1000; // 15-minute session
        if (isValid) {
          setIsAuthenticated(true);
          return true;
        } else {
          await AsyncStorage.removeItem(PARENT_AUTH_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
    return false;
  }, []);

  const checkPin = useCallback(async (inputPin: string): Promise<boolean> => {
    // Prevent brute force attacks
    if (isLocked) {
      if (Date.now() < lockTimeRemaining) {
        const remaining = Math.ceil((lockTimeRemaining - Date.now()) / 1000);
        setLockTimeRemaining(lockTimeRemaining);
        return false;
      }
      setIsLocked(false);
      setAttempts(0);
    }

    try {
      // In production, store PIN in SecureStore instead of AsyncStorage
      const storedPin = await AsyncStorage.getItem(PARENT_PIN_KEY);
      const correctPin = storedPin || '1234'; // Default PIN for demo

      if (inputPin === correctPin) {
        setIsAuthenticated(true);
        setAttempts(0);
        setPin('');

        // Create a new session
        const sessionData = {
          timestamp: Date.now(),
          user: 'parent',
        };
        await AsyncStorage.setItem(PARENT_AUTH_KEY, JSON.stringify(sessionData));
        return true;
      }

      // Incorrect PIN
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 1000; // 5-minute lockout
        setIsLocked(true);
        setLockTimeRemaining(lockTime);
      }

      return false;
    } catch (error) {
      console.error('Error checking PIN:', error);
      return false;
    }
  }, [attempts, isLocked, lockTimeRemaining]);

  const setNewPin = useCallback(async (newPin: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(PARENT_PIN_KEY, newPin);
      setPin(newPin);
    } catch (error) {
      console.error('Error setting PIN:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsAuthenticated(false);
      setPin('');
      setAttempts(0);
      setIsLocked(false);
      await AsyncStorage.removeItem(PARENT_AUTH_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  return {
    isAuthenticated,
    checkPin,
    logout,
    attempts,
    isLocked,
    lockTimeRemaining,
    setNewPin,
    checkExistingSession,
  };
};
