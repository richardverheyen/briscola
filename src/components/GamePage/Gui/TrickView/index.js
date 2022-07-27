import { useState, useEffect, useRef, useContext } from "react";
import { Game } from "contexts";
import { spritePosition } from "utils/helpers";
import "./style.scss";

function TrickView({ takeCards }) {
  const { game, isTurn } = useContext(Game);
  let [promptTimeout, setPromptTimeout] = useState(undefined);
  let [prompt, setPrompt] = useState(false);
  let trickViewEl = useRef();

  useEffect(() => {
    setPrompt(false);
    if (game.gameState === "draw" && isTurn && game.deckHeight === 0) {  
      window.clearTimeout(promptTimeout);
      setPromptTimeout(undefined);
      const timeout = window.setTimeout(() => {
        setPrompt(true);
        document.title = `Briscola ❗`;
      }, 5000);

      setPromptTimeout(timeout);
    } else if (promptTimeout) {
      window.clearTimeout(promptTimeout);
    }
  }, [game, isTurn]);

  return (
    <ul
      ref={trickViewEl}
      onClick={takeCards}
      className={`TrickView ${game.deckHeight === 0 ? "center" : ""} ${prompt ? "prompt" : ""}`}
    >
      {game?.trick?.map((card, i) => (
        <li key={i} className="transform-point">
          <div
            style={{
              backgroundPosition: spritePosition(card),
              transformOrigin: `50% calc(50% + var(--trick-bottom)) -${i}px`,
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export default TrickView;
