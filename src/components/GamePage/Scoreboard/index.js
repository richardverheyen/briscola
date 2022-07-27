import "./style.scss";
import { useContext } from "react";
import { Game, Auth } from "contexts";

import { wonArrToTotalScore } from "utils/helpers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TrickChart from "./TrickChart";

import Button from "@mui/material/Button";

function Scoreboard({ showScoreboard, handleClose }) {
  const { auth } = useContext(Auth);
  const { game, enemyId, enemyName } = useContext(Game);

  const title = () => {
    let message, emoji;
    const egoScore = wonArrToTotalScore(game.won, auth.uid);
    const enemyScore = wonArrToTotalScore(game.won, enemyId);

    if (egoScore === 60) {
      message = "The game was a tie! 60 - 60.";
      emoji = "👏";
      document.title = "Briscola 👏";
    } else if (egoScore < 60) {
      message = `${enemyName || "Your opponent"} won with a score of ${enemyScore} - ${egoScore}.`;
      emoji = "👏";
      document.title = "Briscola 👏";
    } else if (egoScore > 60) {
      message = `You won with a score of ${egoScore} - ${enemyScore}.`;
      emoji = "🎉";
      document.title = "Briscola 🎉";
    }

    return `${message} ${emoji}`;
  };

  return (
    <Dialog open={showScoreboard} onClose={handleClose} fullWidth={true}>
      <DialogTitle>Scoreboard</DialogTitle>
      <DialogContent>
        <DialogContentText>{title()}</DialogContentText>
        <TrickChart game={game} />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Scoreboard;
