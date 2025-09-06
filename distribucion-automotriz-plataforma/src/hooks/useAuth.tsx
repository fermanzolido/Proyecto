// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  dealershipId: string | null;
}

// This interface represents the decoded ID token containing our custom claims.
interface DecodedToken {
  role?: string;
  dealershipId?: string;
  // Other standard JWT claims like exp, auth_time, etc.
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  role: null, 
  dealershipId: null 
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [dealershipId, setDealershipId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const claims = tokenResult.claims as DecodedToken;
          setRole(claims.role || null);
          setDealershipId(claims.dealershipId || null);
        } catch (error) {
          console.error("Error getting user token claims", error);
          setRole(null);
          setDealershipId(null);
        }
      } else {
        setRole(null);
        setDealershipId(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role, dealershipId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
