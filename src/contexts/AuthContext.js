import { createContext } from 'react';

import {  signInAnonymously } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from 'utils/firebase';

export const Auth = createContext({
  auth: {},
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

function AuthHooks() {
  const [auth, loading, error] = useAuthState(firebaseAuth);

  if (error) {
    console.error("error logging in", {error});
  }

  const signIn = () => {
    signInAnonymously(firebaseAuth)
  };

  const signOut = () => {
    firebaseAuth.signOut();
  };

  return {
    auth,
    loading,
    signIn,
    signOut
  };
}

export function AuthProvider({ children }) {
  const hooks = AuthHooks();

  return <Auth.Provider value={hooks}>{children}</Auth.Provider>;
}
