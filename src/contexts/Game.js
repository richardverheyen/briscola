import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Auth } from 'contexts';

export const Game = createContext({
  id: undefined,
  game: undefined,
  setId: () => {},
  isHost: undefined,
  quitGame: () => {}
});

function GameHooks() {
  const {data: auth} = useContext(Auth);
  let navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);
  const [id, setId] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [gameSnapshot, setGameSnapshot] = useState(undefined);

  // TODO: if you quit the game and then go back to the game url, you can't use the quitGame button anymore or view the game
  const quitGame = () => setGameSnapshot(undefined);

  useEffect(() => {
    if (id) {
      const unsubscribe = onSnapshot(
        doc(firestore, "games", id),
        (snapshot) => setGameSnapshot(snapshot)
      );
      return unsubscribe;
    }
  }, [id]);

  useEffect(() => {
    if (gameSnapshot) {
      const gameData = gameSnapshot.data();
      setGame(gameData);
      setIsHost(auth.uid === gameData.host);

    } else if (!gameSnapshot && id) {
      setGame(undefined);
      setIsHost(undefined);
      navigate('/'); 
    }
  }, [gameSnapshot]);

  return {
    id,
    setId,
    game,
    isHost,
    quitGame
  };
}

export function GameProvider({ children }) {
  const hooks = GameHooks();

  return <Game.Provider value={hooks}>{children}</Game.Provider>;
}
