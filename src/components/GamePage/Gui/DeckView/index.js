import { useState, useEffect, useRef, useContext } from "react";
import { spritePosition } from "utils/helpers";
import "./style.scss";

import { Game, Auth } from "contexts";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import { drawCardError } from "utils/toast";

function DeckView() {
  const { game, isTurn, id: gameId} = useContext(Game);
  const { auth } = useContext(Auth);
  let [shownCards, setShownCards] = useState([]);
  let [lastAnimationUnix, setLastAnimationUnix] = useState(null);
  let [promptTimeout, setPromptTimeout] = useState(undefined);
  let deckViewEl = useRef();
  const gameInteract = httpsCallable(functions, "gameInteract");

  function msSinceAnimationFinished() {
    return new Date().getTime() - lastAnimationUnix - 2000;
  }

  useEffect(() => {
    setShownCards([...Array(game.deckHeight)]);
  }, []);

  useEffect(() => {
    deckViewEl.current.classList.remove("prompt");

    if (game.gameState === "draw" && isTurn) {
      window.clearTimeout(promptTimeout);
      setPromptTimeout(undefined);
      const timeout = window.setTimeout(() => {
        deckViewEl.current.classList.add("prompt");
        document.title = `Briscola ❗`;
      }, 5000);

      setPromptTimeout(timeout);
    } else if (promptTimeout) {
      window.clearTimeout(promptTimeout);
    }
  }, [game, isTurn]);

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

    deckViewEl.current.classList.remove("prompt");
    deckViewEl.current.classList.add("animate");
    // start animation. the animate class is removed in the useEffect Hook once
    // 2000 ms have elapsed (tracked by lastAnimationUnix)

    setLastAnimationUnix(new Date().getTime());
    gameInteract({ gameId, func: "drawCard" }).catch((error) => {
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
            transitionDelay: `${arr.length - i - 1}s`,
            transform: `translateZ(${i * 1.5}px) rotateX(45deg)`,
            transformOrigin: `50% calc(50% + var(--deck-bottom)) -${i}px`,
            backgroundPosition: i === 0 ? spritePosition(game.lastCard) : "",
          }}/>
        </li>
      ))}
    </ul>
  );
}

export default DeckView;
