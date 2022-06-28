import { useContext, useState } from "react";
import { Auth } from "contexts";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";


function Home() {
  let { data } = useContext(Auth);
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const createGame = httpsCallable(functions, 'createGame');

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
  }

  return (
    <div className="Home">
      <LoadingButton
        disabled={!data}
        loading={isLoading}
        onClick={handleCreateGame}
        variant="contained"
      >
        Create Game
      </LoadingButton>
    </div>
  );
}

export default Home;