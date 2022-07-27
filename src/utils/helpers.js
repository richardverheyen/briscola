export function spritePosition(num, scaleFactor = 1) {
  const suitId = Math.floor(num / 10);
  const valueId = num % 10;

  return `${valueId * -130.5 * scaleFactor}px ${suitId * -226 * scaleFactor}px`;
}

export function cardToScore(num) {
  let score = num % 10;

  if (score === 0) {
    score = 11;
  } else if (score === 2) {
    score = 10;
  } else if (score === 9) {
    score = 4;
  } else if (score === 8) {
    score = 3;
  } else if (score === 7) {
    score = 2;
  } else {
    score = 0;
  }

  return score;
}

export function cardToName(num) {
  return cardNameMapping[num];
}

export const cardNameMapping = [
  "Ace of Coins",
  "Two of Coins",
  "Three of Coins",
  "Four of Coins",
  "Five of Coins",
  "Six of Coins",
  "Seven of Coins",
  "Knave of Coins",
  "Knight of Coins",
  "King of Coins",
  "Ace of Cups",
  "Two of Cups",
  "Three of Cups",
  "Four of Cups",
  "Five of Cups",
  "Six of Cups",
  "Seven of Cups",
  "Knave of Cups",
  "Knight of Cups",
  "King of Cups",
  "Ace of Batons",
  "Two of Batons",
  "Three of Batons",
  "Four of Batons",
  "Five of Batons",
  "Six of Batons",
  "Seven of Batons",
  "Knave of Batons",
  "Knight of Batons",
  "King of Batons",
  "Ace of Swords",
  "Two of Swords",
  "Three of Swords",
  "Four of Swords",
  "Five of Swords",
  "Six of Swords",
  "Seven of Swords",
  "Knave of Swords",
  "Knight of Swords",
  "King of Swords",
];

export const wonArrToTotalScore = (arr, playerId) => {
  let wonByThisPlayer = arr.filter((record) => record.player === playerId);

  return wonByThisPlayer.reduce(
    (acc, record) => acc + cardToScore(record.cards[0]) + cardToScore(record.cards[1]),
    0
  );
};

export const drawnToPlayerValueDrawn = (drawn, playerId) => {
  let drawnByThisPlayer = drawn.filter((record) => record.player === playerId);

  return drawnByThisPlayer.reduce(
    (acc, record) => acc + cardToPower(record.card),
    0
  );
};

export const gameToPlayerBriscolaDrawn = (game, playerId) => {
  let drawnByThisPlayer = game?.drawn.filter((record) => record.player === playerId);

  return drawnByThisPlayer?.reduce(
    (acc, record) => {
      const isBriscola = cardToSuit(record.card) === game?.trumps ? 1 : 0;
      return acc + isBriscola;
    },
    0
  );
};

export const winningCardFromArray = (arr, game) => trickWon(arr[0], arr[1], game) ? arr[1] : arr[0];

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

function trickWon(bottomCard, topCard, game) {
  const trumps = game.trumps;
  const bottomCardSuit = cardToSuit(bottomCard);
  const topCardSuit = cardToSuit(topCard);

  if (bottomCardSuit === trumps && topCardSuit !== trumps) {
    // console.log("you lost! They played trumps and you didn't");
    return false;

  } else if (bottomCardSuit !== trumps && topCardSuit === trumps) {
    // console.log("you won! You played trumps and they didn't");
    return true; 
  }
  
  if (bottomCardSuit !== topCardSuit) {
    // console.log("you lost! you couldn't follow suit");
    return false;
  }

  if (cardToPower(bottomCard) > cardToPower(topCard)) {
    // console.log("you lost! their card was more powerful");
    return false;
  } else {
    // console.log("you won! your card was more powerful");
    return true;
  }
}

export function idToName(id, game) {
  if (id === game.host ) {
    return game.hostDisplayName || "Host";
  } else {
    return game.oppoDisplayName || "Opponent";
  }
}