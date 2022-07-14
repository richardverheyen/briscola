import { Auth, AuthProvider } from "./AuthContext";
import { AnimationState, AnimationStateProvider } from "./AnimationStateContext";
import { Game, GameProvider } from "./GameContext";
import { Hand, HandProvider } from "./HandContext";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimationStateProvider>
          <GameProvider>
            <HandProvider>
              {children}
            </HandProvider>
          </GameProvider>
        </AnimationStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { Auth, AnimationState, Game, Hand, Providers };
