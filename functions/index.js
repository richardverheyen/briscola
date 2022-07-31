const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// https://stackoverflow.com/questions/52444812/getting-user-info-from-request-to-cloud-function-in-firebase
// https://firebase.google.com/docs/functions/callable
exports.gameInteract = functions
  .region("australia-southeast1")
  .runWith({
    minInstances: 0,
    maxInstances: 5,
  })
  .https.onCall(async (data, context) => {
    const { func } = data;

    let res;
    switch (func) {
      case "createGame":
        res = await createGame(data, context);
        break;

      case "joinGame":
        res = await joinGame(data, context);
        break;

      case "playCard":
        res = await playCard(data, context);
        break;

      case "drawCard":
        res = await drawCard(data, context);
        break;

      case "takeCards":
        res = await takeCards(data, context);
        break;

      case "updateUsernameInGame":
        res = await updateUsernameInGame(data, context);
        break;
    }

    return res;
  });

async function createGame(data, context) {
  const creatorUserRecord = await admin.auth().getUser(context.auth.uid);

  const { id } = await admin
    .firestore()
    .collection("games")
    .add({
      creator: context.auth.uid,
      creatorDisplayName: creatorUserRecord.displayName || "",
      creatorIsDealer: data.isDealer || false,
      gameState: "lobby",
    });

  if (data.previousGameId) {
    await admin.firestore().collection("games").doc(data.previousGameId).set(
      {
        rematchId: id,
      },
      { merge: true }
    );
  }

  return {
    id,
  };
}

async function joinGame(data, context) {
  let gameRef = admin.firestore().collection("games").doc(data.id);
  let privateRef = gameRef.collection("private").doc("data");
  const [gameSnapshot, oppoUserRecord] = await Promise.all([
    gameRef.get(),
    admin.auth().getUser(context.auth.uid),
  ]);
  let game = gameSnapshot.data();

  if (game.gameState !== "lobby") {
    return;
  }

  let hostId, oppoId, hostDisplayName, oppoDisplayName;

  if (game.creatorIsDealer) {
    hostId = context.auth.uid;
    oppoId = game.creator;
    hostDisplayName = oppoUserRecord.displayName || "";
    oppoDisplayName = game.creatorDisplayName;
  } else {
    oppoId = context.auth.uid;
    hostId = game.creator;
    hostDisplayName = game.creatorDisplayName;
    oppoDisplayName = oppoUserRecord.displayName || "";
  }

  let originalDeck = [...Array(40).keys()].sort(() => Math.random() - 0.5);
  let deck = JSON.parse(JSON.stringify(originalDeck)); // set deck as a new assignment of originalDeck
  let hands = {
    [hostId]: [],
    [oppoId]: [],
  };
  let lastCard;
  let trumps;
  let private = {
    originalDeck,
    deck,
    drawn: [],
    won: [],
  };

  function dealCard(playerId) {
    let card = deck.shift();
    hands[playerId].push(card);
    private.drawn.push({
      player: playerId,
      card,
    });
  }

  function assignTrumps() {
    let topCard = deck[0];
    lastCard = topCard;
    trumps = cardToSuit(topCard);

    deck.push(deck.shift()); // move the topcard to the end of the deck array so it becomes the lastCard
  }

  dealCard(hostId);
  dealCard(oppoId);
  dealCard(hostId);
  dealCard(oppoId);
  dealCard(hostId);
  dealCard(oppoId);
  assignTrumps();

  let batch = admin.firestore().batch();

  let hostHandRef = admin.firestore().collection("hands").doc(hostId);
  let oppoHandRef = admin.firestore().collection("hands").doc(oppoId);

  batch.set(privateRef, private);
  batch.set(hostHandRef, { cards: hands[hostId], gameId: data.id });
  batch.set(oppoHandRef, { cards: hands[oppoId], gameId: data.id });
  batch.update(gameRef, {
    host: hostId,
    oppo: oppoId,
    hostDisplayName,
    oppoDisplayName,
    currentPlayersTurn: oppoId,
    gameState: "play",
    lastCard,
    deckHeight: deck.length,
    trick: [],
    trumps,
  });

  batch.commit();
}

