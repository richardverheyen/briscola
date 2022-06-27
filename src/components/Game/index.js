import { useEffect, useContext } from "react";
import { Game, Auth } from "contexts";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import QrCode from "./QrCode";

function GamePage() {
  let { id } = useParams();
  let { game, setId } = useContext(Game);
  let { data } = useContext(Auth);

  useEffect(() => {
    setId(id);
  }, []);

  return (
    <div className="Game">
      <p>game page</p>
      <Button onClick={() => setId(undefined)}>Quit</Button>

      {game && (
        <div>
          <p>game state: {game.gameState}</p>
          {game.gameState === "lobby" ? <QrCode id={id} /> : null}
          {game.gameState === "scoreboard" ? <p>scoreboard</p> : null}
          {game.gameState === "play" ? (
            <p>{game.playersTurn === data.uid ? "your" : "their"} turn</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GamePage;
