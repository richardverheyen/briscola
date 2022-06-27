import { useEffect, useContext } from "react";
import { Game, Auth } from "contexts";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import QrCode from "./QrCode";

function GamePage() {
  let { data: auth } = useContext(Auth);
  let { game, setId } = useContext(Game);
  let { id } = useParams();

  useEffect(() => {
    setId(id); // sets the Game context with the id from the URL (for both host and oppo)
  }, []);

  return (
    <div className="Game">
      <p>game page</p>
      <Button onClick={() => setId(undefined)}>Quit</Button>

      {game && (
        <div>
          <p>game state: {game.gameState}</p>
          <p>is host: {game.isHost ? "true" : "false"}</p>
          {game.gameState === "lobby" ? <QrCode id={id} /> : null}
          {game.gameState === "scoreboard" ? <p>scoreboard</p> : null}
          {game.gameState === "play" ? (
            <p>{game.playersTurn === auth.uid ? "your" : "their"} turn</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GamePage;
