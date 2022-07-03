import { spritePosition } from "utils/helpers";
import "./style.scss";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { drawCardError } from "utils/toast";

function DeckView({ auth, game, gameId, deckHeight, lastCard }) {
  const drawCard = httpsCallable(functions, "drawCard");

  function handleDrawCard(e, index) {
    const el = e.target;
    if (el.classList.contains('clicked')) {
      return;
    }

    if (index === deckHeight - 1) {
      el.classList.add('clicked');

      drawCard({ gameId })
        .then((res) => {
          console.log("success!", { res });
        })
        .catch((err) => {
          drawCardError(game);
          console.error("Pick Up Failed", { err });
          el.classList.remove('clicked');
        });
    }
  }

  return (
    <ul className={`DeckView ${game.currentPlayersTurn === auth.uid && game.gameState === "draw" ? 'active' : ""}`}>
      {[...Array(deckHeight).keys()].map((card, index) => (
        <li key={index}>
          <div
            tabIndex={index === deckHeight - 1 ? "0" : "-1"}
            style={{
              backgroundPosition: index === 0 ? spritePosition(lastCard) : "",
            }}
            onClick={e => handleDrawCard(e, index)}
          ></div>
        </li>
      ))}
    </ul>
  );
}

export default DeckView;
