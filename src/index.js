import React from "react";
import ReactDOM from "react-dom/client";
import { Providers } from "contexts";

import Router from "router";
import Login from "components/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Providers>
      <Login />
      <Router />
    </Providers>
  </React.StrictMode>
);

// const hand = {
//   "foo": {
//     cards: [1, 32, 5],
//     gameId: 001
//   }
// }
// // listen for live updates on this record
// const games = {
//   001: {
//     host: "foo",
//     oppo: "bar",
//     trick: [],
//     trumps: "",
//     lastCard: 33,
//     gameState: "", // lobby, play, draw, scoreboard
//     playersTurn: <id>,
//     deckHeight: 36,

//     // according to this, we can do private subcollections on a record
//     // https://stackoverflow.com/questions/46585330/firestore-security-rules-for-public-and-private-fields
//     private: {
//       deck: [],
//       hostHand: [1, 32, 5],
//       oppoHand: [4, 9, 21],
//       hostWon: [],
//       oppoWon: [],
//     }
//   }
// }

// // user functions:
// playCard(cardId)
//   // check user isn't in another game
//   // check that the game.gameState is 'play'
//   // check it is that users turn
//   // check user has that card in game.private.hostHand
//   //
//   // takes cardId from game.private.hostHand and puts it in game.trick
//   // removes cardId from user.hostHand
//   // if game.trick.length == 2
//   // set the game.gameState to 'draw'
//   // if user won the hand, put those cards in game.private.hostWon
//   // if user won the hand, is is their turn
//   //

// drawFromDeck()
//   // check user isn't in another game
//   // check users hand array length
//   // check that the game.gameState is 'draw'
//   // check the deck.length > 0
//   // check it is that users turn
//   //
//   // takes cardId from top of private.deck and puts it in game.private.hostHand
//   // sets user.hand as game.private.hostHand
//   // updates game.deckHeight from game.private.deck
//   //
//   // then if game.private.hostHand.length and game.private.oppoHand.length are both 3, set game.gameState to "play"
//   // finally toggle game.hostPlayersTurn

// createGame()
//   // creates game record with game.host as the user.id
//   // sets the game.hostName as the user.name
//   // creates

// joinGame(gameId)
//   // happens when you join the correct url
//   // checks there isn't already a game.oppo set
//   //
//   // sets the game.oppo to the userId
//   // sets the game.oppoName to the user.name
//   // runs deal()

// deal()
//   // creates the randomised game.private.deck array
//   // puts 3 cards into game.private.hostHand and game.private.oppoHand, 1 at a time.
//   // sets game.lastCard as the first card in the game.private.deck array
//   // moves the first card in the game.private.deck array to the last place in that array
//   // sets the game.gameState to 'play'
