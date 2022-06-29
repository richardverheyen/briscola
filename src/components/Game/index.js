import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

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
    return <Button onClick={quitGame}>Quit</Button>;
  }

  return (
    <main className="Game">
      <div className="gutters">
        {game?.gameState === "lobby" ? <QrCode /> : <Gui />}
        <div>
          <Button onClick={quitGame}>Quit</Button>
        </div>
      </div>
    </main>
  );
}

export default GamePage;
