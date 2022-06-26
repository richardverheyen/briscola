import { useContext } from "react";
import { Auth } from "contexts";
import Button from "@mui/material/Button";

function App() {
  let { signIn, signOut, data } = useContext(Auth);

  const createGame = () => {
    fetch(
      'http://localhost:5001/briscola-fp/us-central1/createGame',
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
      })
      .catch((err) => {
        console.error('Create Game Failed', {err});
      })
  };

  return (
    <div className="App">
      {data ? (
        <Button onClick={signOut} variant="outlined">
          Log Out
        </Button>
      ) : (
        <Button onClick={signIn} variant="outlined">
          Log In
        </Button>
      )}

      <Button onClick={createGame} variant="contained">
        Create Game
      </Button>
    </div>
  );
}

export default App;
