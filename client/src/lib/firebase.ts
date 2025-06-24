import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug Firebase configuration
console.log('🔥 Firebase Config Check:', {
  hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined',
  hasProjectId: !!firebaseConfig.projectId && firebaseConfig.projectId !== 'undefined',
  hasAppId: !!firebaseConfig.appId && firebaseConfig.appId !== 'undefined',
  authDomain: firebaseConfig.authDomain,
  configValues: {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
    projectId: firebaseConfig.projectId || 'MISSING',
    appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 10)}...` : 'MISSING'
  }
});

// Check if essential config is missing
const missingConfig = [];
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') missingConfig.push('VITE_FIREBASE_API_KEY');
if (!firebaseConfig.projectId || firebaseConfig.projectId === 'undefined') missingConfig.push('VITE_FIREBASE_PROJECT_ID');
if (!firebaseConfig.appId || firebaseConfig.appId === 'undefined') missingConfig.push('VITE_FIREBASE_APP_ID');

if (missingConfig.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingConfig);
  console.error('Please set these in your Replit Secrets or .env file');
}

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Create mock objects to prevent app crashes
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };

// Configure Google provider
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    // Add parameters to help with mobile compatibility
    'include_granted_scopes': 'true',
    'access_type': 'online'
  });
}