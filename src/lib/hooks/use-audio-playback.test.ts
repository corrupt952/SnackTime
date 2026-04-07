import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// --- Mock state tracking ---

const mockStart = vi.fn();
const mockSourceConnect = vi.fn();
const mockGainConnect = vi.fn();
const mockClose = vi.fn().mockResolvedValue(undefined);
const mockResume = vi.fn().mockResolvedValue(undefined);
const mockDecodeAudioData = vi.fn();
const mockCreateBufferSource = vi.fn();
const mockCreateGain = vi.fn();

let latestGainNode: { gain: { value: number }; connect: ReturnType<typeof vi.fn> };
let latestSourceNode: {
  buffer: AudioBuffer | null;
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
};
let audioContextState: string;

function resetAudioMocks() {
  latestGainNode = {
    gain: { value: 1 },
    connect: mockGainConnect,
  };
  latestSourceNode = {
    buffer: null,
    connect: mockSourceConnect,
    start: mockStart,
  };

  mockCreateGain.mockReturnValue(latestGainNode);
  mockCreateBufferSource.mockReturnValue(latestSourceNode);
  mockDecodeAudioData.mockResolvedValue({ duration: 1, length: 44100 } as AudioBuffer);
  mockResume.mockResolvedValue(undefined);
  mockClose.mockResolvedValue(undefined);
}

// --- Mock AudioContext as a class ---

class MockAudioContext {
  state = audioContextState;
  destination = {};
  resume = mockResume;
  close = mockClose;
  createBufferSource = mockCreateBufferSource;
  createGain = mockCreateGain;
  decodeAudioData = mockDecodeAudioData;
}

// --- Mock fetch and chrome.runtime.getURL ---

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockGetURL = vi.fn((path: string) => `chrome-extension://abc123/${path}`);
if (!global.chrome) {
  global.chrome = {} as typeof chrome;
}
(global.chrome as any).runtime = {
  ...((global.chrome as any).runtime || {}),
  getURL: mockGetURL,
};

// --- Mock React hooks ---

type CleanupFn = () => void;
type EffectFn = () => void | CleanupFn;

let refStore: Map<number, { current: unknown }>;
let effectCallbacks: EffectFn[];
let refIndex: number;
let effectIndex: number;
let callbackIndex: number;

vi.mock("react", () => ({
  useRef: (initialValue: unknown) => {
    if (!refStore.has(refIndex)) {
      refStore.set(refIndex, { current: initialValue });
    }
    const ref = refStore.get(refIndex)!;
    refIndex++;
    return ref;
  },
  useCallback: (fn: (...args: unknown[]) => unknown, _deps: unknown[]) => {
    callbackIndex++;
    return fn;
  },
  useEffect: (fn: EffectFn, _deps: unknown[]) => {
    effectCallbacks[effectIndex] = fn;
    effectIndex++;
  },
}));

// --- Import after mocks ---

import { useAudioPlayback } from "./use-audio-playback";

// --- Helper to invoke the hook and capture outputs ---

function renderHook(alarmSound: string, volume: number) {
  refIndex = 0;
  effectIndex = 0;
  callbackIndex = 0;
  effectCallbacks = [];

  const result = useAudioPlayback(alarmSound as any, volume);
  return result;
}

function getCleanupFn(): CleanupFn | undefined {
  // The cleanup effect is the second useEffect (index 1)
  const fn = effectCallbacks[1];
  if (fn) {
    return fn() as CleanupFn | undefined;
  }
  return undefined;
}

function triggerAlarmSoundEffect() {
  // The first useEffect (index 0) resets audioBufferRef when alarmSound changes
  const fn = effectCallbacks[0];
  if (fn) fn();
}

// --- Tests ---

