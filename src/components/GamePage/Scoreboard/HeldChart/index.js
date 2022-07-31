import "./style.scss";
import { cardToName } from 'utils/helpers';

export default function HeldChart({ game, auth }) {
  function drawnToPaths() {
    const { drawn, won } = game;
    let paths = [];

    for (let d = 0; d < drawn.length; d++) {
      const { card, player } = drawn[d];
      const isEgo = player === auth.uid;

      let startX, startY, endX, endY, textX;

      startX = isEgo ? "-10" : "10";
      let yOffset = Math.round(d % 2) * 10;

      let trickWhereCardWasDrawn = Math.floor(d / 2) - 3; // -3 ... 16;?
      if (d < 6) {
        startY = trickWhereCardWasDrawn * 25 - 45;
      } else {
        startY = trickWhereCardWasDrawn * 60;
      }

      let trickWhereCardWasPlayed = won.findIndex((w) =>
        w.cards.includes(card)
      );
      endY = trickWhereCardWasPlayed * 60;

      let xOffset;
      if (d < 6) {
        xOffset = Math.floor(d / 2) * 10 * (isEgo ? -1 : 1);
      } else {
        let pathSlotWhichJustEnded = paths.find(
          (p) => p.endY === startY && p.isEgo === isEgo
        ).xOffset;
        xOffset = pathSlotWhichJustEnded;
      }

      endX = isEgo ? -110 : 110;
      textX = isEgo ? -60 : 60;

      let arrowHeadX = isEgo ? -16 : 16;

      let str = `M ${startX}, ${startY + yOffset} L ${endX + xOffset}, ${
        startY + yOffset
      } L ${endX + xOffset}, ${endY - 10} L ${startX}, ${
        endY - 10
      } L ${arrowHeadX}, ${endY - 10 + 3} M ${startX}, ${
        endY - 10
      } L ${arrowHeadX}, ${endY - 10 - 3}`;

      paths.push({
        card,
        d: str,
        endY,
        xOffset,
        isEgo,
        textX,
        startTextY: startY + yOffset,
        endTextY: endY - 10
      });
    }

    return paths;
  }

  return (
    <svg
      id="HeldChart"
      viewBox="-140 -130 280 1270"
      xmlns="http://www.w3.org/2000/svg"
    >
      {drawnToPaths().map((path, i) => (
        <g key={i}>
          <text className="start" x={path.textX} y={path.startTextY} textAnchor="middle">
            {cardToName(path.card)}
          </text>
          <text className="end" x={path.textX} y={path.endTextY} textAnchor="middle">
            {cardToName(path.card)}
          </text>
          <path
            
            stroke="black"
            fill="none"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={path.d}
          />
        </g>
      ))}
      {[...Array(20)].map((n, i) => (
        <text key={i} x="0" y={i * 60} textAnchor="middle">
          {i + 1}
        </text>
      ))}
    </svg>
  );
}
