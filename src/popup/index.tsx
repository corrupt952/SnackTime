import React from "react";
import { createRoot } from "react-dom/client";
import "@/i18n";
import Popup from "./Popup";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
