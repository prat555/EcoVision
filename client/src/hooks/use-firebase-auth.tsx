import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

// Define our app's user type
export interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  isGuest: boolean;
  guestId?: string;
  createdAt: string;
}

type AuthContextType = {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsGuest: () => void;
};

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterData = z.infer<typeof registerSchema>;

export const AuthContext = createContext<AuthContextType | null>(null);

function firebaseUserToAppUser(firebaseUser: FirebaseUser): AppUser {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    username: firebaseUser.email?.split('@')[0] || firebaseUser.uid,
    isGuest: false,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUserToAppUser(firebaseUser));
      } else {
        // Check for guest user in localStorage
        const guestUser = localStorage.getItem('guestUser');
        if (guestUser) {
          setUser(JSON.parse(guestUser));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const appUser = firebaseUserToAppUser(userCredential.user);
      setUser(appUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${appUser.name || appUser.username}!`,
      });
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : error.message;
      
      setError(new Error(errorMessage));
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      const appUser = firebaseUserToAppUser(userCredential.user);
      appUser.name = name; // Ensure the name is set
      setUser(appUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome to EcoVision, ${name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.message;
      
      setError(new Error(errorMessage));
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const userCredential = await signInWithPopup(auth, googleProvider);
      const appUser = firebaseUserToAppUser(userCredential.user);
      setUser(appUser);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${appUser.name || appUser.username}!`,
      });
    } catch (error: any) {
      const errorMessage = error.code === 'auth/popup-closed-by-user'
        ? 'Login was cancelled'
        : error.message;
      
      setError(new Error(errorMessage));
      toast({
        title: "Google login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      localStorage.removeItem('guestUser');
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      setError(new Error(error.message));
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      
      // Configure the password reset email with action code settings
      const actionCodeSettings = {
        url: window.location.origin + '/auth',
        handleCodeInApp: false,
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      
      toast({
        title: "Password reset email sent",
        description: `Check your email (${email}) for password reset instructions. Don't forget to check your spam/junk folder.`,
      });
    } catch (error: any) {
      let errorMessage = 'Failed to send password reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/missing-email':
          errorMessage = 'Email address is required';
          break;
        default:
          errorMessage = error.message || 'Failed to send password reset email';
      }
      
      setError(new Error(errorMessage));
      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginAsGuest = () => {
    try {
      setError(null);
      
      // Check if there's an existing guest session
      const existingGuest = localStorage.getItem('guestUser');
      if (existingGuest) {
        const guestUser = JSON.parse(existingGuest);
        setUser(guestUser);
        return;
      }

      // Create new guest user
      const guestId = uuidv4();
      const guestUser: AppUser = {
        id: `guest-${guestId}`,
        username: `guest-${guestId.substring(0, 8)}`,
        name: "Guest User",
        email: null,
        isGuest: true,
        guestId,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      setUser(guestUser);
      
      toast({
        title: "Guest session started",
        description: "You're browsing as a guest.",
      });
    } catch (error: any) {
      setError(new Error(error.message));
      toast({
        title: "Guest login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}