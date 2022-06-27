import { useContext } from "react";
import { Auth } from "contexts";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Home() {
  let { signIn, signOut, data } = useContext(Auth);
  let navigate = useNavigate();

  const createGame = () => {
    fetch(
      // 'http://localhost:5001/briscola-fp/us-central1/createGame',
      'https://us-central1-briscola-fp.cloudfunctions.net/createGame',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/text'
        },
        body: JSON.stringify({}) // body data type must match "Content-Type" header
      }
    )
      .then(res => res.json()) // must match match "Content-Type" header
      .then(data => {
        console.log('Created Game', data.id);
        navigate(`game/${data.id}`);
      })
      .catch((err) => {
        console.error('Create Game Failed', {err});
      })
  };

  return (
    <div className="Home">
      {data ? (
        <Button onClick={signOut} variant="outlined">
          Log Out
        </Button>
      ) : (
        <Button onClick={signIn} variant="outlined">
          Log In
        </Button>
      )}

      <Button disabled={!data} onClick={createGame} variant="contained">
        Create Game
      </Button>
    </div>
  );
}

export default Home;
