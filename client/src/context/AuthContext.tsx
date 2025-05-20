import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser as setUserAction, setSession as setSessionAction, Session } from '../state/authSlice';
import { authService, User } from '../services/pocketbase';
import { secureStorageService } from '../services/secureStorageService';

// Define the shape of our auth context
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap our app and provide auth context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [session, setSessionState] = useState<Session | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    const getInitialSession = async () => {
      try {
        // Try to get the session from secure storage first
        const storedSession = await secureStorageService.get<Session>('session');
        
        if (storedSession) {
          console.log('Loaded session from secure storage');
          
          // Session was successfully loaded
          setSessionState(storedSession);
          setUserState(storedSession?.user ?? null);
          
          // Update Redux store
          dispatch(setSessionAction(storedSession));
          dispatch(setUserAction(storedSession?.user ?? null));
        } else {
          // Check localStorage as fallback
          const localSession = localStorage.getItem('avilasha_session');
          const localUser = localStorage.getItem('avilasha_user');
          
          if (localSession && localUser) {
            try {
              const parsedSession = JSON.parse(localSession) as Session;
              const parsedUser = JSON.parse(localUser) as User;
              
              setSessionState(parsedSession);
              setUserState(parsedUser);
              
              // Update Redux store
              dispatch(setSessionAction(parsedSession));
              dispatch(setUserAction(parsedUser));
              
              // Store in secure storage for future use
              await secureStorageService.set('session', parsedSession);
              await secureStorageService.set('user', parsedUser);
            } catch (parseError) {
              console.error('Error parsing stored session:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, [dispatch]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // Use PocketBase authentication service
      const user = await authService.login(email, password);
      
      // Create session object for compatibility with existing code
      const session = {
        access_token: 'pb-token', // PocketBase handles tokens internally
        refresh_token: 'pb-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
        expires_in: 3600,
        token_type: 'bearer',
        user: user
      } as Session;
      
      // Update Redux store
      dispatch(setUserAction(user));
      dispatch(setSessionAction(session));
      
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Use PocketBase authentication service to logout
      await authService.logout();
      
      // Update Redux store
      dispatch(setUserAction(null));
      dispatch(setSessionAction(null));
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Provide the auth context to children components
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
