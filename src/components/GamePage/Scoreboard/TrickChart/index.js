import "./style.scss";
import { wonArrToTotalScore, spritePosition, cardToName, winningCardFromArray } from "utils/helpers";
import { Chart } from "react-google-charts";

export default function TrickChart({game}) {
  function wonCardsToTrickColumn(index) {
    let wonArray = game.won;
    let wonByHost = wonArray.filter(
      (trick, i) => i <= index && trick.player === game.host
    );
    let wonByOppo = wonArray.filter(
      (trick, i) => i <= index && trick.player === game.oppo
    );

    let wonByHostInThisTrick = `<p class="Scoreboard-title">Trick ${
      index + 1
    }, won by <br/> ${cardToName(
      winningCardFromArray(wonArray[index]?.cards, game)
    )}</p><span class="Scoreboard-card" style="background-position: ${spritePosition(
      wonArray[index]?.cards[0],
      0.5
    )}"></span><span class="Scoreboard-card" style="background-position: ${spritePosition(
      wonArray[index]?.cards[1],
      0.5
    )}"></span>`;

    let wonByOppoInThisTrick = `<p class="Scoreboard-title">Trick ${
      index + 1
    }, won by <br/> ${cardToName(
      winningCardFromArray(wonArray[index]?.cards, game)
    )}</p><span class="Scoreboard-card" style="background-position: ${spritePosition(
      wonArray[index]?.cards[0],
      0.5
    )}"></span><span class="Scoreboard-card" style="background-position: ${spritePosition(
      wonArray[index]?.cards[1],
      0.5
    )}"></span>`;
    return [
      index + 1,
      wonArrToTotalScore(wonByHost, game.host),
      wonByHostInThisTrick,
      wonArrToTotalScore(wonByOppo, game.oppo),
      wonByOppoInThisTrick,
    ];
  }

  const data1 = [
    [
      "Hand",
      "Player1 Points",
      { role: "tooltip", type: "string", p: { html: true } },
      "Player2 Points",
      { role: "tooltip", type: "string", p: { html: true } },
    ],
    ...[...Array(20).keys()].map((i) => wonCardsToTrickColumn(i)),
  ];

  return (
    <Chart
      chartType="ScatterChart"
      width="100%"
      height="300px"
      data={data1}
      options={{
        chart: {
          title: "Score Change over time",
          subtitle: "as points per turn",
        },
        tooltip: { isHtml: true, trigger: "visible" },
      }}
    />
  );
}
