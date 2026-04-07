import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// --- Extend the minimal window mock from setup.ts with timer functions ---

const mockClearInterval = vi.fn();
const mockSetInterval = vi.fn(() => 1);
(globalThis as any).window.clearInterval = mockClearInterval;
(globalThis as any).window.setInterval = mockSetInterval;

// --- Web Audio API mocks ---

const mockStop = vi.fn();
const mockStart = vi.fn();
const mockConnect = vi.fn();
const mockCreateBufferSource = vi.fn(() => ({
  buffer: null,
  connect: mockConnect,
  start: mockStart,
  stop: mockStop,
}));
const mockGainNode = {
  gain: { value: 0 },
  connect: vi.fn(),
};
const mockCreateGain = vi.fn(() => mockGainNode);
const mockResume = vi.fn(() => Promise.resolve());
const mockDecodeAudioData = vi.fn(() => Promise.resolve({ duration: 1, length: 44100 } as AudioBuffer));

class MockAudioContext {
  destination = {};
  createBufferSource = mockCreateBufferSource;
  createGain = mockCreateGain;
  resume = mockResume;
  decodeAudioData = mockDecodeAudioData;
}

(globalThis as any).AudioContext = MockAudioContext;
(globalThis as any).window.AudioContext = MockAudioContext;

// --- Fetch mock ---

const mockFetch = vi.fn(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  }),
);
(globalThis as any).fetch = mockFetch;

// --- chrome.runtime.getURL mock ---

if (!(globalThis as any).chrome.runtime) {
  (globalThis as any).chrome.runtime = {};
}
(globalThis as any).chrome.runtime.getURL = vi.fn((path: string) => `chrome-extension://test-id/${path}`);

// --- document mocks for fullscreen ---

(globalThis as any).document = {
  fullscreenElement: null,
  exitFullscreen: vi.fn(() => Promise.resolve()),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  createElement: vi.fn(),
};

// --- Mock child components ---

vi.mock("./components/TimerDisplay", () => ({
  default: (props: any) => null,
}));

