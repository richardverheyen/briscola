import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import NavDrawer from "./NavDrawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setNavOpen(open);
  };

  return (
    <header id="header">
      <div className="gutters">
        {
          pathname === "/rules" ? <a href="#" onClick={() => navigate(-1)}>Go Back</a> : null
        }
        
        <IconButton aria-label="menu" size="large" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <NavDrawer toggleDrawer={toggleDrawer} navOpen={navOpen} />
      </div>
    </header>
  );
}
