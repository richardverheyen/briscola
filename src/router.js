import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Auth } from "contexts";
import HomePage from "components/HomePage";
import GamePage from "components/GamePage";

function Router() {
  const { auth, signIn } = useContext(Auth);

  useEffect(() => {
    signIn();

    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('-main-bg-color', `${window.innerHeight}px`);
      console.log('foo');
     }
     window.addEventListener('resize', appHeight)
     appHeight()

  }, []);

  return auth ? (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  ) : null;
}

export default Router;
