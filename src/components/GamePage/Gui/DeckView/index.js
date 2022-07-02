import { spritePosition } from "utils/helpers";
import "./style.scss";

function DeckView({ deckHeight, lastCard, pickUp }) {
  return (
    <ul className="DeckView" onClick={pickUp}>
      {[...Array(deckHeight).keys()].map((card, index) => (
        <li key={index}>
          <div
            tabIndex={index === deckHeight - 1 ? "0" : "-1"}
            style={{
              backgroundPosition: index === 0 ? spritePosition(lastCard) : "",
            }}
          ></div>
        </li>
      ))}
    </ul>
  );
}

export default DeckView;
