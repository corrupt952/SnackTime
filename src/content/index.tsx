import { Settings } from "@/domain/settings/models/settings";
import styles from "@/styles/globals.css?inline";
import { ColorScheme } from "@/types/enums/ColorScheme";
import { NotificationType } from "@/types/enums/NotificationType";
import React from "react";
import { createRoot } from "react-dom/client";
import Content from "./Content";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  sendResponse("Received");
  const { duration } = message;
  const settings = await Settings.get();

  const contentRoot = document.createElement("div");
  contentRoot.id = "snack-time-root";
  contentRoot.style.display = "contents";
  contentRoot.style.position = "fixed";
  contentRoot.style.top = "10px";
  contentRoot.style.right = "10px";
  contentRoot.style.zIndex = "calc(infinity)";
  contentRoot.style.backgroundColor = "transparent";
  contentRoot.style.borderRadius = "10px";
  contentRoot.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.8)";
  contentRoot.style.fontSize = "2rem";
  contentRoot.style.display = "grid";
  contentRoot.style.gridTemplateRows = "1fr auto";
  contentRoot.style.color = "black";
  contentRoot.style.fontFamily = "Arial, sans-serif";
  contentRoot.style.pointerEvents = "auto";
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

  if (settings.colorScheme === ColorScheme.System || !settings.colorScheme) {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    shadowContainer.classList.add(isDarkMode ? "dark" : "light");
  } else {
    shadowContainer.classList.add(settings.colorScheme);
  }

  const deleteRoot = () => {
    if (contentRoot) {
      contentRoot.remove();
    }
  };

  createRoot(shadowContainer).render(
    <React.StrictMode>
      <style>{styles}</style>
      <Content
        initialTime={duration}
        close={deleteRoot}
        soundEnabled={settings.notificationType === NotificationType.Alarm}
        alarmSound={settings.alarmSound}
        volume={settings.volume}
      />
    </React.StrictMode>,
  );
});
