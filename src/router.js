import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Auth } from "contexts";
import HomePage from "components/HomePage";
import GamePage from "components/GamePage";
import RulesPage from "components/RulesPage";

function Router() {
  const { auth, signIn } = useContext(Auth);

  useEffect(() => {
    signIn();

    const appHeight = () => {
      const vh = window.innerHeight;
      const hingePoint = 0.15 * vh;
      const hingePointInverse = -0.15 * vh;
      const deckBottom = (window.innerWidth < 500 ? 0.75 : 0.5) * vh;
      const trickBottom = (window.innerWidth < 500 ? 0.65 : 0.5) * vh;

      document.documentElement.style.setProperty("--doc-height", `${vh}px`);
      document.documentElement.style.setProperty("--hinge-point", `${hingePoint}px`);
      document.documentElement.style.setProperty("--hinge-point-inverse", `${hingePointInverse}px`);
      document.documentElement.style.setProperty("--deck-bottom", `${deckBottom}px`);
      document.documentElement.style.setProperty("--trick-bottom", `${trickBottom}px`);
    };
    window.addEventListener("resize", appHeight);
    appHeight();

    return () => {
      window.removeEventListener("resize", appHeight);
    }
  }, []);

  return auth ? (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:id" element={<GamePage />} />
      <Route path="/rules" element={<RulesPage />} />
    </Routes>
  ) : null;
}

export default Router;
