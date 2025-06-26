import { Settings } from "@/domain/settings/models/settings";
import styles from "@/styles/globals.css?inline";
import { ColorScheme } from "@/types/enums/ColorScheme";
import { NotificationType } from "@/types/enums/NotificationType";
import React from "react";
import { createRoot } from "react-dom/client";
import Timer from "./Timer";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  sendResponse("Received");
  const { duration } = message;
  const settings = await Settings.get();

  const contentRoot = document.createElement("div");
  contentRoot.id = "snack-time-root";
  contentRoot.style.display = "block";
  contentRoot.style.position = "fixed";

  // Apply timer position based on settings
  switch (settings.timerPosition) {
    case "top-left":
      contentRoot.style.top = "10px";
      contentRoot.style.left = "10px";
      break;
    case "top-right":
      contentRoot.style.top = "10px";
      contentRoot.style.right = "10px";
      break;
    case "bottom-left":
      contentRoot.style.bottom = "10px";
      contentRoot.style.left = "10px";
      break;
    case "bottom-right":
      contentRoot.style.bottom = "10px";
      contentRoot.style.right = "10px";
      break;
    case "center":
      contentRoot.style.top = "50%";
      contentRoot.style.left = "50%";
      contentRoot.style.transform = "translate(-50%, -50%)";
      break;
    default:
      contentRoot.style.top = "10px";
      contentRoot.style.right = "10px";
  }
  contentRoot.style.zIndex = "calc(infinity)";
  contentRoot.style.pointerEvents = "auto";
  document.body.append(contentRoot);

  // Dragging
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let timerX = 0;
  let timerY = 0;
  contentRoot.addEventListener("mousedown", (event) => {
    if (event.target === contentRoot || event.target === shadowContainer) {
      event.stopPropagation();
      event.preventDefault();
      isDragging = true;
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    }
  });
  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      event.stopPropagation();
      event.preventDefault();
      timerX = event.clientX - offsetX;
      timerY = event.clientY - offsetY;

      // Reset position styles to allow free dragging
      contentRoot.style.top = "";
      contentRoot.style.bottom = "";
      contentRoot.style.left = "";
      contentRoot.style.right = "";
      contentRoot.style.transform = "";

      contentRoot.style.left = `${timerX}px`;
      contentRoot.style.top = `${timerY}px`;
    }
  });
  document.addEventListener("mouseup", (event) => {
    if (isDragging) {
      event.stopPropagation();
      event.preventDefault();
      isDragging = false;
    }
  });

  const shadowRoot = contentRoot.attachShadow({ mode: "closed" });
  const shadowContainer = document.createElement("div");
  shadowContainer.id = "snack-time-container";
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
      <Timer
        initialTime={duration}
        close={deleteRoot}
        soundEnabled={settings.notificationType === NotificationType.Alarm}
        alarmSound={settings.alarmSound}
        volume={settings.volume}
      />
    </React.StrictMode>,
  );
});
