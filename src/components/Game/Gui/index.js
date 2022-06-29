import { useContext } from "react";
import { Hand, Auth, Game } from "contexts";

import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

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
        if (game.gameState !== "play") {
          toast.error("You can't play a card right now");
        } else {
          toast.error("It's not your turn to play");
        }
        console.error("Play Card Failed", { err });
      });
  };

  const handlePickUp = () => {
    drawCard({ gameId })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        if (game.gameState !== "draw") {
          toast.error("You can't draw a card right now");
        } else {
          toast.error("It's not your turn to draw");
        }

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
        if (game.gameState !== "draw") {
          toast.error("These aren't yours to take");
        }

        console.error("Pick Up Failed", { err });
      });
  };

  return (
    <div className="Gui">
      <p>You're player {auth.uid}</p>
      <p>
        It's <b>{game.currentPlayersTurn === auth.uid ? "your" : "their"}</b>{" "}
        turn to <b>{game.gameState}</b>
      </p>

      <TrickView game={game} takeCards={handleTakeCards} />

      {game.deckHeight > 0 ? (
        <DeckView
          deckHeight={game.deckHeight}
          lastCard={game.lastCard}
          pickUp={handlePickUp}
        />
      ) : null}

      <HandView cards={cards} selectCard={handleSelectCard} />
    </div>
  );
}

export default Gui;
