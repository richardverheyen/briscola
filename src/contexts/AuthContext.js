import { createContext, useState, useEffect } from 'react';
import {  signInAnonymously } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from 'utils/firebase';
import { promptSetUsername } from "utils/toast";

export const Auth = createContext({
  auth: {},
  user: undefined,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  openUsernameModal: false,
  setOpenUsernameModal: () => {}
});

function AuthHooks() {
  const [auth, loading, error] = useAuthState(firebaseAuth);
  const [user, setUser] = useState(undefined);
  const [promptDisplayNameSent, setPromptDisplayNameSent] = useState(false);
  const [openUsernameModal, setOpenUsernameModal] = useState(false);

  if (error) {
    console.error("error logging in", {error});
  }

  useEffect(() => {
    if (auth && !promptDisplayNameSent && !auth.displayName) {
      setPromptDisplayNameSent(true);
      promptSetUsername(() => setOpenUsernameModal(true));
    }
  }, [auth]);

  const signIn = () => {
    signInAnonymously(firebaseAuth).then(result => {
      setUser(result.user);
    })
  };

  const signOut = () => {
    firebaseAuth.signOut();
  };

  return {
    auth,
    user,
    loading,
    signIn,
    signOut,
    openUsernameModal,
    setOpenUsernameModal
  };
}

export function AuthProvider({ children }) {
  const hooks = AuthHooks();

  return <Auth.Provider value={hooks}>{children}</Auth.Provider>;
}
