import './style.scss';
import { useContext } from "react";
import { Hand, Auth, Game } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { playCardError, takeCardError } from "utils/toast";

import HandView from "./HandView";
import DeckView from "./DeckView";
import TrickView from "./TrickView";

function Gui() {
  let { game, id: gameId } = useContext(Game);
  let { auth } = useContext(Auth);
  let handContext = useContext(Hand);
  let cards = handContext?.cards;

  const playCard = httpsCallable(functions, "playCard");
  const takeCards = httpsCallable(functions, "takeCards");

  const handleSelectCard = (card) => {
    playCard({ gameId, card })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        playCardError(game);
        console.error("Play Card Failed", { err });
      });
  };

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

  if (!game || !cards) {
    return null;
  }

  return (
    <div className="Gui">
      <h2>
        It's <b>{game.currentPlayersTurn === auth.uid ? "your" : "their"}</b>{" "}
        turn to <b>{game.gameState}</b>
      </h2>

      <div className="center">
        <TrickView game={game} takeCards={handleTakeCards} />

        {game.deckHeight > 0 ? (
          <DeckView
            auth={auth}
            game={game}
            gameId={gameId}
            deckHeight={game.deckHeight}
            lastCard={game.lastCard}
          />
        ) : null}
      </div>
      

      <HandView cards={cards} selectCard={handleSelectCard} />
    </div>
  );
}

export default Gui;
