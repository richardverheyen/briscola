import Drawer from "@mui/material/Drawer";
import './style.scss';

export default function TemporaryDrawer({ navOpen, toggleDrawer }) {
  return (
    <Drawer anchor="right" open={navOpen} onClose={toggleDrawer(false)}>
      <nav
        id="NavDrawer"
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <div className="gutters">
          <p>your name is 203984203948203948</p>
          <p>update your username</p>
        </div>
      </nav>
    </Drawer>
  );
}
