import { spritePosition } from "utils/helpers";
import "./style.scss";

function TrickView({ game, takeCards }) {
  return (
    <ul
      onClick={takeCards}
      className={`TrickView ${game.deckHeight === 0 ? "center" : ""}`}
    >
      {game?.trick?.map((card, index) => (
        <li key={index} style={{ backgroundPosition: spritePosition(card) }} />
      ))}
    </ul>
  );
}

export default TrickView;
