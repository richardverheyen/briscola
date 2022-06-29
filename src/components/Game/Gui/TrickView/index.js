import "./style.scss";

function TrickView({ trick }) {

  function spritePosition(num) {
    const suitId = Math.floor(num / 10);
    const valueId = num % 10;
    return `${valueId * -130.5}px ${suitId * -226}px`;
  }

  return (
    <ul className="TrickView">
      {
        trick.map((card, index) => (
          <li key={index}>
            <div style={{ backgroundPosition: spritePosition(card) }}></div>
          </li>
        ))
      }
    </ul>
  );
}

export default TrickView;
