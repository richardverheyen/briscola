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
      const vw = window.innerWidth;
      const deck = {
        bottom: 0.6 * vh,
        translateY: vw < 500 ? -0.4 * vh : -0.1 * vh,
      };

      document.documentElement.style.setProperty("--doc-height", `${vh}px`);
      document.documentElement.style.setProperty("--deck-bottom", `${deck.bottom}px`);
      document.documentElement.style.setProperty("--deck-translateY", `${deck.translateY}px`);
    };
    window.addEventListener("resize", appHeight);
    appHeight();
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
