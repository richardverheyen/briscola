import { useState, createContext } from 'react';

import {  signInAnonymously } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';

export const Auth = createContext({
  data: {},
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

function AuthHooks() {
  const [data, loading, error] = useAuthState(auth);

  const signIn = async () => {
    const success = (data) => {
      console.log('sign in success');
    };
    const failure = (error) => console.log({ error });
    signInAnonymously(auth)
      .then(success)
      .catch(failure)
  };

  const signOut = () => {
    auth.signOut();
  };

  return {
    data,
    loading,
    signIn,
    signOut
  };
}

export function AuthProvider({ children }) {
  const hooks = AuthHooks();

  return <Auth.Provider value={hooks}>{children}</Auth.Provider>;
}
