/**
 * This file serves as the entry point for the application.
 * It imports the necessary dependencies and renders the root component.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
