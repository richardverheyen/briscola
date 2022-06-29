import { useContext } from "react";
import { Hand, Auth, Game } from "contexts";

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

  const handleSelectCard = (card) => {
    playCard({ gameId, card })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        console.error("Play Card Failed", { err });
      });
  };

  return (
    <div className="Gui">
      <p>You're player {auth.uid}</p>

      <ul>
        <li>It's your turn to play a card</li>
        <li>You played king of cups</li>
        <li>Opponent played 4 of swords</li>
        <li>It's your turn to draw from the deck</li>
        <li>Waiting for Opponent</li>
      </ul>

      <TrickView 
        trick={game.trick}
        />

      <DeckView 
        deckHeight={game.deckHeight}
        lastCard={game.lastCard}
        />
      <HandView
        cards={cards}
        selectCard={handleSelectCard}
      />
    </div>
  );
}

export default Gui;
