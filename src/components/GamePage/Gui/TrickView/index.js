import { spritePosition } from "utils/helpers";
import "./style.scss";

function TrickView({ game, takeCards }) {
  return (
    // <ul 
    //   onClick={takeCards}
    //   className={`TrickView ${game.deckHeight === 0 ? "center" : ""}`}>
        <ul 
      onClick={takeCards} 
      className="TrickView">
      {
        game?.trick?.map((card, index) => (
          <li key={index}>
            <div style={{ backgroundPosition: spritePosition(card) }}></div>
          </li>
        ))
      }
    </ul>
  );
}

export default TrickView;
