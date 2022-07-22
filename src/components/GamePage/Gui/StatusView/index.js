import { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { Auth, Game } from "contexts";
import { wonArrToTotalScore } from "utils/helpers";

export default function StatusView() {
  const { auth } = useContext(Auth);
  const { game, isTurn, enemyId, enemyName } = useContext(Game);
  const [status, setStatus] = useState("");
  const [reviveToast, setReviveToast] = useState(undefined);

  useEffect(() => {
    if (!game || !auth) return;

    // if there's a stored toast message, clear it
    clearTimeout(reviveToast);
    setReviveToast(undefined);
    toast.dismiss(status);

    if (isTurn && game.gameState === "draw") {
      toast.success("You won that hand");
    }

    addToast();

    return toast.dismiss;
  }, [game, auth]);

  function addToast() {
    let newToastMessage, newToastEmoji;
    let playersTurnsName = isTurn
      ? "your"
      : enemyName
      ? `${enemyName}'s`
      : "their";

    switch (game.gameState) {
      case "draw":
        newToastMessage = `It's ${playersTurnsName} turn to draw.`;
        newToastEmoji = isTurn ? "🆙" : "⌛";
        document.title = `Briscola ${isTurn ? "🆙" : "⌛"}`;
        break;

      case "play":
        newToastMessage = `It's ${playersTurnsName} turn to play.`;
        newToastEmoji = isTurn ? "🃏" : "⌛";
        document.title = `Briscola ${isTurn ? "🃏" : "⌛"}`;
        break;

      case "over":
        const egoScore = wonArrToTotalScore(game.won, auth.uid);
        const enemyScore = wonArrToTotalScore(game.won, enemyId);

        if (egoScore === 60) {
          newToastMessage = "The game was a tie! 60 - 60.";
          newToastEmoji = "👏";
          document.title = "Briscola 👏";
        } else if (egoScore < 60) {
          newToastMessage = `${enemyName} won with a score of ${enemyScore} - ${egoScore}.`;
          newToastEmoji = "👏";
          document.title = "Briscola 👏";
        } else if (egoScore > 60) {
          newToastMessage = `You won with a score of ${egoScore} - ${enemyScore}.`;
          newToastEmoji = "🎉";
          document.title = "Briscola 🎉";
        }
        break;
    }

    const toastId = toast(<div onClick={dismissToast}>{newToastMessage}</div>, {
      icon: newToastEmoji,
      duration: Infinity,
    });

    setStatus(toastId);
  }

  function dismissToast(t) {
    toast.dismiss(t.id);
    setReviveToast(setTimeout(addToast, 10000));
  }

  return null;
}
