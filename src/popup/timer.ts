// NOTE: Scripts executed by chrome.scripting.executeScript can only reference functions and values in this function scope
//       Therefore, it is necessary to define the same functions as those defined outside.
export const addTimer = (initialTime: number) => {
  const createElement = (tag: string, styles: Partial<CSSStyleDeclaration> = {}) => {
    const element = document.createElement(tag);
    Object.assign(element.style, styles);
    return element;
  };

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
      Array.from({ length: 3 }).forEach((_, index) => {
        setTimeout(() => {
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
        }, index * 1200);
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
    const board = createElement("div", {
      position: "fixed",
      top: "10px",
      right: "10px",
      zIndex: "10000",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
      fontSize: "2rem",
      display: "grid",
      gridTemplateRows: "1fr auto",
      color: "black",
      fontFamily: "Arial, sans-serif",
    });
    document.body.appendChild(board);

    let timerText: HTMLSpanElement;
    {
      // Body
      const body = createElement("div", {
        display: "grid",
        placeItems: "center",
        padding: "0.5rem 1rem",
      });
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
      const controls = createElement("div", {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
      });
      board.appendChild(controls);
      // Base Button
      const buttonStyles = {
        fontSize: "1rem",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "0.5rem",
        cursor: "pointer",
      };
      {
        // Start
        const startButton = createElement("button", {
          ...buttonStyles,
          backgroundColor: "#4CAF50",
          color: "white",
        });
        startButton.textContent = "Start";
        startButton.addEventListener("click", () => start());
        controls.appendChild(startButton);
      }
      {
        // Stop
        const stopButton = createElement("button", {
          ...buttonStyles,
          backgroundColor: "#f44336",
          color: "white",
        });
        stopButton.textContent = "Stop";
        stopButton.addEventListener("click", () => teardown());
        controls.appendChild(stopButton);
      }
      {
        // Close
        const closeButton = createElement("button", {
          ...buttonStyles,
          backgroundColor: "gray",
          color: "white",
        });
        closeButton.textContent = "Close";
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

    const start = () => {
      timerId = window.setInterval(() => {
        remaining -= interval;
        if (remaining <= 0) {
          teardown();
          alarm.play();
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
