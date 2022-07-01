import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { cardToScore, cardToName } from "utils/helpers";
import { Game } from "contexts";
import QrCode from "./QrCode";
import Gui from "./Gui";

function GamePage() {
  let { game, quitGame, setId } = useContext(Game);
  let { id } = useParams();

  // sets the Game context with the id from the URL (for both host and oppo)
  useEffect(() => {
    setId(id);
  }, []);

  if (!game) {
    return <p>loading</p>;
  }

  return (
    <main className="Game">
      <div className="gutters">
        {game?.gameState === "lobby" ? <QrCode /> : <Gui />}
        {game?.gameState === "scoreboard" ? (
          <div>
            <p>{game.host} won these cards</p>
            <p>Total: {game[game.host].reduce((acc, card) => acc + cardToScore(card), 0)}</p>
            <ul>
              {game[game.host]?.map((card, index) => {
                <li key={index}>{cardToScore(card)} - {cardToName(card)}</li>;
              })}
            </ul>

            <p>{game.oppo} won these cards</p>
            <p>Total: {game[game.oppo].reduce((acc, card) => acc + cardToScore(card), 0)}</p>
            <ul>
              {game[game.oppo]?.map((card, index) => {
                <li key={index}>{cardToScore(card)} - {cardToName(card)}</li>;
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default GamePage;
