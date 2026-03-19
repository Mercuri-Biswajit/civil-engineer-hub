// ─── Auth Context (No-op — no login required) ────────────────────────────────
import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

// Static guest user — no Firebase, no login needed
const GUEST_USER = {
  displayName: 'Guest',
  email: '',
  photoURL: null,
  uid: 'local-user',
};

export function AuthProvider({ children }) {
  const value = {
    user: GUEST_USER,
    loading: false,
    isAdmin: false,
    signOut: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
