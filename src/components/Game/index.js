import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";
import Button from "@mui/material/Button";

import { Game, Auth } from "contexts";
import QrCode from "./QrCode";

function GamePage() {
  let { data: auth } = useContext(Auth);
  let { game, quitGame, setId, isHost } = useContext(Game);
  let { id } = useParams();

  const joinGame = httpsCallable(functions, 'joinGame');

  useEffect(() => {
    setId(id); // sets the Game context with the id from the URL (for both host and oppo)
  }, []);

  useEffect(() => {
    if (game && !isHost) {
      console.log('joining the game');

      joinGame({id}).then((res) => {
        console.log('successfully joined game!', {res})
      })
      .catch((err) => {
        console.error("Join Game Failed", { err });
      })
      .finally(() => {
        // setIsLoading(true);
      });
    }
  }, [game, isHost]);

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
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GamePage;
