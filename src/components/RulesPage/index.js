import { useNavigate } from "react-router-dom";
import "./style.scss";

function RulesPage() {
  const navigate = useNavigate();

  return (
    <main id="RulesPage">
      <div className="gutters">
        <h1>Rules</h1>
        <h2>From <a href="https://en.wikipedia.org/wiki/Briscola">Wikipedia</a></h2>
        <p>Briscola is a Mediterranean trick-taking, Ace-Ten card game for two to six players played with a standard Italian 40-card deck.</p>
        <p>Players hold 3 cards in their hand, and take turns playing one card each per trick.</p>
        <p>After the deck is shuffled, each player is dealt three cards. The next card is placed face up on the playing surface, and the remaining deck is placed face down, sometimes covering half of the up-turned card. This card is the Briscola, and represents the trump suit for the game.</p>
        <p>The deal, and game play itself, proceeds counter-clockwise.</p>
        <p>The player to the right of the dealer leads the first hand (or trick) by playing one card face up on the playing surface. Each player subsequently plays a card in turn, until all players have played one card.</p>
        <p>The winner of that hand is determined as follows:</p>
        <ul>
          <li>if any briscola (trump) has been played, the player who played the highest valued trump wins</li>
          <li>if no briscole (trumps) have been played, the player who played the highest card of the lead suit wins</li>
        </ul>
        <p>Unlike other trump card games, players are not required to follow suit, that is, to play the same suit as the lead player.</p>
        <p>Once the winner of a trick is determined, that player collects the played cards, and places them face down in a pile.</p>
        <p>Then, each player draws a card from the remaining deck, starting with the player who won the trick, proceeding counter-clockwise. Note that the last card collected in the game should be the up-turned Briscola. The player who won the trick leads the next hand. During game play and only before the next to the last hand is played, a player who draws the card with the seven of trump can take the "briscola". This may be done only if the player has won a hand. Before the last hand, people in the same team can look at each other's cards.</p>
        <p className="back" onClick={() => navigate(-1)}>Go Back</p>        
      </div>
    </main>
  );
}

export default RulesPage;
