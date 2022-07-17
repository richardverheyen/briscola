import { spritePosition } from "utils/helpers";
import "./style.scss";

function TrickView({ game, takeCards }) {
  return (
    <ul
      onClick={takeCards}
      className={`TrickView ${game.deckHeight === 0 ? "center" : ""}`}
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
