import { useEffect, useContext } from "react";
import { Game, Auth } from "contexts";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { firestore } from "utils/firebase";
import { doc, getDoc } from "firebase/firestore";

function GamePage() {
  let { id } = useParams();
  let { game, setId } = useContext(Game);
  let { data } = useContext(Auth);

  useEffect(() => {
    console.log("useEffect:", { id });
    setId(id);
  }, []);

  const createGame = () => {};

  return (
    <div className="Game">
      <p>game page</p>
      <Button onClick={() => setId(undefined)}>Quit</Button>

      {game && (
        <div>
          <p>game state: {game.gameState}</p>
          {game.gameState === "lobby" ? <p>qr code</p> : null}
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
