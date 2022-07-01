import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { yourTurnToDraw, scoreboardShown } from "utils/toast";
import { useNavigate } from "react-router-dom";
import { Auth } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

export const Game = createContext({
  id: undefined,
  game: undefined,
  setId: () => {},
  isHost: undefined,
  quitGame: () => {},
});

function GameHooks() {
  const { auth } = useContext(Auth);
  let navigate = useNavigate();
  const [isPlayer, setIsPlayer] = useState(false);
  const [id, setId] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [gameSnapshot, setGameSnapshot] = useState(undefined);

  const joinGame = httpsCallable(functions, "joinGame");

  // TODO: if you quit the game and then go back to the game url, you can't use the quitGame button anymore or view the game
  const quitGame = () => setGameSnapshot(undefined);

  useEffect(() => {
    if (id) {
      const unsubscribe = onSnapshot(doc(firestore, "games", id), (snapshot) =>
        setGameSnapshot(snapshot)
      );
      return unsubscribe;
    }
  }, [id]);

  useEffect(() => {
    if (gameSnapshot) {
      const gameData = gameSnapshot.data();

      if (!game) {
        // it's a new game for this session/device
        initEgo(gameData);
      }

      yourTurnToDraw(gameData, auth.uid);
      scoreboardShown(gameData, auth.uid);

      setGame(gameData);
    } else if (!gameSnapshot && id) {
      setGame(undefined);
      setIsPlayer(undefined);
      navigate("/");
    }
  }, [gameSnapshot]);

  function initEgo(gameData) {
    if (auth.uid === gameData.host) {
      setIsPlayer(true);
    } else {
      joinGame({ id })
        .then((res) => {
          console.log("Joined game as opposition!", { res });
        })
        .catch((err) => {
          console.error("Join Game Failed", { err });
        });
    }
  }

  return {
    id,
    setId,
    game,
    isPlayer,
    quitGame,
  };
}

export function GameProvider({ children }) {
  const hooks = GameHooks();

  return <Game.Provider value={hooks}>{children}</Game.Provider>;
}
