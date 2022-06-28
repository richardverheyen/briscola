import { cardNameMapping } from "utils/helpers";
import "./style.scss";

function HandView({ cards, selectCard }) {
  function cardToImage(card) {
    return cardNameMapping[card];
  }

  function spritePosition(num) {
    const suitId = Math.floor(num / 10);
    const valueId = num % 10;
    return `${valueId * -130.5}px ${suitId * -226}px`;
  }

  return (
    <ul className="HandView">
      {cards.map((card, index) => {
        return (
          <li className="card-view" key={index}>
            <div onClick={() => selectCard(card)} style={{backgroundPosition: spritePosition(card)}}>
              {/* {cardToImage(card)} */}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default HandView;
