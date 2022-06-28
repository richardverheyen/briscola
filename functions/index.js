const functions = require("firebase-functions");
const admin = require("firebase-admin");
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
        currentPlayersTurn: context.auth.uid
      })
      .then(() => {
        startGame(data.id);
      });
  });

exports.playCard = functions.https.onRequest(async function (req, res) {
  return cors(req, res, () => {
    console.log("foo");
    //  res.send(url);
  });
});

async function startGame(id) {
    console.log('start the game!', id);
    let gameRef = admin.firestore().collection("games").doc(id);

    const game = await gameRef.get();
    if (game.data().gameState !== "lobby") {
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

      // deck.push(deck.splice(0, 1)[0]); // move the first deck card to the end of the deck array
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

    gameRef
      .update({
        gameState: "play",
        lastCard,
        trumps,
      })
}