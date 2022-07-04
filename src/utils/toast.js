import toast from "react-hot-toast";
import { wonArrToTotalScore } from "utils/helpers";

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

    if (wonArrToTotalScore(game.won, userId) > 60) {
      toast(
        "You won with a score of " +
        wonArrToTotalScore(game.won, userId),
        {
          icon: "🎉",
          duration: 6000,
        }
      );
    } else if (wonArrToTotalScore(game.won, userId) < 60) {
      toast(
        "You lost with a score of " +
          wonArrToTotalScore(game.won, userId),
        {
          icon: "👏",
        }
      );
    } else {
      toast("The game was a tie! 60 - 60");
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

export function promptSetUsername(openModal) {
  toast(
    (t) => (
      <span>
        Would you like to quickly{" "}
        <a
          style={{ textDecoration: "underline", cursor: "pointer" }}

          onClick={() => {
            openModal();
            toast.dismiss(t.id);
          }}
        >
          set a username
        </a>
        ?
      </span>
    ),
    {
      duration: 6000,
      icon: '👋',
    }
  );
}

export function greetUser(auth) {
  toast(`Nice to meet you ${auth.displayName}`, {
    icon: '🤝'
  });
}