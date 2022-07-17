import "./style.scss";
import { spritePosition } from "utils/helpers";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { playCardError } from "utils/toast";

import { useContext, useEffect } from "react";
import { Hand, Game, AnimationState } from "contexts";

function HandView() {
  let { game, id: gameId } = useContext(Game);
  let { playCardAnimationRunning, setPlayCardAnimationRunning} = useContext(AnimationState);
  let handContext = useContext(Hand);
  let cards = handContext?.cards;
  const playCard = httpsCallable(functions, "playCard");

  useEffect(() => {
      document.querySelectorAll(".card-played").forEach(card => {
        card.classList.remove("card-played");
      })
  }, [cards]);

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("card-played") && playCardAnimationRunning) {
      setPlayCardAnimationRunning(false);
    }
  };

  const handleSelectCard = async (e) => {
    const cardEl = e.target;

    if (cards.length <= 2 && game.deckHeight !== 0) {
      return;
    }

    const card = Number(cardEl.dataset.card);

    // this clicked class triggers the playCard animation and is removed by the onAnimationEnd handler
    // The sideEffect of this is that Hand.playCardAnimationRunning can prevent updating the Hand context
    // So the playCard animation always has time to complete.
    cardEl.classList.add("card-played");
    setPlayCardAnimationRunning(true);

    playCard({ gameId, card })
      .then((res) => {
        console.log("success!", { res });
      })
      .catch((err) => {
        playCardError(game);
        console.error("Play Card Failed", { err });
      });
  };

  return (
    <ul id="HandView">
      {cards?.map((card, index) => (
        <li
          key={index}
          data-card={card}
          onClick={handleSelectCard}
          onAnimationEnd={handleAnimationEnd}
          style={{ backgroundPosition: spritePosition(card) }}
        />
      ))}
    </ul>
  );
}

export default HandView;
