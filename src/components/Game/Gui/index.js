import { useContext } from "react";
import { Hand, Auth, Game } from "contexts";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

import HandView from "./HandView";
import DeckView from "./DeckView";

function Gui() {
  let { game, id } = useContext(Game);
  let { auth } = useContext(Auth);
  let { cards } = useContext(Hand);

  const playCard = httpsCallable(functions, "playCard");

  const handleCreateGame = () => {
    playCard({ gameId: id, card: cards[0] })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        console.error("Create Game Failed", { err });
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

      <DeckView 
        deckHeight={game.deckHeight}
        lastCard={game.lastCard}

        />
      <HandView
        cards={cards}
        selectCard={(card) => {
          console.log("play card ", card);
        }}
      />
    </div>
  );
}

export default Gui;
