import "./style.scss";
import { useEffect, useContext, useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { Game } from "contexts";
import QrCode from "./QrCode";

const Scoreboard = lazy(() => import("./Scoreboard"));
const Gui = lazy(() => import("./Gui"));

function GamePage() {
  let { id } = useParams();
  let { game, setId, isHost } = useContext(Game);
  let [showScoreboard, setShowScoreboard] = useState(true);

  // sets the Game context with the id from the URL (for both host and oppo)
  useEffect(() => {
    setId(id);
  }, [setId, id]);

  if (!game || !id) {
    return null;
  }

  return (
    <main id="GamePage">
      <div className="gutters">
        {game?.gameState === "over" ? (
          <>
            <Button
              className="scoreboard-button"
              variant="outlined"
              onClick={() => setShowScoreboard(true)}
            >
              Show Scoreboard
            </Button>
            <Suspense fallback={null}>
              <Scoreboard
                game={game}
                showScoreboard={showScoreboard}
                handleClose={() => setShowScoreboard(false)}
              />
            </Suspense>
          </>
        ) : null}

        {game?.gameState === "lobby" && isHost ? <QrCode /> : null}
        {game?.gameState !== "lobby" ? (
          <Suspense fallback={null}>
            <Gui />
          </Suspense>
        ) : null}
      </div>
    </main>
  );
}

export default GamePage;
