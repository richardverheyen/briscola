import { useState, createContext } from "react";

export const AnimationState = createContext({
  cards: []
});

function AnimationStateHooks() {
  const [playCardAnimationRunning, setPlayCardAnimationRunning] = useState(false);

  return {
    playCardAnimationRunning,
    setPlayCardAnimationRunning,
  };
}

export function AnimationStateProvider({ children }) {
  const hooks = AnimationStateHooks();

  return <AnimationState.Provider value={hooks}>{children}</AnimationState.Provider>;
}
