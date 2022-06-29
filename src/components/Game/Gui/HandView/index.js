import { spritePosition } from "utils/helpers";
import "./style.scss";

function HandView({ cards, selectCard }) {
  return (
    <ul className="HandView">
      {cards.map((card, index) => {
        return (
          <li className="card-view" key={index}>
            <div 
              tabIndex="0"
              onClick={() => selectCard(card)} style={{backgroundPosition: spritePosition(card)}}>
              {/* {cardToImage(card)} */}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default HandView;
