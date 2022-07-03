import "./style.scss";
import { useContext } from "react";
import { Auth } from "contexts";
import { wonArrToTotalScore, spritePosition, cardToName, winningCardFromArray } from "utils/helpers";
import { Chart } from "react-google-charts";
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
      return `${game.host} won with a score of ${hostScore} - ${oppoScore}`;
    } else {
      return `${game.oppo} won with a score of ${oppoScore} - ${hostScore}`;
    }
  };

  return (
    <Dialog open={showScoreboard} onClose={handleClose} fullWidth={true}>
      <DialogTitle>Scoreboard</DialogTitle>
      <DialogContent>
        <DialogContentText>{title()}</DialogContentText>

        <TrickChart game={game} />

        <Chart
          chartType="Line"
          width="100%"
          height="300px"
          data={data2}
          options={{
            chart: {
              title: "Cards drawn value over time",
              subtitle: "as points per turn",
            },
            tooltip: { isHtml: true, trigger: "visible" },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Scoreboard;

const data2 = [
  [
    "Day",
    "Guardians of the Galaxy",
    "The Avengers",
    "Transformers: Age of Extinction",
  ],
  [1, 37.8, 80.8, 41.8],
  [2, 30.9, 69.5, 32.4],
  [3, 25.4, 57, 25.7],
  [4, 11.7, 18.8, 10.5],
  [5, 11.9, 17.6, 10.4],
  [6, 8.8, 13.6, 7.7],
  [7, 7.6, 12.3, 9.6],
  [8, 12.3, 29.2, 10.6],
  [9, 16.9, 42.9, 14.8],
  [10, 12.8, 30.9, 11.6],
  [11, 5.3, 7.9, 4.7],
  [12, 6.6, 8.4, 5.2],
  [13, 4.8, 6.3, 3.6],
  [14, 4.2, 6.2, 3.4],
];
