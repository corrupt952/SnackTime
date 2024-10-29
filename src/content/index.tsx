import React from "react";
import Content from "./Content";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse("Received");
  const { duration, notificationType } = message;
  const soundEnabled = notificationType === "alarm";

  const contentRoot = document.createElement("div");
  contentRoot.id = "snack-time-root";
  contentRoot.style.display = "contents";
  contentRoot.style.position = "fixed";
  contentRoot.style.top = "10px";
  contentRoot.style.right = "10px";
  contentRoot.style.zIndex = "10000";
  contentRoot.style.backgroundColor = "white";
  contentRoot.style.borderRadius = "10px";
  contentRoot.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.8)";
  contentRoot.style.fontSize = "2rem";
  contentRoot.style.display = "grid";
  contentRoot.style.gridTemplateRows = "1fr auto";
  contentRoot.style.color = "black";
  contentRoot.style.fontFamily = "Arial, sans-serif";
  document.body.append(contentRoot);

  // Dragging
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let timerX = 0;
  let timerY = 0;
  contentRoot.addEventListener("mousedown", (event) => {
    event.stopPropagation();
    event.preventDefault();

    isDragging = true;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
  });
  document.addEventListener("mousemove", (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (isDragging) {
      timerX = event.clientX - offsetX;
      timerY = event.clientY - offsetY;
      contentRoot.style.top = `${timerY}px`;
      contentRoot.style.right = `${window.innerWidth - timerX - contentRoot.offsetWidth}px`;
    }
  });
  document.addEventListener("mouseup", (event) => {
    event.stopPropagation();
    event.preventDefault();

    isDragging = false;
  });

  const shadowRoot = contentRoot.attachShadow({ mode: "open" });
  const shadowContainer = document.createElement("div");
  shadowContainer.id = "root";
  shadowContainer.style.display = "contents";
  shadowRoot.appendChild(shadowContainer);

  const cache = createCache({ key: "snack-time", prepend: true, container: shadowRoot });
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  const deleteRoot = () => {
    if (contentRoot) {
      contentRoot.remove();
    }
  };

  createRoot(shadowContainer).render(
    <React.StrictMode>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Content initialTime={duration} close={deleteRoot} soundEnabled={soundEnabled} />
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>,
  );
});