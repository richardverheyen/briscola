import { useContext, useState } from "react";
import { Auth } from "contexts";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

export default function CreateGameButton() {
  let { auth } = useContext(Auth);
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const createGame = httpsCallable(functions, "createGame");

  const handleCreateGame = () => {
    setIsLoading(true);
    createGame()
      .then((res) => {
        navigate(`game/${res.data.id}`);
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
      disabled={!auth}
      loading={isLoading}
      onClick={handleCreateGame}
      variant="contained"
      size="large"
    >
      Create Game
    </LoadingButton>
  );
}
