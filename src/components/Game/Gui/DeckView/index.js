import "./style.scss";

function DeckView({ deckHeight, lastCard, pickUp }) {
  function spritePosition(num) {
    const suitId = Math.floor(num / 10);
    const valueId = num % 10;
    return `${valueId * -130.5}px ${suitId * -226}px`;
  }

  return (
    <ul className="DeckView" onClick={pickUp}>
      {[...Array(deckHeight).keys()].map((card, index) => (
        <li key={index}>
          <div
            tabIndex={index === deckHeight - 1 ? "0" : "-1"}
            style={{
              backgroundPosition: index === 0 ? spritePosition(lastCard) : "",
            }}
          ></div>
        </li>
      ))}
    </ul>
  );
}

export default DeckView;
