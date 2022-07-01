import { useState, useContext } from "react";
import { Auth } from "contexts";
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

export default function UsernameModal() {
  const { auth, user, openUsernameModal, setOpenUsernameModal } =
    useContext(Auth);

  function handleSubmit(e) {
    e.preventDefault();
    updateProfile(auth, {
      displayName: document.getElementById('given-name').value,
    })
      .then(
        function () {
          greetUser(auth);
        },
        function (error) {
          toast.error("For some reason, that didn't work. Sorry!");
        }
      )
      .finally(() => {
        setOpenUsernameModal(false);
      });
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
            id="given-name"
            label="Your given name"
            type="given-name"
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
