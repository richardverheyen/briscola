import './style.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { Providers } from "contexts";
import { Toaster } from 'react-hot-toast';

import Router from "router";
import Header from "components/Header";
import UsernameModal from "components/UsernameModal";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Providers>
      <Header />
      <Router />
      <Toaster />
      <UsernameModal />
    </Providers>
  </React.StrictMode>
);
