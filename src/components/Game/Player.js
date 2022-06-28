import { useContext } from "react";

import { Hand } from "contexts";

function Player({ game }) {
  let { cards } = useContext(Hand);

  return (
    <div className="Player">
      <p>You're player</p>

      <div className="hand">
        Your hand:{" "}
        {cards?.map((card, index) => (
          <span key={index}>{card},&nbsp;</span>
        ))}
      </div>
    </div>
  );
}

export default Player;
