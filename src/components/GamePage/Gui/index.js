import './style.scss';
import { useContext } from "react";
import { Hand, Auth, Game } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { playCardError, drawCardError, takeCardError } from "utils/toast";

import HandView from "./HandView";
import DeckView from "./DeckView";
import TrickView from "./TrickView";

function Gui() {
  let { game, id: gameId } = useContext(Game);
  let { auth } = useContext(Auth);
  let { cards } = useContext(Hand);

  const playCard = httpsCallable(functions, "playCard");
  const drawCard = httpsCallable(functions, "drawCard");
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

  const handlePickUp = () => {
    drawCard({ gameId })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        drawCardError(game);
        console.error("Pick Up Failed", { err });
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

  return (
    <div className="Gui">
      <span>
        It's <b>{game.currentPlayersTurn === auth.uid ? "your" : "their"}</b>{" "}
        turn to <b>{game.gameState}</b>
      </span>

      <div className="center">
        <TrickView game={game} takeCards={handleTakeCards} />

        {game.deckHeight > 0 ? (
          <DeckView
            deckHeight={game.deckHeight}
            lastCard={game.lastCard}
            pickUp={handlePickUp}
          />
        ) : null}
      </div>
      

      <HandView cards={cards} selectCard={handleSelectCard} />
    </div>
  );
}

export default Gui;
