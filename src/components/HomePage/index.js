import "./style.scss";
import CreateGameButton from "./CreateGameButton";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function HomePage() {

  
  return (
    <main id="HomePage">
      <div className="gutters">
        <h1>Briscola</h1>
        <h2>Two player multiplayer</h2>
        <CreateGameButton />
        <Link to="/rules">
          <Button variant="outlined" size="large">Briscola Rules</Button>
        </Link>
      </div>
    </main>
  );
}

export default HomePage;
