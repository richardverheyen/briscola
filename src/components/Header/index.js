import "./style.scss";
import { useEffect, useState, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const NavDrawer = lazy(() => import("./NavDrawer"));

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
          pathname === "/rules" ? <p className="back" onClick={() => navigate(-1)}>Go Back</p> : null
        }
        
        <IconButton aria-label="menu" size="large" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Suspense fallback={null}>
          <NavDrawer toggleDrawer={toggleDrawer} navOpen={navOpen} />
        </Suspense>

        
      </div>
    </header>
  );
}
