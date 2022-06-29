const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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
      trumps = cardToSuit(topCard);

      deck.push(deck.shift()); // move the first deck card to the end of the deck array
    }

    let batch = admin.firestore().batch();

    let privateRef = gameRef.collection("private").doc("data");
    let hostHandRef = admin.firestore().collection("hands").doc(game.host);
    let oppoHandRef = admin.firestore().collection("hands").doc(oppoId);

    batch.set(privateRef, { originalDeck, deck });
    batch.set(hostHandRef, { cards: hostHand, gameId: data.id });
    batch.set(oppoHandRef, { cards: oppoHand, gameId: data.id });
    batch.update(gameRef, {
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
    const userId = context.auth.uid;

    let gameRef = admin.firestore().collection("games").doc(gameId);
    let privateRef = gameRef.collection("private").doc("data");
    let handRef = admin.firestore().collection("hands").doc(userId);
    const [gameSnapshot, handSnapshot] = await Promise.all([
      gameRef.get(),
      handRef.get(),
    ]);
    let game = Object.assign({}, gameSnapshot.data());
    let hand = Object.assign({}, handSnapshot.data());

    playCardValidations(game, hand, card, userId);

    // actions
    hand.cards.splice(hand.cards.indexOf(card), 1); // remove the card being played from the hand
    game.trick = [...game.trick, card];

    // sideEffects
    // change the players turn from the card player to EITHER the other player (if the trick.length is 1)
    // or the same player if the trick.length == 2 && this player wins the trick.
    const otherPlayer = game.host === userId ? game.oppo : game.host;
    console.log({userId, otherPlayer}, game.currentPlayersTurn);

    if (game.trick.length === 1) {
      game.currentPlayersTurn = otherPlayer;

    } else if (game.trick.length === 2) {
      game.gameState = "draw";

      if (trickWon(game)) {
        game.currentPlayersTurn = userId;
      } else {
        game.currentPlayersTurn = otherPlayer;
      }
    } else {
      throw "played a card but new game.trick.length wasn't 1 or 2";
    }

    let batch = admin.firestore().batch();
    batch.update(handRef, hand);
    batch.update(gameRef, game);

    batch.commit();
  });

function playCardValidations(game, hand, card, userId) {
  if (game.gameState !== "play") {
    throw "It's not the time to play a card";
  }
  if (game.currentPlayersTurn !== userId) {
    throw "It's not this player's turn";
  }
  if (game.trick.length >= 2) {
    throw "You can't play a third card";
  }
  if (!hand.cards.includes(card)) {
    throw "This player doesn't have this card";
  }
}

function cardToSuit(num) {
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

function cardToPower(num) {
  let powerScore = num % 10;

  if (powerScore === 0) {
    powerScore = 11;
  } else if (powerScore === 2) {
    powerScore = 10;
  }
  
  return powerScore;
}

function trickWon(game) {
  const trumps = game.trumps;
  const bottomCard = game.trick[0];
  const topCard = game.trick[1];
  const bottomCardSuit = cardToSuit(bottomCard);
  const topCardSuit = cardToSuit(topCard);

  console.log({trumps, bottomCard, topCard, bottomCardSuit, topCardSuit});

  if (bottomCardSuit === trumps && topCardSuit !== trumps) {
    console.log("you lost! they played trumps and you didn't");
    return false; // they played trumps and you didn't
  } else if (bottomCardSuit !== topCardSuit && topCardSuit !== trumps) {
    console.log("you lost! you couldn't follow suit and didn't play trumps");
    return false; // you couldn't follow suit and didn't play trumps
  } else if (cardToPower(bottomCard) > cardToPower(topCard)) {
    console.log("you lost! their card was more powerful");
    return false; // their card was more powerful
  } else {
    console.log("you won!");
    return true;
  }
}