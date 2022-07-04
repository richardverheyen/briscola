import "./style.scss";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { Game } from "contexts";
import QrCode from "./QrCode";
import Gui from "./Gui";
import Scoreboard from "./Scoreboard";

function GamePage() {
  let { id } = useParams();
  let { game, setId, isHost } = useContext(Game);
  let [showScoreboard, setShowScoreboard] = useState(true);

  // sets the Game context with the id from the URL (for both host and oppo)
  useEffect(() => {
    setId(id);
  }, []);

  if (!game) {
    return null;
  }

  return (
    <main id="GamePage">
      <div className="gutters">
        {game?.gameState === "scoreboard" ? (
          <>
            <Button className="scoreboard-button" variant="outlined" onClick={() => setShowScoreboard(true)}>
              Show Scoreboard
            </Button>
            <Scoreboard
              game={game}
              showScoreboard={showScoreboard}
              handleClose={() => setShowScoreboard(false)}
            />
          </>
        ) : null}

        {game?.gameState === "lobby" && isHost ? <QrCode /> : null}
        {game?.gameState !== "lobby" ? <Gui /> : null}
      </div>
    </main>
  );
}

export default GamePage;
