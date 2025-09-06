// src/services/authService.ts
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from '../config/firebase';

// Sign in function
const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out function
const signOut = () => {
  return firebaseSignOut(auth);
};

// Listen for auth state changes
const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { signIn, signOut, onAuthChange };
