const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// https://www.youtube.com/watch?v=KjyUsBpDWtE&ab_channel=TheNetNinja
exports.updateUserDisplayName = functions.auth.user().onCreate((user) => {
  console.log('user updated');
});

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

    let private = { originalDeck, deck };
    private[game.host] = [];
    private[oppoId] = [];

    batch.set(privateRef, private);
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
    const [gameSnapshot, privateSnapshot, handSnapshot] = await Promise.all([
      gameRef.get(),
      privateRef.get(),
      handRef.get(),
    ]);
    let game = Object.assign({}, gameSnapshot.data());
    let private = Object.assign({}, privateSnapshot.data());
    let hand = Object.assign({}, handSnapshot.data());

    playCardValidations(game, hand, card, userId);

    // actions
    hand.cards.splice(hand.cards.indexOf(card), 1); // remove the card being played from the hand
    game.trick = [...game.trick, card];

    // sideEffects
    // change the players turn from the card player to EITHER the other player (if the trick.length is 1)
    // or the same player if the trick.length == 2 && this player wins the trick.
    const otherPlayer = game.host === userId ? game.oppo : game.host;

    if (game.trick.length === 1) {
      game.currentPlayersTurn = otherPlayer;

    } else if (game.trick.length === 2) {
      if (trickWon(game)) {
        game.currentPlayersTurn = userId;
      } else {
        game.currentPlayersTurn = otherPlayer;
      }

      game.gameState = "draw";

    } else {
      throw "played a card but new game.trick.length wasn't 1 or 2";
    }

    let batch = admin.firestore().batch();
    batch.update(handRef, hand);
    batch.update(gameRef, game);

    batch.commit();
  });

  exports.drawCard = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    const { gameId } = data;
    const userId = context.auth.uid;

    let gameRef = admin.firestore().collection("games").doc(gameId);
    let privateRef = gameRef.collection("private").doc("data");
    let handRef = admin.firestore().collection("hands").doc(userId);
    const [gameSnapshot, privateSnapshot, handSnapshot] = await Promise.all([
      gameRef.get(),
      privateRef.get(),
      handRef.get(),
    ]);
    let game = Object.assign({}, gameSnapshot.data());
    let private = Object.assign({}, privateSnapshot.data());
    let hand = Object.assign({}, handSnapshot.data());
    const otherPlayer = game.host === userId ? game.oppo : game.host;

    drawCardValidations(game, hand, private, userId);

    // actions
    hand.cards.push(private.deck.shift());
    game.deckHeight = private.deck.length;
    game.currentPlayersTurn = otherPlayer;

    // sideEffects
    if (private.deck.length % 2 === 0) { // you are the second player to draw
      // put the last trick in the other player's winnings (because you're the loser of the last round)
      private[otherPlayer].push(game.trick.shift());
      private[otherPlayer].push(game.trick.shift());
      game.gameState = "play";
    }

    let batch = admin.firestore().batch();
    batch.update(gameRef, game);
    batch.update(privateRef, private);
    batch.update(handRef, hand);

    batch.commit();
  });

exports.takeCards = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    const { gameId } = data;
    const userId = context.auth.uid;

    let gameRef = admin.firestore().collection("games").doc(gameId);
    let privateRef = gameRef.collection("private").doc("data");
    let handRef = admin.firestore().collection("hands").doc(userId);
    const [gameSnapshot, privateSnapshot, handSnapshot] = await Promise.all([
      gameRef.get(),
      privateRef.get(),
      handRef.get(),
    ]);
    let game = Object.assign({}, gameSnapshot.data());
    let private = Object.assign({}, privateSnapshot.data());
    let hand = Object.assign({}, handSnapshot.data());
    const otherPlayer = game.host === userId ? game.oppo : game.host;

    takeCardsValidations(game, hand, private, userId);

    // actions
    game.gameState = "play";
    private[userId].push(game.trick.shift());
    private[userId].push(game.trick.shift());

    if (hand.cards.length === 0 && private.deck.length === 0) {
      game.gameState = "scoreboard";
      game[userId] = private[userId];
      game[otherPlayer] = private[otherPlayer];
    }

    let batch = admin.firestore().batch();
    batch.update(gameRef, game);
    batch.update(privateRef, private);
    batch.update(handRef, hand);

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

function drawCardValidations(game, hand, private, userId) {
  takeCardsValidations(game, hand, private, userId);

  if (private.deck.length === 0) {
    throw "There are no cards to take";
  }
}

function takeCardsValidations(game, hand, private, userId) {
  if (game.gameState !== "draw") {
    throw "It's not the time to draw a card";
  }
  if (game.currentPlayersTurn !== userId) {
    throw "It's not this player's turn";
  }
  if (hand.cards.length === 3) {
    throw "You can't draw a fourth card";
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
  // console.log({trumps, bottomCard, topCard, bottomCardSuit, topCardSuit});

  if (bottomCardSuit === trumps && topCardSuit !== trumps) {
    console.log("you lost! They played trumps and you didn't");
    return false;

  } else if (bottomCardSuit !== trumps && topCardSuit === trumps) {
    console.log("you won! You played trumps and they didn't");
    return true; 
  }
  
  if (bottomCardSuit !== topCardSuit) {
    console.log("you lost! you couldn't follow suit");
    return false;
  }

  if (cardToPower(bottomCard) > cardToPower(topCard)) {
    console.log("you lost! their card was more powerful");
    return false;
  } else {
    console.log("you won! your card was more powerful");
    return true;
  }
}