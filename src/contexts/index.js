import { Auth, AuthProvider } from "./AuthContext";
import { Game, GameProvider } from "./GameContext";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { Auth, Game, Providers };
