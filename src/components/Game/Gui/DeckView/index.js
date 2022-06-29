import "./style.scss";

function DeckView({ deckHeight, lastCard }) {

  function spritePosition(num) {
    const suitId = Math.floor(num / 10);
    const valueId = num % 10;
    return `${valueId * -130.5}px ${suitId * -226}px`;
  }


  return (
    <ul className="DeckView">
      {
        [...Array(deckHeight).keys()].map((card, index) => (
          <li key={index}>
            <div style={{
              backgroundPosition: index == 0 ? spritePosition(lastCard) : ""
              }}></div>
          </li>
        ))
      }
    </ul>
  );
}

export default DeckView;
