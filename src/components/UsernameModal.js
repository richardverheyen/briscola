import { useContext } from "react";
import { Auth, Game } from "contexts";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { updateProfile } from "firebase/auth";
import { greetUser } from "utils/toast";
import toast from 'react-hot-toast';
import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

export default function UsernameModal() {
  const gameInteract = httpsCallable(functions, "gameInteract");
  const { auth, openUsernameModal, setOpenUsernameModal } =
    useContext(Auth);
  const { id, game } = useContext(Game);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateProfile(auth, {
        displayName: document.getElementById('nickname').value,
      })
      if (game) {
        await gameInteract({ id, func: "updateUsernameInGame" })
      }
      greetUser(auth);

    } catch (error) {
      toast.error("For some reason, that didn't work. Sorry!");
    } finally {
      setOpenUsernameModal(false);
    }
       
  }

  return (
    <Dialog
      open={openUsernameModal}
      onClose={() => setOpenUsernameModal(false)}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Set Username</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You've got an anonymous account, but you can still set a Username
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="nickname"
            label="Your alias"
            type="nickname"
            fullWidth
            variant="standard"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsernameModal(false)}>Cancel</Button>
          <Button type="submit">Set</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
