import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Game = createContext({
  id: undefined,
  game: undefined,
  setId: () => {}
});

function GameHooks() {
  let navigate = useNavigate();
  const [id, setId] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [gameSnapshot, setGameSnapshot] = useState(undefined);

  useEffect(() => {
    if (id) {
      console.log('setting the game id as:', {id});
      const unsubscribe = onSnapshot(
        doc(firestore, "games", id),
        (snapshot) => setGameSnapshot(snapshot)
      );
      return unsubscribe;
    } else {
      setGameSnapshot(undefined); // i'm not sure if this is right
    }
  }, [id]);

  useEffect(() => {
    if (gameSnapshot) {
      console.log('game snapshot set');
      setGame(gameSnapshot.data());
    } else {
      setGame(undefined);  // i'm not sure if this is right
      navigate('/');  // i'm not sure if this is right
    }
  }, [gameSnapshot]);

  return {
    id,
    setId,
    game
  };
}

export function GameProvider({ children }) {
  const hooks = GameHooks();

  return <Game.Provider value={hooks}>{children}</Game.Provider>;
}
