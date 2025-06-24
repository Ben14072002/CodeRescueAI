import { useState, useEffect } from "react";
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      console.log('⚠️ Firebase auth not available, skipping auth state listener');
      setLoading(false);
      return;
    }

    console.log('🔄 Setting up Firebase auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No user');

      if (firebaseUser) {
        try {
          console.log('📝 Registering user in backend:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });

          // Register user in our backend
          const response = await fetch('/api/register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
            })
          });

          if (response.ok) {
            const data = await response.json();
            setUser(firebaseUser);
            console.log('✅ User registered/logged in successfully:', data.user);
          } else {
            console.error('❌ User registration failed:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Error during user registration:', error);
        }
      } else {
        setUser(null);
        console.log('👋 User logged out');
      }
      setLoading(false);
    });

    // Check for redirect result on page load
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Google sign-in successful via redirect');
          // Clear the redirect flag
          sessionStorage.removeItem('googleAuthRedirect');
        } else {
          // Check if we were expecting a redirect result
          const wasRedirectInitiated = sessionStorage.getItem('googleAuthRedirect');
          if (wasRedirectInitiated) {
            console.log('Redirect was initiated but no result found');
            sessionStorage.removeItem('googleAuthRedirect');
          }
        }
      })
      .catch((error) => {
        console.error('Google sign-in redirect error:', error);
        sessionStorage.removeItem('googleAuthRedirect');
        
        // Don't set error for common redirect issues that are user-initiated
        if (error.code !== 'auth/popup-closed-by-user' && 
            error.code !== 'auth/user-cancelled') {
          setError(`Authentication failed: ${error.message}`);
        }
      });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      return result;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      // Check if we're on mobile or in an environment where popups might not work
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('Mobile device detected, using redirect flow');
        // Store a flag to indicate we initiated the redirect
        sessionStorage.setItem('googleAuthRedirect', 'true');
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      
      // Desktop: try popup first, fallback to redirect if popup fails
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result;
      } catch (popupError: any) {
        console.log('Popup failed:', popupError.code, popupError.message);
        
        // If popup is blocked, cancelled, or unauthorized domain, use redirect
        if (popupError.code === 'auth/unauthorized-domain' || 
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('Using redirect flow as fallback');
          // Store a flag to indicate we initiated the redirect
          sessionStorage.setItem('googleAuthRedirect', 'true');
          await signInWithRedirect(auth, googleProvider);
          return null;
        }
        throw popupError;
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    isAuthenticated: !!user
  };
}