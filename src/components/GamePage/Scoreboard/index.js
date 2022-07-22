import "./style.scss";
import { wonArrToTotalScore } from "utils/helpers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TrickChart from "./TrickChart";

import Button from "@mui/material/Button";

function Scoreboard({ game, showScoreboard, handleClose }) {
  const hostScore = wonArrToTotalScore(game?.won, game.host);
  const oppoScore = wonArrToTotalScore(game?.won, game.oppo);

  const title = () => {
    if (hostScore === oppoScore) {
      return "It was a tie! 60 - 60";
    } else if (hostScore > oppoScore) {
      return `${game.hostDisplayName || "Host"} won with a score of ${hostScore} - ${oppoScore}`;
    } else {
      return `${game.oppoDisplayName || "Opponent"} won with a score of ${oppoScore} - ${hostScore}`;
    }
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
