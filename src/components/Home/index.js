import "./style.scss";
import CreateGameButton from "./CreateGameButton";
// import Button from "@mui/material/Button";

function Home() {
  
  return (
    <main id="Home">
      <div className="gutters">
        <h1>Briscola</h1>
        <h2>Two player multiplayer</h2>
        <CreateGameButton />
      </div>
    </main>
  );
}

export default Home;
