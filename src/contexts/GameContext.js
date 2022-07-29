import { useContext, useState, createContext, useEffect } from "react";
import { firestore } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Auth, AnimationState } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

export const Game = createContext({
  id: undefined,
  game: undefined,
  setId: () => {},
  isHost: undefined,
  isTurn: undefined,
  enemyId: undefined,
  enemyName: undefined,
  quitGame: () => {},
});

function GameHooks() {
  let { playCardAnimationRunning } = useContext(AnimationState);
  const { auth } = useContext(Auth);
  let navigate = useNavigate();
  const [sprite, setSprite] = useState(window.localStorage.getItem("sprite") || "napoletane");
  const [isHost, setIsHost] = useState(false);
  const [isTurn, setIsTurn] = useState(false);
  const [enemyId, setEnemyId] = useState(false);
  const [enemyName, setEnemyName] = useState(false);
  const [id, setId] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [gameSnapshot, setGameSnapshot] = useState(undefined);

  const gameInteract = httpsCallable(functions, "gameInteract");

  // TODO: if you quit the game and then go back to the game url, you can't use the quitGame button anymore or view the game
  const quitGame = () => setGameSnapshot(undefined);

  function updateSprite(str) {
    window.localStorage.setItem("sprite", str);
    setSprite(str);
  }

  useEffect(() => {
    if (id) {
      const unsubscribe = onSnapshot(doc(firestore, "games", id), (snapshot) =>
        setGameSnapshot(snapshot)
      );
      return unsubscribe;
    }
  }, [id]);

  useEffect(() => {
    if (playCardAnimationRunning) {
      return;
    }
    if (gameSnapshot) {
      const gameData = gameSnapshot.data();

      if (!game && auth.uid !== gameData.host) {
        // it's a new game for this session/device
        gameInteract({ id, func: "joinGame" })
          .then((res) => {
            console.log("Joined game as opposition!", { res });
          })
          .catch((err) => {
            console.error("Join Game Failed", { err });
          });
      }

      setGame(gameData);

      const newIsHost = gameData.host === auth.uid;
      const newIsTurn = gameData.currentPlayersTurn === auth.uid;
      const newEnemyId = newIsHost ? gameData.oppo : gameData.host;
      const newEnemyName = newIsHost ? gameData.oppoDisplayName || "" : gameData.hostDisplayName || "";

      setIsHost(newIsHost);
      setIsTurn(newIsTurn);
      setEnemyId(newEnemyId);
      setEnemyName(newEnemyName);

    } else if (!gameSnapshot && id) {
      setGame(undefined);
      setIsHost(undefined);
      navigate("/");
      document.title = "Briscola";
    }
  }, [gameSnapshot, playCardAnimationRunning]);

  return {
    id,
    setId,
    game,
    isHost,
    isTurn,
    enemyId,
    enemyName,
    quitGame,
    updateSprite,
    sprite
  };
}

export function GameProvider({ children }) {
  const hooks = GameHooks();

  return <Game.Provider value={hooks}>{children}</Game.Provider>;
}
