import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { Auth } from "contexts";

export const User = createContext(undefined);

function UserHooks() {
  const auth = useContext(Auth);
  const [user, setUser] = useState(undefined);
  const [userSnapshot, setUserSnapshot] = useState(undefined);

  useEffect(() => {
    if (auth.data) {
      const unsubscribe = onSnapshot(
        doc(firestore, "users", auth.data.uid),
        (snapshot) => setUserSnapshot(snapshot)
      );
      return unsubscribe;
    }
  }, [auth]);

  useEffect(() => {
    if (userSnapshot) {
      setUser(userSnapshot.data());
    }
  }, [userSnapshot]);

  return user;
}

export function UserProvider({ children }) {
  const hooks = UserHooks();

  return <User.Provider value={hooks}>{children}</User.Provider>;
}
