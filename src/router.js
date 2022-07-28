import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import toast from "react-hot-toast";

import { Auth } from "contexts";
import HomePage from "components/HomePage";
import GamePage from "components/GamePage";
import RulesPage from "components/RulesPage";
import Alert from "components/Alert";

import { useSelector } from "react-redux";
import { SW_INIT, SW_UPDATE } from "./types";

function Router() {
  const { auth, signIn } = useContext(Auth);

  const isServiceWorkerInitialized = useSelector(
    (state) => state.serviceWorkerInitialized
  );
  const isServiceWorkerUpdated = useSelector(
    (state) => state.serviceWorkerUpdated
  );
  const serviceWorkerRegistration = useSelector(
    (state) => state.serviceWorkerRegistration
  );

  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration.waiting;

    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: "SKIP_WAITING" });

      registrationWaiting.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") {
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    if (isServiceWorkerInitialized) {
      toast(
        (t) => (
          <span>
            <Alert text="Service Worker is initialized for the first time" type={SW_INIT} />
            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </span>
        ),
        {
          duration: 6000,
        }
      );
    }
    return toast.dismiss
  }, [isServiceWorkerInitialized]);

  useEffect(() => {
    if (isServiceWorkerUpdated) {
      toast(
        (t) => (
          <span>
            There is a new version available.
            <Alert
              text="There is a new version available."
              buttonText="Update"
              type={SW_UPDATE}
              onClick={updateServiceWorker}
            />
            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </span>
        ),
        {
          duration: 6000,
        }
      );
    }
    return toast.dismiss
  }, [isServiceWorkerUpdated]);

  useEffect(() => {
    signIn();

    const appHeight = () => {
      const vh = window.innerHeight;
      const hingePoint = 0.15 * vh;
      const hingePointInverse = -0.15 * vh;
      const deckBottom = (window.innerWidth < 500 ? 0.75 : 0.5) * vh;
      const trickBottom = (window.innerWidth < 500 ? 0.65 : 0.5) * vh;

      document.documentElement.style.setProperty("--doc-height", `${vh}px`);
      document.documentElement.style.setProperty(
        "--hinge-point",
        `${hingePoint}px`
      );
      document.documentElement.style.setProperty(
        "--hinge-point-inverse",
        `${hingePointInverse}px`
      );
      document.documentElement.style.setProperty(
        "--deck-bottom",
        `${deckBottom}px`
      );
      document.documentElement.style.setProperty(
        "--trick-bottom",
        `${trickBottom}px`
      );
    };
    window.addEventListener("resize", appHeight);
    appHeight();

    return () => {
      window.removeEventListener("resize", appHeight);
    };
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
