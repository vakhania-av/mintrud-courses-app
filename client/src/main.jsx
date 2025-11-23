import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

try {
  const root = document.getElementById("root");

  if (!root) {
    throw new Error("Не найден корневой элемент с id 'root'");
  }

  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error(err);
}
