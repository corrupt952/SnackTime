const addTimer = (initialTime: number) => {
  const formattedTime = (time: number) => {
    const h = String(Math.floor(time / 3600)).padStart(2, "0");
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const createTimerBoard = () => {
    // Board
    const board = document.createElement("div");
    board.style.position = "fixed";
    board.style.top = "10px";
    board.style.right = "10px";
    board.style.zIndex = "10000";
    board.style.backgroundColor = "white";
    board.style.borderRadius = "10px";
    board.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.8)";
    board.style.fontSize = "2rem";
    board.style.display = "grid";
    board.style.gridTemplateRows = "1fr auto";
    document.body.appendChild(board);

    let timerText: HTMLSpanElement;
    {
      // Body
      const body = document.createElement("div");
      body.style.display = "grid";
      body.style.placeItems = "center";
      body.style.padding = "0.5rem 1rem";
      board.appendChild(body);
      {
        // Timer
        timerText = document.createElement("span");
        timerText.textContent = formattedTime(initialTime);
        body.appendChild(timerText);
      }
    }

    {
      // Controls
      const controls = document.createElement("div");
      controls.style.display = "grid";
      controls.style.gridTemplateColumns = "repeat(3, 1fr)";
      controls.style.gap = "0.5rem";
      controls.style.padding = "0.5rem 1rem";
      const baseButton = document.createElement("button");
      baseButton.style.fontSize = "1rem";
      baseButton.style.padding = "0.5rem 1rem";
      baseButton.style.border = "none";
      baseButton.style.borderRadius = "0.5rem";
      baseButton.style.cursor = "pointer";
      board.appendChild(controls);
      {
        // Start
        const startButton = baseButton.cloneNode() as HTMLButtonElement;
        startButton.style.backgroundColor = "#4CAF50";
        startButton.style.color = "white";
        startButton.textContent = "Start";
        startButton.addEventListener("click", () => {
          start();
        });
        controls.appendChild(startButton);
      }
      {
        // Stop
        const stopButton = baseButton.cloneNode() as HTMLButtonElement;
        stopButton.textContent = "Stop";
        stopButton.style.backgroundColor = "#f44336";
        stopButton.style.color = "white";
        stopButton.addEventListener("click", () => {
          teardown();
        });
        controls.appendChild(stopButton);
      }
      {
        // Close
        const closeButton = baseButton.cloneNode() as HTMLButtonElement;
        closeButton.textContent = "Close";
        closeButton.style.backgroundColor = "gray";
        closeButton.style.color = "white";
        closeButton.addEventListener("click", () => {
          teardown();
          board.remove();
        });
        controls.appendChild(closeButton);
      }
    }

    // Dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let timerX = 0;
    let timerY = 0;
    board.addEventListener("mousedown", (event) => {
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
        board.style.top = `${timerY}px`;
        board.style.right = `${
          window.innerWidth - timerX - board.offsetWidth
        }px`;
      }
    });
    document.addEventListener("mouseup", (event) => {
      event.stopPropagation();
      event.preventDefault();

      isDragging = false;
    });

    const interval = 1;
    let remaining = initialTime;
    let timerId: number | null = null;

    const teardown = () => {
      clearInterval(timerId!);
      timerId = null;
    };

    const updateText = (time: number) => {
      if (time <= 0) {
        timerText.textContent = "Time's up!";
      } else {
        timerText.textContent = formattedTime(time);
      }
    };

    const start = () => {
      timerId = window.setInterval(() => {
        remaining -= interval;
        if (remaining <= 0) {
          teardown();
          updateText(0);
          return;
        }
        updateText(remaining);
      }, interval * 1000);
    };

    if (timerId) {
      teardown();
    } else {
      start();
    }
  };

  createTimerBoard();
};

const startTimer = async (time: number) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: addTimer,
    args: [time],
  });
};

// Initialize popup.html
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("one-minute")?.addEventListener("click", async () => {
    await startTimer(60);
  });
  document
    .getElementById("three-minutes")
    ?.addEventListener("click", async () => {
      await startTimer(180);
    });
  document
    .getElementById("five-minutes")
    ?.addEventListener("click", async () => {
      await startTimer(300);
    });
  document
    .getElementById("ten-minutes")
    ?.addEventListener("click", async () => {
      await startTimer(600);
    });
  document
    .getElementById("custom-time")
    ?.addEventListener("click", async () => {
      const time = Number(
        prompt("Enter timer seconds in seconds:", String(300))
      );
      await startTimer(time);
    });
});
