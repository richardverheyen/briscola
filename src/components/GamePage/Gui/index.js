import "./style.scss";
import { useContext } from "react";
import { Auth, Game } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { takeCardError } from "utils/toast";

import StatusView from "./StatusView";
import HandView from "./HandView";
import DeckView from "./DeckView";
import TrickView from "./TrickView";

function Gui() {
  let { game, id: gameId } = useContext(Game);
  let { auth } = useContext(Auth);

  const gameInteract = httpsCallable(functions, "gameInteract");

  const handleTakeCards = () => {
    if (game.deckHeight > 0) {
      return;
    }

    gameInteract({ gameId, func: "takeCards" })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        takeCardError(game);
        console.error("Pick Up Failed", { err });
      });
  };

  if (!game || !auth) {
    return null;
  }

  return (
    <div className={`Gui`}>
      <table className="transform-point" />
      <StatusView />
      <TrickView game={game} takeCards={handleTakeCards} />
      <DeckView />
      <HandView />
    </div>
  );
}

export default Gui;
