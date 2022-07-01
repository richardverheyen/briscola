import "./style.scss";
import { useContext } from "react";
import { Auth, Game } from "contexts";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function TemporaryDrawer({ navOpen, toggleDrawer }) {
  const { auth, setOpenUsernameModal } = useContext(Auth);
  let { game, quitGame } = useContext(Game);

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
            <Button variant="contained" onClick={(e) => {
              quitGame();
              toggleDrawer(false)(e);
            }}>
              Quit Game
            </Button>
          )}

          <Button variant="text" onClick={() => setOpenUsernameModal(true)}>
            Update your name
          </Button>
          
        </div>
      </nav>
    </Drawer>
  );
}
