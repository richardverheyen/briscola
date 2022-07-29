import "./style.scss";
import { useContext } from "react";
import { Game, Auth } from "contexts";

import {
  wonArrToTotalScore,
  gameToPlayerBriscolaDrawn,
  drawnToPlayerValueDrawn,
} from "utils/helpers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TrickChart from "./TrickChart";
import HeldChart from "./HeldChart";

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
      message = `${
        enemyName || "Your opponent"
      } won with a score of ${enemyScore} - ${egoScore}.`;
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
    game && (
      <Dialog
        open={showScoreboard}
        onClose={handleClose}
        fullWidth={true}
        scroll="body"
      >
        <DialogTitle>Scoreboard</DialogTitle>
        <DialogContent>
          <DialogContentText>{title()}</DialogContentText>
          <TrickChart game={game} />
        </DialogContent>

        <DialogTitle>Cards Drawn</DialogTitle>
        <DialogContent>
          <DialogContentText>{`${
            auth.displayName || "Your"
          } card value drawn: ${drawnToPlayerValueDrawn(
            game.drawn,
            auth.uid
          )}`}</DialogContentText>
          <DialogContentText>{`${
            auth.displayName || "Your"
          } number of Briscola drawn: ${gameToPlayerBriscolaDrawn(
            game,
            auth.uid
          )}`}</DialogContentText>

          <DialogContentText>{`${
            enemyName || "Your opponent's"
          } card value drawn: ${drawnToPlayerValueDrawn(
            game.drawn,
            enemyId
          )}`}</DialogContentText>
          <DialogContentText>{`${
            enemyName || "Your opponent's"
          } number of Briscola drawn: ${gameToPlayerBriscolaDrawn(
            game,
            enemyId
          )}`}</DialogContentText>
        </DialogContent>

        <DialogTitle>Cards Held</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>Your cards</span>
            <span style={{ float: "right" }}>{`${
              enemyName || "Your opponent"
            }'s cards`}</span>
          </DialogContentText>
          <HeldChart game={game} auth={auth} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  );
}

export default Scoreboard;
