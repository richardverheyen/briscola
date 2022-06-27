import { Auth, AuthProvider } from "./Auth";
import { User, UserProvider } from "./User";
import { Game, GameProvider } from "./Game";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { Auth, User, Game, Providers };
