const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// exports.watchGame = functions.firestore
//   .document("games/{docId}")
//   .onChange((change, context) => {
//     console.log({change, context});
//     // if trick.length == 2 change gameState to 'draw'
//     // give cards to winner
//   });

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
    const oppoId = context.auth.uid;

    let gameRef = admin.firestore().collection("games").doc(data.id);
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

    let batch = admin.firestore().batch();

    let privateRef = gameRef.collection("private").doc("data");
    let hostHandRef = admin.firestore().collection("hands").doc(game.host);
    let oppoHandRef = admin.firestore().collection("hands").doc(oppoId);

    batch.set(privateRef, { originalDeck, deck });
    batch.set(hostHandRef, { cards: hostHand, gameId: data.id });
    batch.set(oppoHandRef, { cards: oppoHand, gameId: data.id });
    batch.set(gameRef, {
      oppo: oppoId,
      currentPlayersTurn: oppoId,
      gameState: "play",
      lastCard,
      deckHeight: deck.length,
      trick: [],
      trumps,
    });

    batch.commit();
  });

exports.playCard = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    const { gameId, card } = data;

    let gameRef = admin.firestore().collection("games").doc(gameId);
    const gameSnapshot = await gameRef.get();
    let game = gameSnapshot.data();

    if (game.trick.length >= 2) {
      throw "can't play a third card";
    }

    let handRef = admin.firestore().collection("hands").doc(context.auth.uid);
    const handSnapshot = await handRef.get();
    let handData = [...handSnapshot.data().cards];
    handData.splice(handData.indexOf(card), 1);

    let batch = admin.firestore().batch();
    
    batch.update(handRef, { cards: handData });
    batch.update(gameRef, {
      trick: [...game.trick, card],
      currentPlayersTurn:
        game.currentPlayersTurn === context.auth.uid
          ? game.oppo
          : context.auth.uid,
    });

    batch.commit();
  });
