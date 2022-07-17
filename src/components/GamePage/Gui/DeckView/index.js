import { useState, useEffect, useRef } from "react";
import { spritePosition } from "utils/helpers";
import "./style.scss";

import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { drawCardError } from "utils/toast";

function DeckView({ auth, game, gameId, deckHeight, lastCard }) {
  let [shownCards, setShownCards] = useState([]);
  let [lastAnimationUnix, setLastAnimationUnix] = useState(null);
  let deckViewEl = useRef();
  const drawCard = httpsCallable(functions, "drawCard");

  function msSinceAnimationFinished() {
    return new Date().getTime() - lastAnimationUnix - 2000;
  }

  useEffect(() => {
    setShownCards([...Array(game.deckHeight)]);
  }, []);

  useEffect(() => {
    // if there are cards to animate and there is a deckHeight change to animate / set
    if (shownCards.length === 0) {
      // the deck hasn't been initialised yet or the deck is empty
      return;
    }
    if (game.deckHeight !== shownCards.length) {
      // there has been a change to the deck height / shownCards is out of sync

      if (lastAnimationUnix) {
        // if there's an animation in progress
        function endDealAnimation() {
          setShownCards([...Array(game.deckHeight)]);
          deckViewEl.current.classList.remove("animate", "reverse");
          setLastAnimationUnix(null);
        }

        if (msSinceAnimationFinished() > 0) {
          endDealAnimation();
        } else {
          setTimeout(endDealAnimation, -1 * msSinceAnimationFinished() + 10);
        }
      } else {
        // start the new reverse animation
        deckViewEl.current.classList.add("animate", "reverse");

        setTimeout(() => {
          setShownCards([...Array(game.deckHeight)]);
          deckViewEl.current.classList.remove("animate", "reverse");
        }, 2000);
      }
    }
  }, [game]);

  async function handleDrawCard() {
    if (
      deckViewEl.current.classList.contains("animate") ||
      game.currentPlayersTurn !== auth.uid ||
      game.gameState !== "draw"
    ) {
      // prevent unnecessary network requests
      return;
    }

    deckViewEl.current.classList.add("animate");
    // start animation. the animate class is removed in the useEffect Hook once
    // 2000 ms have elapsed (tracked by lastAnimationUnix)

    setLastAnimationUnix(new Date().getTime());
    drawCard({ gameId }).catch((error) => {
      console.error("Pick Up Failed", { error });
      drawCardError(game);
    });
  }

  return (
    <ul ref={deckViewEl} className={`DeckView`}>
      {shownCards.map((card, i, arr) => (
        <li
          className="transform-point"
          key={i}
          onClick={(e) => handleDrawCard(e, i)}
        >
        <div 
          style={{
            animationDelay: `${arr.length - i - 1}s`,
            transform: `translateZ(${i}px) rotateX(45deg)`,
            transformOrigin: `50% calc(50% + var(--deck-bottom)) -${i}px`,
            backgroundPosition: i === 0 ? spritePosition(lastCard) : "",
          }}/>
        </li>
      ))}
    </ul>
  );
}

export default DeckView;
