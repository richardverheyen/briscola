import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { Game } from "contexts";
import QrCode from "./QrCode";
import Player from "./Player";

function GamePage() {
  let { game, quitGame, setId, isPlayer } = useContext(Game);
  let { id } = useParams();

  // sets the Game context with the id from the URL (for both host and oppo)
  useEffect(() => {
    setId(id);
  }, []);

  const gameUi = () => {
    switch (game.gameState) {
      case "lobby":
        return <QrCode />;

      case "scoreboard":
        return <p>scoreboard</p>;

      default:
        return <Player game={game} />;
    }
  };

  return (
    <div className="Game">
      {game && gameUi()}
      <div>
        <Button onClick={quitGame}>Quit</Button>
      </div>
    </div>
  );
}

export default GamePage;
