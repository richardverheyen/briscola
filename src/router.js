import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Auth } from "contexts";
import Home from "components/Home";
import Game from "components/Game";

function Router() {
  const { auth, signIn } = useContext(Auth);

  useEffect(() => {
    signIn();
  }, []);

  return auth ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<Game />} />
    </Routes>
  ) : null;
}

export default Router;
