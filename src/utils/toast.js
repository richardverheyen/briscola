import toast from "react-hot-toast";

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
          href="#"
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