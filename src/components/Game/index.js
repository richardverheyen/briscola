import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { Game, Auth } from "contexts";
import QrCode from "./QrCode";

function GamePage() {
  let { data: auth } = useContext(Auth);
  let { game, quitGame, setId, isHost } = useContext(Game);
  let { id } = useParams();

  // sets the Game context with the id from the URL (for both host and oppo)
  useEffect(() => {
    setId(id);
  }, []);

  return (
    <div className="Game">
      <p>game page</p>
      <Button onClick={quitGame}>Quit</Button>

      {game && (
        <div>
          <p>game state: {game.gameState}</p>
          <p>is host: {isHost ? "true" : "false"}</p>
          {game.gameState === "lobby" ? <QrCode id={id} /> : null}
          {game.gameState === "scoreboard" ? <p>scoreboard</p> : null}
          {game.gameState === "play" ? (
            <>
              <p>the game as started</p>
              {
                isHost ? <p>you are the host, your opponent is {game.oppo}</p> : <p>you are the opposition, your host is {game.host}</p>
              }
              <p>it is {game.playersTurn === auth.uid ? "your" : "their"} turn</p>
              <div className="hand">
                Your hand: 1, 2, 3
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GamePage;
