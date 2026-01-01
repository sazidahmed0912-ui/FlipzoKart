import React from "react";
import ReactDOM from "react-dom/client";
import AppWithLoading from "./App";
import { CartProvider } from "./context/CartContext";
import BackButtonHandler from "./components/BackButtonHandler";
import { GlobalLoaderOverlay } from "./components/loaders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CartProvider>
    <BackButtonHandler>
      <AppWithLoading />
      <GlobalLoaderOverlay />
    </BackButtonHandler>
  </CartProvider>
);
