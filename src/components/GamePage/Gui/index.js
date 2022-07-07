import "./style.scss";
import { useContext } from "react";
import { Hand, Auth, Game } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { takeCardError } from "utils/toast";

import HandView from "./HandView";
import DeckView from "./DeckView";
import TrickView from "./TrickView";

function Gui() {
  let { game, isHost, id: gameId } = useContext(Game);
  let { auth } = useContext(Auth);
  let handContext = useContext(Hand);
  let cards = handContext?.cards;

  const takeCards = httpsCallable(functions, "takeCards");

  const handleTakeCards = () => {
    if (game.deckHeight > 0) {
      return;
    }

    takeCards({ gameId })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        takeCardError(game);
        console.error("Pick Up Failed", { err });
      });
  };

  
  function playerWhoseTurnItIs() {
    if (game.currentPlayersTurn === auth.uid) {
      return "your";
    } else if (isHost && game?.oppoDisplayName) {
      return game?.oppoDisplayName + '\'s';
    } else if (!isHost && game?.hostDisplayName) {
      return game?.hostDisplayName + '\'s';
    } else {
      return "their";
    }
  }
  if (!game || !cards || !auth) {
    return null;
  }

  return (
    <div className="Gui">
      {game.gameState !== "scoreboard" ? (
        <h2>
          It's <b>{playerWhoseTurnItIs()}</b> turn to <b>{game.gameState}</b>
        </h2>
      ) : (
        <h2>Game over</h2>
      )}

      <div className="center">
        <TrickView game={game} takeCards={handleTakeCards} />

        <DeckView
          auth={auth}
          game={game}
          gameId={gameId}
          deckHeight={game.deckHeight}
          lastCard={game.lastCard}
        />
      </div>

      <HandView game={game} gameId={gameId} cards={cards} />
    </div>
  );
}

export default Gui;
