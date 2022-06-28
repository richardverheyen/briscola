const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { OneK } = require("@mui/icons-material");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.createHand = functions
  .region("australia-southeast1")
  .auth.user()
  .onCreate((user) => {
    admin.firestore().collection("hands").doc(user.uid).set({
      cards: [],
    });
  });

// exports.createGame = functions.https.onRequest(async function(req, res) {
//     return cors(req, res, async () => {

//         const {id} = await admin.firestore().collection('games').add({
//             // host:
//             gameState: "lobby",
//         });

//         res.send({id});
//     });
// });

// https://stackoverflow.com/questions/52444812/getting-user-info-from-request-to-cloud-function-in-firebase
// https://firebase.google.com/docs/functions/callable
exports.createGame = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    const { id } = await admin.firestore().collection("games").add({
      host: context.auth.uid,
      gameState: "lobby",
    });

    return {
      id,
    };
  });

exports.joinGame = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    let gameRef = admin.firestore().collection("games").doc(data.id);

    // if oppo is truthy, fail this request because the game is already full

    gameRef
      .update({
        oppo: context.auth.uid,
        currentPlayersTurn: context.auth.uid,
      })
      .then(() => {
        startGame(data.id);
      });
  });

exports.playCard = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
  
  // takes cardId from game.private.hostHand and puts it in game.trick
  // removes cardId from user.hostHand
  // if game.trick.length == 2
  // set the game.gameState to 'draw'
  // if user won the hand, put those cards in game.private.hostWon
  // if user won the hand, is is their turn
    const { gameId, card } = data;

    let gameRef = admin.firestore().collection("games").doc(gameId);
    const gameSnapshot = await gameRef.get();
    let game = gameSnapshot.data();

    const playerIsInThisGame = (game, context) => {
      if (!Boolean(context.auth.uid === game.host || context.auth.uid === game.oppo)) {
        throw "You aren't in this game";
      }
    };

    const theGameHasStarted = (game) => {
      if (game.gameState !== "play") {
        throw "The game.gameState is not 'play'";
      }
    }

    const itIsThisPlayersTurn = (game, context) => {
      if (game.currentPlayersTurn !== context.auth.uid) {
        throw "It is not your turn";
      }
    }

    // const thePlayerHasThisCard = (game, context) => {
    //   if (game.currentPlayersTurn === context.auth.uid) {
    //     return new Promise.success();
    //   } else {
    //     throw "It is not your turn";
    //   }
    // }

    function playCard(card) {
      console.log('playCard', card);
    }

    try {
      playerIsInThisGame(game, context);
      theGameHasStarted(game);
      itIsThisPlayersTurn(game, context);
      // thePlayerHasThisCard();
      playCard(card);

    } catch (error) {
      throw new Error(error) ;
    }

    // gameRef
    //   .update({
    //     oppo: context.auth.uid,
    //     currentPlayersTurn: context.auth.uid,
    //   })
    //   .then(() => {
    //     startGame(data.id);
    //   });
  });


async function startGame(id) {
  let gameRef = admin.firestore().collection("games").doc(id);
  const gameSnapshot = await gameRef.get();
  let game = gameSnapshot.data();
  if (game.gameState !== "lobby") {
    return;
  }

  let originalDeck = [...Array(40).keys()].sort(() => Math.random() - 0.5);
  let deck = JSON.parse(JSON.stringify(originalDeck)); // set deck as a new assignment of originalDeck
  let hostHand = [];
  let oppoHand = [];
  let lastCard;
  let trumps;

  hostHand.push(deck.shift());
  oppoHand.push(deck.shift());
  hostHand.push(deck.shift());
  oppoHand.push(deck.shift());
  hostHand.push(deck.shift());
  oppoHand.push(deck.shift());
  assignTrumps();

  function assignTrumps() {
    let topCard = deck[0];
    lastCard = topCard;
    trumps = cardNumberToSuit(topCard);

    deck.push(deck.shift()); // move the first deck card to the end of the deck array
  }

  function cardNumberToSuit(num) {
    const suitId = Math.floor(num / 10);
    switch (suitId) {
      case 0:
        return "coins";

      case 1:
        return "cups";

      case 2:
        return "bats";

      case 3:
        return "swords";
    }
  }

  let privateRef = gameRef.collection("private").add({
    originalDeck,
    deck,
    hostHand,
    oppoHand,
  });

  gameRef.update({
    gameState: "play",
    lastCard,
    deckHeight: deck.length,
    trick: [],
    trumps,
  });

  await admin.firestore().collection("hands").doc(game.host).update({cards: hostHand, gameId: id});
  await admin.firestore().collection("hands").doc(game.oppo).update({cards: oppoHand, gameId: id});
}
