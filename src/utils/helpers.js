export function spritePosition(num) {
  const suitId = Math.floor(num / 10);
  const valueId = num % 10;
  return `${valueId * -130.5}px ${suitId * -226}px`;
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
