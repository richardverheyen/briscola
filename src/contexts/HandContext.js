import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Auth, Game } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

export const Hand = createContext();

function HandHooks() {
  const { auth } = useContext(Auth);
  const { game } = useContext(Game);

  const [hand, setHand] = useState({
    cards: [],
  });
  const [handSnapshot, setHandSnapshot] = useState(undefined);

  useEffect(() => {
    if (game) {
      const unsubscribe = onSnapshot(
        doc(firestore, "hands", auth.uid),
        (snapshot) => setHandSnapshot(snapshot)
      );
      return unsubscribe;
    }
  }, [game]);

  useEffect(() => {
    if (handSnapshot) {
      setHand(handSnapshot.data());
    }
  }, [handSnapshot]);

  return hand;
}

export function HandProvider({ children }) {
  const hooks = HandHooks();

  return <Hand.Provider value={hooks}>{children}</Hand.Provider>;
}
