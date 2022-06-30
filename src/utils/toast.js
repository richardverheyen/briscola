import toast from "react-hot-toast";
import { cardToScore } from "utils/helpers";

export function yourTurnToDraw(game, userId) {
  if (game.gameState === "draw" && game.currentPlayersTurn === userId) {
    toast("It's your turn to draw");

    if (game.deckHeight % 2 === 0) {
      toast.success("You won that hand");
    }
  }
}

export function scoreboardShown(game, userId) {
  if (game.gameState === "scoreboard") {
    toast("It's your turn to draw");

    if (game.currentPlayersTurn === userId) {
      toast(
        "You won with a score of " +
          game[userId].reduce((acc, card) => acc + cardToScore(card), 0),
        {
          icon: "🎉",
          duration: 6000,
        }
      );
    } else {
      toast(
        "You lost with a score of " +
          game[userId].reduce((acc, card) => acc + cardToScore(card), 0),
        {
          icon: "👏",
        }
      );
    }
  }
}

export function playCardError(game) {
  if (game.gameState !== "play") {
    toast.error("You can't play a card right now");
  } else {
    toast.error("It's not your turn to play");
  }
}

export function drawCardError(game) {
  if (game.gameState !== "draw") {
    toast.error("You can't draw a card right now");
  } else {
    toast.error("It's not your turn to draw");
  }
}

export function takeCardError(game) {
  if (game.gameState !== "draw") {
    toast.error("These aren't yours to take");
  }
}
