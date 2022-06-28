import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { Auth } from "contexts";
import Home from "components/Home";
import Game from "components/Game";

function Router() {
  const { auth } = useContext(Auth);

  return auth ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<Game />} />
    </Routes>
  ) : (
    <p>making you a temporary account</p>
  );
}

export default Router;