async function playCard(data, context) {
  const { gameId, card } = data;
  const userId = context.auth.uid;

  let gameRef = admin.firestore().collection("games").doc(gameId);
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
}

async function drawCard(data, context) {
  const { gameId } = data;
  const userId = context.auth.uid;

  let gameRef = admin.firestore().collection("games").doc(gameId);
  let privateRef = gameRef.collection("private").doc("data");
  let egoHandRef = admin.firestore().collection("hands").doc(userId);
  const [gameSnapshot, privateSnapshot, handSnapshot] = await Promise.all([
    gameRef.get(),
    privateRef.get(),
    egoHandRef.get(),
  ]);
  let game = Object.assign({}, gameSnapshot.data());
  let private = Object.assign({}, privateSnapshot.data());
  let egoHand = Object.assign({}, handSnapshot.data());
  const otherPlayer = game.host === userId ? game.oppo : game.host;

  drawCardValidations(game, egoHand, private, userId);

  let otherPlayerHandRef = admin
    .firestore()
    .collection("hands")
    .doc(otherPlayer);
  const otherPlayerHandSnapshot = await otherPlayerHandRef.get();
  let otherPlayerHand = Object.assign({}, otherPlayerHandSnapshot.data());

  // actions
  // draw card for ego
  const drawnCard1 = private.deck.shift();
  egoHand.cards.push(drawnCard1);
  private.drawn.push({
    player: userId,
    card: drawnCard1,
  });

  // draw card for other player
  const drawnCard2 = private.deck.shift();
  otherPlayerHand.cards.push(drawnCard2);
  private.drawn.push({
    player: otherPlayer,
    card: drawnCard2,
  });

  // give trick cards to the ego player
  private.won.push({
    player: userId,
    cards: [game.trick.shift(), game.trick.shift()],
  });
  game.gameState = "play";
  game.deckHeight = private.deck.length;

  let batch = admin.firestore().batch();
  batch.update(gameRef, game);
  batch.update(privateRef, private);
  batch.update(egoHandRef, egoHand);
  batch.update(otherPlayerHandRef, otherPlayerHand);

  batch.commit();
}

async function takeCards(data, context) {
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

  takeCardsValidations(game, hand, userId);

  // actions
  game.gameState = "play";
  private.won.push({
    player: userId,
    cards: [game.trick.shift(), game.trick.shift()],
  });

  if (hand.cards.length === 0 && private.deck.length === 0) {
    game.gameState = "over";

    // make the won and drawn lists available to the scoreboard
    game.won = private.won;
    game.drawn = private.drawn;
  }

  let batch = admin.firestore().batch();
  batch.update(gameRef, game);
  batch.update(privateRef, private);
  batch.update(handRef, hand);

  batch.commit();
}

async function updateUsernameInGame(data, context) {
  let gameRef = admin.firestore().collection("games").doc(data.id);
  const [gameSnapshot, egoUserRecord] = await Promise.all([
    gameRef.get(),
    admin.auth().getUser(context.auth.uid),
  ]);
  let game = gameSnapshot.data();
  let egoUserDisplayName = egoUserRecord.displayName;

  const egoUserIsHost = game.host === context.auth.uid;
  if (egoUserIsHost) {
    game.hostDisplayName = egoUserDisplayName;
  }

  const egoUserIsOppo = game.oppo === context.auth.uid;
  if (egoUserIsOppo) {
    game.oppoDisplayName = egoUserDisplayName;
  }

  let batch = admin.firestore().batch();
  batch.update(gameRef, game);
  batch.commit();
}

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
  takeCardsValidations(game, hand, userId);

  if (private.deck.length === 0) {
    throw "There are no cards to take";
  }
}

function takeCardsValidations(game, hand, userId) {
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
