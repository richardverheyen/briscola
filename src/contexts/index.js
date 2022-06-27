import { Auth, AuthProvider } from "./Auth";
import { Game, GameProvider } from "./Game";
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
