import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AnimationProvider } from "./context/AnimationContext";
import BackButtonHandler from "./components/BackButtonHandler";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AnimationProvider>
    <CartProvider>
      <BackButtonHandler>
        <App />
      </BackButtonHandler>
    </CartProvider>
  </AnimationProvider>
);
