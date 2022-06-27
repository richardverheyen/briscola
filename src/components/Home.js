import { useContext, useState } from "react";
import { Auth } from "contexts";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";

function Home() {
  let { data } = useContext(Auth);
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  const createGame = () => {
    setIsLoading(true);
    fetch(
      // 'http://localhost:5001/briscola-fp/us-central1/createGame',
      "https://us-central1-briscola-fp.cloudfunctions.net/createGame",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/text",
        },
        body: JSON.stringify({}), // body data  type must match "Content-Type" header
      }
    )
      .then((res) => res.json()) // must match match "Content-Type" header
      .then((data) => {
        // console.log('Created Game', data.id);
        navigate(`game/${data.id}`);
      })
      .catch((err) => {
        console.error("Create Game Failed", { err });
      })
      .finally(() => {
        setIsLoading(true);
      });
  };

  return (
    <div className="Home">
      <LoadingButton
        disabled={!data}
        loading={isLoading}
        onClick={createGame}
        variant="contained"
      >
        Create Game
      </LoadingButton>
    </div>
  );
}

export default Home;
