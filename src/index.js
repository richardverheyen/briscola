import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Providers } from "contexts";
import { Toaster } from "react-hot-toast";
import { SW_INIT, SW_UPDATE } from "./types";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store";

import Router from "router";
import Header from "components/Header";
import UsernameModal from "components/UsernameModal";

const store = configureStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Providers>
        <Header />
        <Router />
        <Toaster />
        <UsernameModal />
      </Providers>
    </Provider>
  </React.StrictMode>
);

// https://github.com/gglukmann/cra-sw/blob/master/src/index.js
serviceWorker.register({
  onSuccess: () => store.dispatch({ type: SW_INIT }),
  onUpdate: (registration) =>
    store.dispatch({ type: SW_UPDATE, payload: registration }),
});