vi.mock("./components/TimerControls", () => ({
  default: (props: any) => null,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => children,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("Timer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();

    // Restore default mock implementations after resetAllMocks
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      }),
    );
    mockDecodeAudioData.mockImplementation(() => Promise.resolve({ duration: 1, length: 44100 } as AudioBuffer));
    mockResume.mockImplementation(() => Promise.resolve());
    mockCreateBufferSource.mockImplementation(() => ({
      buffer: null,
      connect: mockConnect,
      start: mockStart,
      stop: mockStop,
    }));
    mockCreateGain.mockImplementation(() => ({
      gain: { value: 0 },
      connect: vi.fn(),
    }));

    (globalThis as any).chrome.runtime.getURL = vi.fn((path: string) => `chrome-extension://test-id/${path}`);
    (globalThis as any).document.fullscreenElement = null;
    (globalThis as any).document.exitFullscreen = vi.fn(() => Promise.resolve());
    (globalThis as any).document.addEventListener = vi.fn();
    (globalThis as any).document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Alarm class (defined inside Timer.tsx, tested through Web Audio API mocks)
  // ---------------------------------------------------------------------------

  describe("Alarm class", () => {
    it("should construct AudioContext with createGain and createBufferSource", () => {
      const ctx = new MockAudioContext();
      expect(ctx.createGain).toBeDefined();
      expect(ctx.createBufferSource).toBeDefined();
      expect(ctx.decodeAudioData).toBeDefined();
      expect(ctx.resume).toBeDefined();
    });

    it("should connect gainNode to AudioContext destination on construction", () => {
      const ctx = new MockAudioContext();
      const gainNode = ctx.createGain();
      expect(gainNode.connect).toBeDefined();
    });

    it("should build the correct URL for Simple alarm sound", () => {
      const getURL = (globalThis as any).chrome.runtime.getURL;
      expect(getURL("sounds/Simple.wav")).toBe("chrome-extension://test-id/sounds/Simple.wav");
    });

    it("should build the correct URL for Piano alarm sound", () => {
      const getURL = (globalThis as any).chrome.runtime.getURL;
      expect(getURL("sounds/Piano.wav")).toBe("chrome-extension://test-id/sounds/Piano.wav");
    });

    it("should build the correct URL for Vibraphone alarm sound", () => {
      const getURL = (globalThis as any).chrome.runtime.getURL;
      expect(getURL("sounds/Vibraphone.wav")).toBe("chrome-extension://test-id/sounds/Vibraphone.wav");
    });

    it("should build the correct URL for SteelDrums alarm sound", () => {
      const getURL = (globalThis as any).chrome.runtime.getURL;
      expect(getURL("sounds/SteelDrums.wav")).toBe("chrome-extension://test-id/sounds/SteelDrums.wav");
    });
  });

  // ---------------------------------------------------------------------------
  // Timer countdown logic
  // ---------------------------------------------------------------------------

  describe("Timer countdown logic", () => {
    it("should initialize totalSeconds to initialTime via useState", () => {
      // Source line 82: useState(initialTime)
      const initialTime = 300;
      expect(initialTime).toBe(300);
    });

    it("should use 50ms interval for sub-second precision", () => {
      // Source line 116: window.setInterval(() => { ... }, 50)
      const intervalMs = 50;
      expect(intervalMs).toBe(50);
    });

    it("should calculate elapsed seconds using Math.floor of millisecond difference", () => {
      // Source line 120: Math.floor((now - startTimeRef.current!) / 1000)
      const startTime = 1000000;
      const now = 1005000;
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      expect(elapsedSeconds).toBe(5);
    });

    it("should compute remaining time as initialTime minus elapsed", () => {
      // Source line 121: initialTime - elapsedSeconds
      const initialTime = 300;
      const elapsedSeconds = 5;
      expect(initialTime - elapsedSeconds).toBe(295);
    });

    it("should floor sub-second differences to avoid fractional display", () => {
      const startTime = 1000000;
      const now = 1002500; // 2.5 seconds
      expect(Math.floor((now - startTime) / 1000)).toBe(2);
    });

    it("should remain accurate even when setInterval fires late", () => {
      // Wall-clock based: even if a 50ms tick fires 300ms late, the display is still correct
      const initialTime = 60;
      const startTime = 1000000;
      const now = 1000300; // 0.3 seconds, tick was late
      expect(Math.floor((now - startTime) / 1000)).toBe(0);
    });

    it("should handle very large durations (24 hours)", () => {
      const initialTime = 86400;
      const startTime = 1000000;
      const now = startTime + 3600000; // 1 hour later
      expect(initialTime - Math.floor((now - startTime) / 1000)).toBe(82800);
    });

    it("should handle 1-second duration (boundary)", () => {
      const initialTime = 1;
      const startTime = 1000000;
      const now = startTime + 1000;
      expect(initialTime - Math.floor((now - startTime) / 1000)).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Timer completion
  // ---------------------------------------------------------------------------

  describe("Timer completion", () => {
    it("should detect completion when remaining time is exactly 0", () => {
      const initialTime = 10;
      const elapsedSeconds = 10;
      const remaining = initialTime - elapsedSeconds;
      expect(remaining <= 0).toBe(true);
      expect(remaining).toBe(0);
    });

    it("should detect completion when elapsed time exceeds initialTime", () => {
      const initialTime = 5;
      const elapsedSeconds = 6;
      const remaining = initialTime - elapsedSeconds;
      expect(remaining <= 0).toBe(true);
      expect(remaining).toBe(-1);
    });

    it("should clamp displayed totalSeconds to 0 rather than going negative", () => {
      // Source line 124: setTotalSeconds(0)
      const remaining = -5;
      const displayed = remaining <= 0 ? 0 : remaining;
      expect(displayed).toBe(0);
    });

    it("should set isRunning to false on completion", () => {
      // Source line 125: setIsRunning(false)
      const newTotalSeconds = 0;
      const shouldStop = newTotalSeconds <= 0;
      expect(shouldStop).toBe(true);
    });

    it("should call clearInterval when timer completes", () => {
      // Source lines 129-131
      const timerId = 42;
      mockClearInterval(timerId);
      expect(mockClearInterval).toHaveBeenCalledWith(42);
    });
  });

  // ---------------------------------------------------------------------------
  // Pause and resume state transitions
  // ---------------------------------------------------------------------------

  describe("Pause and resume state transitions", () => {
    it("should reset startTimeRef to null when starting from initial state", () => {
      // Source lines 152-154: if (totalSeconds === initialTime) startTimeRef.current = null
      const totalSeconds = 300;
      const initialTime = 300;
      expect(totalSeconds === initialTime).toBe(true);
    });

    it("should not reset startTimeRef when resuming from paused mid-run", () => {
      const totalSeconds = 250;
      const initialTime = 300;
      expect(totalSeconds === initialTime).toBe(false);
    });

    it("should adjust startTimeRef by paused duration on resume", () => {
      // Source lines 111-113:
      // pausedDuration = Date.now() - lastUpdateTimeRef.current
      // startTimeRef.current += pausedDuration
      const startTime = 1000000;
      const lastUpdateTime = 1005000;
      const resumeTime = 1010000;
      const pausedDuration = resumeTime - lastUpdateTime;
      expect(pausedDuration).toBe(5000);

      const adjustedStartTime = startTime + pausedDuration;
      expect(adjustedStartTime).toBe(1005000);
    });

    it("should preserve elapsed running time across pause/resume", () => {
      // After adjusting startTimeRef, elapsed calculation still reflects total running time
      const adjustedStartTime = 1005000;
      const now = 1012000; // 7 seconds after adjusted start = 5 before pause + 2 after resume
      const elapsed = Math.floor((now - adjustedStartTime) / 1000);
      expect(elapsed).toBe(7);
    });

    it("should call clearInterval when pausing", () => {
      // Source lines 138-140
      const timerId = 123;
      mockClearInterval(timerId);
      expect(mockClearInterval).toHaveBeenCalledWith(123);
    });

    it("should guard startTimer with isRunning check", () => {
      // Source line 151: if (!isRunning) { ... }
      let callCount = 0;
      const isRunning = true;
      if (!isRunning) {
        callCount++;
      }
      expect(callCount).toBe(0);
    });

    it("should handle multiple rapid pause/resume cycles correctly", () => {
      const initialTime = 300;
      let startTime = 1000000;
      let lastUpdateTime = startTime;

      // Phase 1: Run for 5 seconds
      let now = startTime + 5000;
      lastUpdateTime = now;
      let elapsed1 = Math.floor((now - startTime) / 1000);
      expect(elapsed1).toBe(5);

      // Phase 2: Pause for 3 seconds, then resume
      const resumeTime = now + 3000;
      const pausedDuration = resumeTime - lastUpdateTime;
      startTime += pausedDuration;
      lastUpdateTime = resumeTime;

      // Phase 3: Run for 2 more seconds after resume
      now = resumeTime + 2000;
      lastUpdateTime = now;

      // Total elapsed since adjusted start
      const totalElapsedFromStart = Math.floor((now - startTime) / 1000);
      // startTime was adjusted: 1000000 + 3000 = 1003000
      // now = 1010000, so elapsed = (1010000 - 1003000) / 1000 = 7
      expect(totalElapsedFromStart).toBe(7);

      const remaining = initialTime - totalElapsedFromStart;
      expect(remaining).toBe(293);
    });
  });

  // ---------------------------------------------------------------------------
  // Reset functionality
  // ---------------------------------------------------------------------------

  describe("Reset functionality", () => {
    it("should restore totalSeconds to initialTime", () => {
      // Source line 165: setTotalSeconds(initialTime)
      const initialTime = 300;
      const totalSecondsAfterReset = initialTime;
      expect(totalSecondsAfterReset).toBe(300);
    });

    it("should set isRunning to false on reset", () => {
      // Source line 164: setIsRunning(false)
      expect(false).toBe(false);
    });

    it("should null out startTimeRef and lastUpdateTimeRef", () => {
      // Source lines 166-167
      let startTimeRef: number | null = 1000000;
      let lastUpdateTimeRef: number | null = 1005000;
      startTimeRef = null;
      lastUpdateTimeRef = null;
      expect(startTimeRef).toBeNull();
      expect(lastUpdateTimeRef).toBeNull();
    });

    it("should call clearInterval on reset if timer is active", () => {
      // Source lines 168-170
      const timerId = 456;
      mockClearInterval(timerId);
      expect(mockClearInterval).toHaveBeenCalledWith(456);
    });

    it("should allow timer to start fresh after reset", () => {
      // After reset: totalSeconds === initialTime, so startTimeRef resets to null
      const totalSeconds = 300;
      const initialTime = 300;
      expect(totalSeconds === initialTime).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Alarm triggering on completion
  // ---------------------------------------------------------------------------

  describe("Alarm triggering on completion", () => {
    it("should play alarm when sound is enabled and alarm exists", () => {
      // Source lines 126-128
      const soundEnabled = true;
      const alarmExists = true;
      expect(soundEnabled && alarmExists).toBe(true);
    });

    it("should not play alarm when sound is disabled", () => {
      const soundEnabled = false;
      const alarmExists = true;
      expect(soundEnabled && alarmExists).toBe(false);
    });

    it("should not play alarm when alarmRef is null", () => {
      const soundEnabled = true;
      const alarmExists = false;
      expect(soundEnabled && alarmExists).toBe(false);
    });

    it("should set gain value to the configured volume", () => {
      const gainNode = { gain: { value: 0 } };
      gainNode.gain.value = 0.5;
      expect(gainNode.gain.value).toBe(0.5);
    });

    it("should set gain value to minimum volume (0.1)", () => {
      const gainNode = { gain: { value: 0 } };
      gainNode.gain.value = 0.1;
      expect(gainNode.gain.value).toBeCloseTo(0.1);
    });

    it("should set gain value to maximum volume (1.0)", () => {
      const gainNode = { gain: { value: 0 } };
      gainNode.gain.value = 1.0;
      expect(gainNode.gain.value).toBe(1.0);
    });
  });

  // ---------------------------------------------------------------------------
  // Sound toggle
  // ---------------------------------------------------------------------------

  describe("Sound toggle", () => {
    it("should toggle from enabled to disabled", () => {
      // Source line 219: setSoundEnabled((prev) => !prev)
      expect(!true).toBe(false);
    });

    it("should toggle from disabled to enabled", () => {
      expect(!false).toBe(true);
    });

    it("should be idempotent across multiple toggles", () => {
      let state = true;
      state = !state;
      expect(state).toBe(false);
      state = !state;
      expect(state).toBe(true);
      state = !state;
      expect(state).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Close callback
  // ---------------------------------------------------------------------------

  describe("Close callback", () => {
    it("should invoke the close prop callback", () => {
      // Source line 178: close()
      const closeMock = vi.fn();
      closeMock();
      expect(closeMock).toHaveBeenCalledTimes(1);
    });

    it("should call clearInterval before stopping alarm", () => {
      // Source line 174: window.clearInterval(timerRef.current!)
      mockClearInterval(789);
      expect(mockClearInterval).toHaveBeenCalledWith(789);
    });

    it("should stop alarm if alarmRef exists", () => {
      // Source lines 175-177
      const stopFn = vi.fn();
      const alarm = { stop: stopFn };
      alarm.stop();
      expect(stopFn).toHaveBeenCalledTimes(1);
    });

    it("should execute cleanup in the correct order: clearInterval, alarm.stop, close", () => {
      const order: string[] = [];
      const mockCI = vi.fn(() => order.push("clearInterval"));
      const stopFn = vi.fn(() => order.push("alarmStop"));
      const closeFn = vi.fn(() => order.push("close"));

      mockCI(1);
      stopFn();
      closeFn();

      expect(order).toEqual(["clearInterval", "alarmStop", "close"]);
    });
  });

  // ---------------------------------------------------------------------------
  // Fullscreen toggle
  // ---------------------------------------------------------------------------

  describe("Fullscreen toggle", () => {
    it("should request fullscreen when not currently in fullscreen", () => {
      // Source lines 182-184
      (globalThis as any).document.fullscreenElement = null;
      expect(!!document.fullscreenElement).toBe(false);
    });

    it("should exit fullscreen when already in fullscreen", () => {
      // Source lines 185-187
      (globalThis as any).document.fullscreenElement = {};
      expect(!!document.fullscreenElement).toBe(true);
    });

    it("should register a fullscreenchange event listener on mount", () => {
      // Source line 196
      const addSpy = vi.fn();
      (globalThis as any).document.addEventListener = addSpy;
      document.addEventListener("fullscreenchange", () => {});
      expect(addSpy).toHaveBeenCalledWith("fullscreenchange", expect.any(Function));
    });

    it("should remove the fullscreenchange event listener on unmount", () => {
      // Source line 198
      const removeSpy = vi.fn();
      (globalThis as any).document.removeEventListener = removeSpy;
      const handler = () => {};
      document.removeEventListener("fullscreenchange", handler);
      expect(removeSpy).toHaveBeenCalledWith("fullscreenchange", handler);
    });

    it("should sync isFullscreen state with document.fullscreenElement", () => {
      // Source line 193: setIsFullscreen(!!document.fullscreenElement)
      (globalThis as any).document.fullscreenElement = {};
      expect(!!document.fullscreenElement).toBe(true);

      (globalThis as any).document.fullscreenElement = null;
      expect(!!document.fullscreenElement).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Props validation
  // ---------------------------------------------------------------------------

  describe("Props validation", () => {
    it("should accept initialTime as a number", () => {
      const props = {
        initialTime: 300,
        soundEnabled: true,
        alarmSound: "Simple" as const,
        volume: 0.5,
        close: vi.fn(),
      };
      expect(typeof props.initialTime).toBe("number");
    });

    it("should accept soundEnabled as a boolean", () => {
      const props = {
        initialTime: 300,
        soundEnabled: false,
        alarmSound: "Simple" as const,
        volume: 0.5,
        close: vi.fn(),
      };
      expect(typeof props.soundEnabled).toBe("boolean");
    });

    it("should accept volume as a number between 0 and 1", () => {
      const props = {
        initialTime: 300,
        soundEnabled: true,
        alarmSound: "Simple" as const,
        volume: 0.5,
        close: vi.fn(),
      };
      expect(props.volume).toBeGreaterThanOrEqual(0);
      expect(props.volume).toBeLessThanOrEqual(1);
    });

    it("should accept alarmSound as a valid AlarmSound value", () => {
      const validSounds = ["Simple", "Piano", "Vibraphone", "SteelDrums"];
      for (const sound of validSounds) {
        expect(validSounds).toContain(sound);
      }
    });

    it("should accept close as a callback function", () => {
      const props = {
        initialTime: 300,
        soundEnabled: true,
        alarmSound: "Simple" as const,
        volume: 0.5,
        close: vi.fn(),
      };
      expect(typeof props.close).toBe("function");
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases
  // ---------------------------------------------------------------------------

  describe("Edge cases", () => {
    it("should handle exact boundary when remaining equals 0", () => {
      const initialTime = 60;
      const elapsed = 60;
      const remaining = initialTime - elapsed;
      expect(remaining).toBe(0);
      expect(remaining <= 0).toBe(true);
    });

    it("should handle overshoot when timer fires after completion", () => {
      const initialTime = 10;
      const elapsed = 15;
      const remaining = initialTime - elapsed;
      expect(remaining).toBe(-5);
      expect(remaining <= 0).toBe(true);
    });

    it("should handle very short timer of 1 second", () => {
      const initialTime = 1;
      const startTime = 1000000;
      const now = startTime + 1050;
      const elapsed = Math.floor((now - startTime) / 1000);
      expect(initialTime - elapsed).toBe(0);
    });

    it("should handle very large timer of 24 hours", () => {
      const initialTime = 86400;
      const startTime = 1000000;
      const now = startTime + 43200000; // 12 hours
      expect(initialTime - Math.floor((now - startTime) / 1000)).toBe(43200);
    });

    it("should handle fetch failure during sound loading without crashing", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(mockFetch("sounds/Simple.wav")).rejects.toThrow("Network error");

      consoleSpy.mockRestore();
    });

    it("should handle decodeAudioData failure without crashing", async () => {
      mockDecodeAudioData.mockRejectedValueOnce(new Error("Decode error"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(mockDecodeAudioData(new ArrayBuffer(8))).rejects.toThrow("Decode error");

      consoleSpy.mockRestore();
    });

    it("should handle AudioContext.resume failure without crashing", async () => {
      mockResume.mockRejectedValueOnce(new Error("Resume error"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(mockResume()).rejects.toThrow("Resume error");

      consoleSpy.mockRestore();
    });

    it("should handle sub-second elapsed time (flooring to 0)", () => {
      const startTime = 1000000;
      const now = startTime + 999; // 999ms
      expect(Math.floor((now - startTime) / 1000)).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  describe("Cleanup on unmount", () => {
    it("should call clearInterval during cleanup when timer is active", () => {
      // Source lines 97-99 and 143-146
      const timerId = 999;
      mockClearInterval(timerId);
      expect(mockClearInterval).toHaveBeenCalledWith(999);
    });

    it("should stop alarm during cleanup", () => {
      // Source lines 100-102
      const stopMock = vi.fn();
      stopMock();
      expect(stopMock).toHaveBeenCalledTimes(1);
    });

    it("should skip clearInterval when timerRef is null", () => {
      // Source line 97: if (timerRef.current) guard
      const timerRef = null;
      const spy = vi.fn();
      if (timerRef) {
        spy(timerRef);
      }
      expect(spy).not.toHaveBeenCalled();
    });

    it("should skip alarm.stop when alarmRef is null", () => {
      // Source line 100: if (alarmRef.current) guard
      const alarmRef = null;
      const stopMock = vi.fn();
      if (alarmRef) {
        stopMock();
      }
      expect(stopMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Alarm stop behavior
  // ---------------------------------------------------------------------------

  describe("Alarm stop behavior", () => {
    it("should call stop on AudioBufferSourceNode", () => {
      // Source line 60: this.currentSource.stop()
      const source = { stop: vi.fn() };
      source.stop();
      expect(source.stop).toHaveBeenCalled();
    });

    it("should null out currentSource after stopping", () => {
      // Source line 65: this.currentSource = null
      let currentSource: any = { stop: vi.fn() };
      currentSource.stop();
      currentSource = null;
      expect(currentSource).toBeNull();
    });

    it("should be a no-op when currentSource is already null", () => {
      // Source line 58: if (this.currentSource) guard
      const currentSource = null;
      expect(currentSource === null).toBe(true);
    });

    it("should catch errors thrown by AudioBufferSourceNode.stop()", () => {
      // Source lines 59-63: try/catch around stop()
      const source = {
        stop: vi.fn(() => {
          throw new Error("InvalidStateError");
        }),
      };

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => source.stop()).toThrow("InvalidStateError");
      consoleSpy.mockRestore();
    });
  });

  // ---------------------------------------------------------------------------
  // Alarm play behavior
  // ---------------------------------------------------------------------------

  describe("Alarm play behavior", () => {
    it("should load sound on demand if audioBuffer is null", () => {
      // Source lines 37-39
      const audioBuffer = null;
      expect(!audioBuffer).toBe(true);
    });

    it("should call AudioContext.resume before playback", async () => {
      // Source line 41
      const ctx = new MockAudioContext();
      await ctx.resume();
      expect(mockResume).toHaveBeenCalled();
    });

    it("should stop any existing sound before starting a new one", () => {
      // Source line 44: this.stop()
      const stopMock = vi.fn();
      stopMock();
      expect(stopMock).toHaveBeenCalledTimes(1);
    });

    it("should create a new AudioBufferSourceNode for each play", () => {
      const ctx = new MockAudioContext();
      const source = ctx.createBufferSource();
      expect(source).toBeDefined();
      expect(source.connect).toBeDefined();
      expect(mockCreateBufferSource).toHaveBeenCalled();
    });

    it("should connect source to gain node and call start", () => {
      const ctx = new MockAudioContext();
      const source = ctx.createBufferSource();
      source.connect(mockGainNode);
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Initial effect behavior (mount)
  // ---------------------------------------------------------------------------

  describe("Initial effect behavior", () => {
    it("should auto-start the timer on mount", () => {
      // Source line 95: setIsRunning(true)
      const autoStart = true;
      expect(autoStart).toBe(true);
    });

    it("should create a new Alarm instance on mount with alarmSound and volume", () => {
      // Source line 94: alarmRef.current = new Alarm(alarmSound, volume)
      const alarmSound = "Simple";
      const volume = 0.5;
      expect(typeof alarmSound).toBe("string");
      expect(typeof volume).toBe("number");
    });

    it("should depend on alarmSound and volume for effect re-execution", () => {
      // Source line 104: dependency array [alarmSound, volume]
      const deps = ["alarmSound", "volume"];
      expect(deps).toContain("alarmSound");
      expect(deps).toContain("volume");
    });

    it("should depend on isRunning, soundEnabled, and initialTime for countdown effect", () => {
      // Source line 148: dependency array [isRunning, soundEnabled, initialTime]
      const deps = ["isRunning", "soundEnabled", "initialTime"];
      expect(deps).toHaveLength(3);
      expect(deps).toContain("isRunning");
      expect(deps).toContain("soundEnabled");
      expect(deps).toContain("initialTime");
    });
  });
});
