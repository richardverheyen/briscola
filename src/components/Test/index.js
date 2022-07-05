import "./style.scss";
import { useState } from "react";

function Test() {
  let [active1, setActive1] = useState(false);

  const arr = [...Array(40)];
  return (
    <div id="Test">
      <div className="gutters">
        <ul
          className={`${active1 ? "active" : ""}`}
          onClick={() => setActive1(!active1)}
        >
          {arr.map((el, i) => (
            <li 
              key={i} 
              className="card animation" 
              style={{
                animationDelay: `${200 * (arr.length - i)}ms`,
                transform: `translateZ(${i}px) rotate3d(0.7, 0.2, -0.15, 50deg)`,
                transformOrigin: `0 100% -${i}px`,
                perspectiveOrigin: `0 100% -${i}px`,
              }}></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Test;
