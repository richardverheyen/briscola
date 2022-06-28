import { useContext } from "react";
import { Hand, Auth } from "contexts";

function Player({ game }) {
  let { auth } = useContext(Auth);
  let { cards } = useContext(Hand);

  return (
    <div className="Player">
      <p>You're player {auth.uid}</p>

      <div className="hand">
        <span>Your hand:&nbsp;</span>
        {cards?.map((card, index) => (
          <span key={index}>{card}{cards.length !== index + 1 && <>,&nbsp;</>}</span>
        ))}
      </div>

      <p className="briscola">Brisc is: Coins</p>
      <p className="deck-height">Deck is 22 high</p>

      <ul>
        <li>It's your turn to play a card</li>
        <li>You played king of cups</li>
        <li>Opponent played 4 of swords</li>
        <li>It's your turn to draw from the deck</li>
        <li>Waiting for Opponent</li>
      </ul>

      <div>
        <button>Draw from deck</button>
      </div>
      <button>play card 1</button>
      <button>play card 2</button>
      <button>play card 3</button>

    </div>
  );
}

export default Player;
