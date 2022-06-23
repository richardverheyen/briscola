import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const games = {
//   001: {
//     host: "foo",
//     oppo: "bar",
//     hostHand: [1, 32, 5],
//     oppoHand: [4, 9, 21],
//     hostWon: [],
//     oppoWon: [],
//     round: [],
//     briscola: "",
//     deck: [],
//     gameState: "", // lobby, hostTurn, oppoTurn, bothDraw, hostDraw, oppoDraw, scoreboard 
//   }
// }

//