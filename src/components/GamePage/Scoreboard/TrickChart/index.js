import "./style.scss";
import {
  wonArrToTotalScore,
  spritePosition,
  cardToName,
  winningCardFromArray,
  cardToScore,
  idToName,
} from "utils/helpers";
import { Chart } from "react-google-charts";

export default function TrickChart({ game }) {
  function wonCardsToTrickColumn(index) {
    let wonArray = game.won;
    let wonByHost = wonArray.filter(
      (trick, i) => i <= index && trick.player === game.host
    );
    let wonByOppo = wonArray.filter(
      (trick, i) => i <= index && trick.player === game.oppo
    );

    let toolTipContent =
      '<p class="Scoreboard-title">' +
      idToName(wonArray[index]?.player, game) + 
      ' won trick ' +
      (index + 1) +
      " with <br/> " +
      cardToName(winningCardFromArray(wonArray[index]?.cards, game)) +
      " (+" +
      (cardToScore(wonArray[index]?.cards[0]) +
        cardToScore(wonArray[index]?.cards[1])) +
      ')</p><span class="Scoreboard-card" style="background-position: ' +
      spritePosition(wonArray[index]?.cards[0], 1 / 1.5) +
      '"></span><span class="Scoreboard-card" style="background-position: ' +
      spritePosition(wonArray[index]?.cards[1], 1 / 1.5) +
      '"></span>';

    return [
      index + 1,
      wonArrToTotalScore(wonByHost, game.host),
      toolTipContent,
      wonArrToTotalScore(wonByOppo, game.oppo),
      toolTipContent,
    ];
  }

  const data1 = [
    [
      "Hand",
      idToName(game.host, game) + " Points", // "Host Points"
      { role: "tooltip", type: "string", p: { html: true } },
      idToName(game.oppo, game) + " Points", // "Opponent Points"
      { role: "tooltip", type: "string", p: { html: true } },
    ],
    ...[...Array(20).keys()].map((i) => wonCardsToTrickColumn(i)),
  ];

  return (
    <div id="TrickChart">
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={data1}
        options={{
          legend: "none",
          tooltip: { isHtml: true },
        }}
      />
    </div>
  );
}
