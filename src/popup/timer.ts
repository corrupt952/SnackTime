// NOTE: Scripts executed by chrome.scripting.executeScript can only reference functions and values in this function scope
//       Therefore, it is necessary to define the same functions as those defined outside.
export const addTimer = (initialTime: number) => {
  const formattedTime = (time: number) => {
    const h = String(Math.floor(time / 3600)).padStart(2, "0");
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    if (h === "00") {
      return `${m}:${s}`;
    }
    return `${h}:${m}:${s}`;
  };

  // Alarm
  class Alarm {
    constructor(private readonly audioContext: AudioContext = new window.AudioContext()) {}

    play() {
      this.audioContext.resume();
      const startTime = this.audioContext.currentTime;
      const beepFrequency = 800; /* Frequency in Hz */

      Array.from({ length: 3 }).forEach((_, index) => {
        const beep = this.createBeep(beepFrequency, startTime + index * 0.2);
        if (!beep) {
          return;
        }
        beep.start(startTime + index * 0.2);
        beep.stop(startTime + index * 0.2 + 0.1);
      });
    }

    private createBeep(frequency: number, startTime: number) {
      if (!this.audioContext.createOscillator) {
        alert("Your browser does not support the Web Audio API");
        return;
      }
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      return oscillator;
    }
  }

  const createTimerBoard = () => {
    // Initialize
    const alarm = new Alarm();

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
        board.style.right = `${window.innerWidth - timerX - board.offsetWidth}px`;
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

    const playAlarm = () => {
      Array.from({ length: 3 }).forEach((_, index) => {
        setTimeout(() => {
          alarm.play();
        }, index * 1200);
      });
    };

    const start = () => {
      timerId = window.setInterval(() => {
        remaining -= interval;
        if (remaining <= 0) {
          teardown();
          playAlarm();
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