describe("useAudioPlayback", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    refStore = new Map();
    effectCallbacks = [];
    refIndex = 0;
    effectIndex = 0;
    callbackIndex = 0;
    audioContextState = "running";

    resetAudioMocks();

    mockFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
    });
    mockGetURL.mockImplementation((path: string) => `chrome-extension://abc123/${path}`);

    (global as any).window = {
      ...(global as any).window,
      AudioContext: MockAudioContext,
    };
    (global as any).AudioContext = MockAudioContext;
  });

  afterEach(() => {
    delete (global as any).AudioContext;
  });

  it("should return a playSound function", () => {
    const { playSound } = renderHook("Simple", 0.5);
    expect(typeof playSound).toBe("function");
  });

  it("should not create AudioContext on initialization", () => {
    renderHook("Simple", 0.5);

    // audioContextRef should be null after initialization
    const audioContextRef = refStore.get(0);
    expect(audioContextRef?.current).toBeNull();
  });

  it("should create AudioContext when playSound is called", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    const audioContextRef = refStore.get(0);
    expect(audioContextRef?.current).toBeInstanceOf(MockAudioContext);
  });

  it("should reuse existing AudioContext on subsequent playSound calls", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    const audioContextRef = refStore.get(0);
    const firstContext = audioContextRef?.current;

    // Call playSound again (reuse same refs by not resetting refStore)
    await playSound();

    expect(audioContextRef?.current).toBe(firstContext);
  });

  it("should fetch the audio file using chrome.runtime.getURL", async () => {
    const { playSound } = renderHook("Piano", 0.5);
    await playSound();

    expect(mockGetURL).toHaveBeenCalledWith("sounds/Piano.wav");
    expect(mockFetch).toHaveBeenCalledWith("chrome-extension://abc123/sounds/Piano.wav");
  });

  it("should decode the fetched audio data", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    expect(mockDecodeAudioData).toHaveBeenCalledWith(expect.any(ArrayBuffer));
  });

  it("should resume AudioContext before playing", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    expect(mockResume).toHaveBeenCalled();
  });

  it("should apply volume to gain node", async () => {
    const { playSound } = renderHook("Simple", 0.7);
    await playSound();

    // The gain node created during this playSound call
    const gainNode = mockCreateGain.mock.results[0]?.value;
    expect(gainNode.gain.value).toBe(0.7);
  });

  it("should set gain value to 0 when volume is 0 (muted)", async () => {
    const { playSound } = renderHook("Simple", 0);
    await playSound();

    const gainNode = mockCreateGain.mock.results[0]?.value;
    expect(gainNode.gain.value).toBe(0);
  });

  it("should set gain value to 1 when volume is 1 (max)", async () => {
    const { playSound } = renderHook("Simple", 1);
    await playSound();

    const gainNode = mockCreateGain.mock.results[0]?.value;
    expect(gainNode.gain.value).toBe(1);
  });

  it("should call source.start() to play the sound", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    expect(mockStart).toHaveBeenCalled();
  });

  it("should connect source to gain node", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    expect(mockSourceConnect).toHaveBeenCalled();
  });

  it("should handle fetch failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { playSound } = renderHook("Simple", 0.5);
    await expect(playSound()).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith("Error playing sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should handle decodeAudioData failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockDecodeAudioData.mockRejectedValueOnce(new Error("Unable to decode audio data"));

    const { playSound } = renderHook("Simple", 0.5);
    await expect(playSound()).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith("Error playing sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should handle AudioContext creation failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (global as any).window.AudioContext = class {
      constructor() {
        throw new Error("AudioContext not supported");
      }
    };

    const { playSound } = renderHook("Simple", 0.5);
    await expect(playSound()).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith("Error playing sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should close AudioContext on cleanup when context is open", () => {
    renderHook("Simple", 0.5);

    // Simulate that playSound was called and AudioContext was created
    const mockCtx = new MockAudioContext();
    const audioContextRef = refStore.get(0);
    if (audioContextRef) {
      audioContextRef.current = mockCtx;
    }

    const cleanup = getCleanupFn();
    expect(cleanup).toBeDefined();
    if (cleanup) cleanup();

    expect(mockClose).toHaveBeenCalled();
  });

  it("should not close AudioContext on cleanup when context is already closed", () => {
    audioContextState = "closed";
    renderHook("Simple", 0.5);

    const mockCtx = new MockAudioContext();
    const audioContextRef = refStore.get(0);
    if (audioContextRef) {
      audioContextRef.current = mockCtx;
    }

    const cleanup = getCleanupFn();
    if (cleanup) cleanup();

    expect(mockClose).not.toHaveBeenCalled();
  });

  it("should not throw on cleanup when no AudioContext exists", () => {
    renderHook("Simple", 0.5);

    const cleanup = getCleanupFn();
    expect(() => {
      if (cleanup) cleanup();
    }).not.toThrow();
  });

  it("should reset audio buffer when alarm sound changes", () => {
    renderHook("Simple", 0.5);

    // Simulate that audioBufferRef was populated from a previous playSound call
    const audioBufferRef = refStore.get(1);
    if (audioBufferRef) {
      audioBufferRef.current = { duration: 1, length: 44100 } as AudioBuffer;
    }

    // Trigger the alarm sound change effect
    triggerAlarmSoundEffect();

    expect(audioBufferRef?.current).toBeNull();
  });

  it("should use different URL for different alarm sounds", async () => {
    const { playSound } = renderHook("Vibraphone", 0.5);
    await playSound();

    expect(mockGetURL).toHaveBeenCalledWith("sounds/Vibraphone.wav");
    expect(mockFetch).toHaveBeenCalledWith("chrome-extension://abc123/sounds/Vibraphone.wav");
  });

  it("should cache audio buffer and skip fetch on subsequent plays", async () => {
    const { playSound } = renderHook("Simple", 0.5);
    await playSound();

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Play again with same refs (buffer is cached)
    await playSound();

    // fetch should not be called again because audioBufferRef is already set
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
