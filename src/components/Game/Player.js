import { useEffect, useContext } from "react";

import { Game, Auth } from "contexts";
import QrCode from "./QrCode";

function Player({game }) {
//   let { data: auth } = useContext(Auth);
//   let { game, quitGame, setId, isHost } = useContext(Game);

  return (
    <div className="Player">
        <p>You're player</p>
        
        <div className="hand">
            Your hand: 1, 2, 3
        </div>
    </div>
  );
}

export default Player;
