import { useEffect, useContext } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

import { Game, Auth } from "contexts";
import QrCode from "./QrCode";

function Player({game, }) {
  let { data: auth } = useContext(Auth);
//   let { game, quitGame, setId, isHost } = useContext(Game);

  const joinGame = httpsCallable(functions, 'joinGame');

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
    <div className="Player">
        <p>You're player</p>
        
        <p>it is {game.playersTurn === auth.uid ? "your" : "their"} turn</p>
        <div className="hand">
            Your hand: 1, 2, 3
        </div>
    </div>
  );
}

export default Player;
