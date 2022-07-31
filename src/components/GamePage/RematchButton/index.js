import { useContext, useState } from "react";
import { Game } from "contexts";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

export default function RematchButton() {
  let { game, isHost, id: gameId } = useContext(Game);
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const gameInteract = httpsCallable(functions, "gameInteract");

  const handleCreateRematch = () => {
    if (game.rematchId) {
      navigate(`/game/${game.rematchId}`);
      return;
    }

    setIsLoading(true);
    gameInteract({func: "createGame", isDealer: isHost, previousGameId: gameId })
      .then((res) => {
        navigate(`/game/${res.data.id}`); 
      })
      .catch((err) => {
        console.error("Create Game Failed", { err });
      })
      .finally(() => {
        setIsLoading(true);
      });
  };

  return (
    <LoadingButton
      loading={isLoading}
      onClick={handleCreateRematch}
      variant="contained"
      size="large"
    >
      {
        game.rematchId ?
        "Accept Rematch" : "Challenge to Rematch"
      }
    </LoadingButton>
  );
}
