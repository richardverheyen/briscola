import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Auth, Game, AnimationState } from "contexts";

export const Hand = createContext({
  cards: []
});

function HandHooks() {
  const { playCardAnimationRunning } = useContext(AnimationState);
  const { auth } = useContext(Auth);
  const { game } = useContext(Game);

  const [hand, setHand] = useState({
    cards: []
  });
  const [handSnapshot, setHandSnapshot] = useState(undefined);

  useEffect(() => {
    if (game) {
      const unsubscribe = onSnapshot(doc(firestore, "hands", auth.uid), (snapshot) =>
        setHandSnapshot(snapshot)
      );
      return unsubscribe;
    }
  }, [game]);

  useEffect(() => {
    if (playCardAnimationRunning) {
      return;
    }
    if (handSnapshot) {
      setHand(handSnapshot.data());
    }
  }, [handSnapshot, playCardAnimationRunning]);

  return hand;
}

export function HandProvider({ children }) {
  const hooks = HandHooks();

  return <Hand.Provider value={hooks}>{children}</Hand.Provider>;
}
