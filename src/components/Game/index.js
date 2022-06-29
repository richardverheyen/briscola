import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { cardNameMapping } from "utils/helpers";
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

  function cardToName(num) {
    return cardNameMapping[num];
  }

  if (!game) {
    return <Button onClick={quitGame}>Quit</Button>;
  }

  return (
    <main className="Game">
      <div className="gutters">
        {game?.gameState === "lobby" ? <QrCode /> : <Gui />}
        {game?.gameState === "scoreboard" ? (
          <div>
            <p>{game.host} won these cards</p>
            <ul>
              {game[game.host]?.map((card, index) => {
                <li key={index}>{cardToName(card)}</li>;
              })}
            </ul>

            <p>{game.oppo} won these cards</p>
            <ul>
              {game[game.oppo]?.map((card, index) => {
                <li key={index}>{cardToName(card)}</li>;
              })}
            </ul>
          </div>
        ) : null}
        <div>
          <Button onClick={quitGame}>Quit</Button>
        </div>
      </div>
    </main>
  );
}

export default GamePage;
