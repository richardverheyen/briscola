import "./style.scss";
import { useContext } from "react";
import { Auth, Game } from "contexts";
import { Link } from "react-router-dom";
import {
  linkWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { firebaseAuth } from "utils/firebase";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function TemporaryDrawer({ navOpen, toggleDrawer }) {
  const { auth, setOpenUsernameModal } = useContext(Auth);
  let { game, quitGame } = useContext(Game);

  async function linkAccount() {
    // https://firebase.google.com/docs/auth/web/account-linking
    const provider = new GoogleAuthProvider();

    linkWithPopup(firebaseAuth.currentUser, provider).then((result) => {
      console.log('account successfully linked', {result});
    }).catch((error) => {
      console.error({error});
    });
  }

  return (
    <Drawer anchor="right" open={navOpen} onClose={toggleDrawer(false)}>
      <nav id="NavDrawer" role="presentation">
        <div className="gutters">
          <IconButton
            aria-label="close"
            size="large"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <CloseIcon />
          </IconButton>

          <div className="name">Hi {auth?.displayName}</div>

          {game && (
            <Button
              variant="contained"
              onClick={(e) => {
                quitGame();
                toggleDrawer(false)(e);
              }}
            >
              Quit Game
            </Button>
          )}

          <Button variant="outlined" onClick={linkAccount}>
            Sign in with Google
          </Button>

          <Button variant="text" onClick={() => setOpenUsernameModal(true)}>
            Update your name
          </Button>

          <Link to="/rules">
            <Button variant="outlined">Briscola Rules</Button>
          </Link>
        </div>
      </nav>
    </Drawer>
  );
}
