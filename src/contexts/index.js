import { Auth, AuthProvider } from "./AuthContext";
import { Game, GameProvider } from "./GameContext";
import { Hand, HandProvider } from "./HandContext";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <HandProvider>
            {children}
          </HandProvider>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { Auth, Game, Hand, Providers };
