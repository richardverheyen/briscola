import "./style.scss";
import { spritePosition } from "utils/helpers";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { playCardError } from "utils/toast";

function HandView({ game, gameId, cards }) {

  const playCard = httpsCallable(functions, "playCard");

  const handleSelectCard = (e) => {
    const cardEl = e.target;
    
    if (cards.length <= 2 && game.deckHeight !== 0) {
      return;
    }

    const card = Number(cardEl.dataset.card);
    cardEl.classList.add('clicked');

    playCard({ gameId, card })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        playCardError(game);
        console.error("Play Card Failed", { err });
      }).finally(() => {
        cardEl.classList.remove('clicked');
      });
  };

  return (
    <ul id="HandView">
      {cards?.map((card, index) => (
        <li
          key={index}
          data-card={card}
          onClick={handleSelectCard}
          style={{ backgroundPosition: spritePosition(card) }}
        />
      ))}
    </ul>
  );
}

export default HandView;
