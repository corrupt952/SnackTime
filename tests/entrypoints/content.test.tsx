import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from "vitest";
import { NotificationType } from "@/types/enums/NotificationType";
import { ColorScheme } from "@/lib/color-scheme";
import type { ExtensionSettings } from "@/domain/settings/models/settings";

// vi.hoisted runs before all vi.mock calls and imports
const { capturedMainRef, mockShadowRoot, mockShadowContainer, mockContentRoot } = vi.hoisted(() => {
  const capturedMainRef = { current: null as (() => void) | null };
  (globalThis as any).defineContentScript = (config: { main: () => void }) => {
    capturedMainRef.current = config.main;
    return config;
  };

  // Create mock shadow container
  const mockShadowContainer = {
    id: "",
    style: {} as Record<string, string>,
    classList: {
      _classes: new Set<string>(),
      add(cls: string) {
        this._classes.add(cls);
      },
      contains(cls: string) {
        return this._classes.has(cls);
      },
    },
    getElementById(id: string) {
      if (id === "snack-time-container" && this.id === "snack-time-container") return this;
      return null;
    },
  };

  // Create mock shadow root
  const mockShadowRoot = {
    appendChild: vi.fn(),
    getElementById(id: string) {
      return mockShadowContainer.getElementById(id);
    },
  };

  // Create mock content root element
  const mockContentRoot = {
    id: "",
    tagName: "DIV",
    style: {} as Record<string, string>,
    _listeners: {} as Record<string, Function[]>,
    _children: [] as any[],
    _parent: null as any,
    addEventListener(event: string, handler: Function) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(handler);
    },
    dispatchEvent(event: { type: string }) {
      const handlers = this._listeners[event.type] || [];
      for (const handler of handlers) handler(event);
    },
    appendChild(child: any) {
      this._children.push(child);
    },
    attachShadow: vi.fn().mockReturnValue(mockShadowRoot),
    remove: vi.fn(),
  };

  // Mock document
  const mockDocument = {
    createElement: vi.fn().mockImplementation((tag: string) => {
      if (tag === "div") {
        return mockContentRoot;
      }
      return { style: {} };
    }),
    body: {
      append: vi.fn(),
      contains: vi.fn().mockReturnValue(true),
      innerHTML: "",
    },
    _listeners: {} as Record<string, Function[]>,
    addEventListener(event: string, handler: Function) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(handler);
    },
    dispatchEvent(event: { type: string }) {
      const handlers = this._listeners[event.type] || [];
      for (const handler of handlers) handler(event);
    },
    getElementById(id: string) {
      if (id === "snack-time-root" && mockContentRoot.id === "snack-time-root") return mockContentRoot;
      return null;
    },
  };
  (globalThis as any).document = mockDocument;

  return { capturedMainRef, mockShadowRoot, mockShadowContainer, mockContentRoot };
});

vi.mock("@/domain/settings/models/settings", () => ({
  Settings: {
    get: vi.fn(),
  },
}));

vi.mock("@/lib/color-scheme", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/color-scheme")>();
  return {
    ...actual,
    getEffectiveColorScheme: vi.fn().mockReturnValue("dark"),
  };
});

vi.mock("@/i18n/config", () => ({
  changeLanguage: vi.fn(),
}));

vi.mock("@/i18n", () => ({}));

vi.mock("@/styles/globals.css?inline", () => ({
  default: ".mock-styles { color: red; }",
}));

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn().mockReturnValue({
    render: vi.fn(),
  }),
}));

vi.mock("./content/Timer", () => ({
  default: () => null,
}));

import { Settings } from "@/domain/settings/models/settings";
import { changeLanguage } from "@/i18n/config";
import { getEffectiveColorScheme } from "@/lib/color-scheme";
import { createRoot } from "react-dom/client";

// Import triggers defineContentScript and captures main
import "../../entrypoints/content";

const defaultSettings: ExtensionSettings = {
  language: "system",
  notificationType: NotificationType.Alarm,
  colorScheme: ColorScheme.Dark,
  alarmSound: "Simple",
  volume: 0.1,
  applyThemeToSettings: false,
  timerPosition: "top-right",
  presetTimers: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
};

describe("content script", () => {
  let messageListener: (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => void;
  let mockSendResponse: Mock;
  let addListenerMock: Mock;
  let createElementCalls: any[];

  beforeEach(() => {
    vi.resetAllMocks();

    // Set up chrome.runtime.onMessage.addListener to capture the listener
    addListenerMock = vi.fn();
    (globalThis as any).chrome = {
      ...(globalThis as any).chrome,
      runtime: {
        onMessage: {
          addListener: addListenerMock,
        },
      },
    };

    // Reset mock states
    mockContentRoot.id = "";
    mockContentRoot.style = {} as Record<string, string>;
    mockContentRoot._children = [];
    mockContentRoot._parent = null;
    mockContentRoot._listeners = {};
    mockContentRoot.remove.mockClear();
    mockContentRoot.attachShadow.mockClear().mockReturnValue(mockShadowRoot);

    mockShadowContainer.id = "";
    mockShadowContainer.style = {} as Record<string, string>;
    mockShadowContainer.classList._classes = new Set<string>();

    mockShadowRoot.appendChild.mockClear();

    (document.body as any).append = vi.fn();
    (document.body as any).contains = vi.fn().mockReturnValue(true);

    // Track createElement calls: first returns contentRoot, second returns shadowContainer
    createElementCalls = [];
    (document.createElement as Mock).mockImplementation((tag: string) => {
      createElementCalls.push(tag);
      if (createElementCalls.length === 1) {
        return mockContentRoot;
      }
      return mockShadowContainer;
    });

    // Clear document listeners
    (document as any)._listeners = {};

    // Default mock return values
    (Settings.get as Mock).mockResolvedValue({ ...defaultSettings });
    (getEffectiveColorScheme as Mock).mockReturnValue("dark");
    (createRoot as Mock).mockReturnValue({ render: vi.fn() });

    mockSendResponse = vi.fn();

    // Execute main to register the listener
    capturedMainRef.current!();
    messageListener = addListenerMock.mock.calls[0][0];
  });

  describe("message listener registration", () => {
    it("should register a message listener via chrome.runtime.onMessage.addListener", () => {
      expect(addListenerMock).toHaveBeenCalledTimes(1);
      expect(typeof messageListener).toBe("function");
    });
  });

  describe("settings loading", () => {
    it("should call Settings.get when a message is received", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(Settings.get).toHaveBeenCalledTimes(1);
    });

    it("should call sendResponse with 'Received'", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith("Received");
    });
  });

  describe("language change", () => {
    it("should call changeLanguage with the language from settings", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, language: "ja" });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(changeLanguage).toHaveBeenCalledWith("ja");
    });

    it("should call changeLanguage with 'system' when using default settings", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(changeLanguage).toHaveBeenCalledWith("system");
    });
  });

  describe("DOM element creation", () => {
    it("should create a div with id 'snack-time-root' and append it to body", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(document.createElement).toHaveBeenCalledWith("div");
      expect(mockContentRoot.id).toBe("snack-time-root");
      expect((document.body as any).append).toHaveBeenCalledWith(mockContentRoot);
    });
  });

  describe("position application", () => {
    it("should apply top-left position styles", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition: "top-left" });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.top).toBe("10px");
      expect(mockContentRoot.style.left).toBe("10px");
    });

    it("should apply top-right position styles", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition: "top-right" });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.top).toBe("10px");
      expect(mockContentRoot.style.right).toBe("10px");
    });

    it("should apply bottom-left position styles", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition: "bottom-left" });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.bottom).toBe("10px");
      expect(mockContentRoot.style.left).toBe("10px");
    });

    it("should apply bottom-right position styles", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition: "bottom-right" });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.bottom).toBe("10px");
      expect(mockContentRoot.style.right).toBe("10px");
    });

    it("should apply center position styles with transform", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition: "center" });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.top).toBe("50%");
      expect(mockContentRoot.style.left).toBe("50%");
      expect(mockContentRoot.style.transform).toBe("translate(-50%, -50%)");
    });

    it("should fall back to top-right for unknown position values", async () => {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition: "unknown" as any });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.top).toBe("10px");
      expect(mockContentRoot.style.right).toBe("10px");
    });
  });

  describe("root element styles", () => {
    it("should set zIndex to calc(infinity)", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.zIndex).toBe("calc(infinity)");
    });

    it("should set fontSize to 16px", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.fontSize).toBe("16px");
    });

    it("should set fontFamily to Arial, sans-serif", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.fontFamily).toBe("Arial, sans-serif");
    });

    it("should set grid display and gridTemplateRows", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.display).toBe("grid");
      expect(mockContentRoot.style.gridTemplateRows).toBe("1fr auto");
    });

    it("should set position to fixed and pointerEvents to auto", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.style.position).toBe("fixed");
      expect(mockContentRoot.style.pointerEvents).toBe("auto");
    });
  });

  describe("shadow DOM creation", () => {
    it("should attach a closed shadow root to contentRoot", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockContentRoot.attachShadow).toHaveBeenCalledWith({ mode: "closed" });
    });
  });

  describe("shadow container setup", () => {
    it("should create a shadow container with id 'snack-time-container' and display contents", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockShadowContainer.id).toBe("snack-time-container");
      expect(mockShadowContainer.style.display).toBe("contents");
      expect(mockShadowRoot.appendChild).toHaveBeenCalledWith(mockShadowContainer);
    });
  });

  describe("color scheme class application", () => {
    it("should apply the effective color scheme class to the shadow container", async () => {
      (getEffectiveColorScheme as Mock).mockReturnValue("light");

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(mockShadowContainer.classList.contains("light")).toBe(true);
      expect(getEffectiveColorScheme).toHaveBeenCalledWith(ColorScheme.Dark);
    });
  });

  describe("CSS variable overrides", () => {
    it("should inject inline CSS with --spacing, --text-sm, and --text-6xl overrides", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(createRoot).toHaveBeenCalled();
      const renderMock = (createRoot as Mock).mock.results[0].value.render;
      expect(renderMock).toHaveBeenCalledTimes(1);

      const renderedJsx = renderMock.mock.calls[0][0];
      const jsxString = JSON.stringify(renderedJsx);
      expect(jsxString).toContain("--spacing: 4px");
      expect(jsxString).toContain("--text-sm: 14px");
      expect(jsxString).toContain("--text-6xl: 60px");
    });
  });

  describe("inline CSS injection", () => {
    it("should inject the global styles into the rendered output", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      const renderMock = (createRoot as Mock).mock.results[0].value.render;
      const renderedJsx = renderMock.mock.calls[0][0];
      const jsxString = JSON.stringify(renderedJsx);
      expect(jsxString).toContain(".mock-styles { color: red; }");
    });
  });

  describe("drag functionality", () => {
    async function setupDragTest(timerPosition: string = "top-right") {
      (Settings.get as Mock).mockResolvedValue({ ...defaultSettings, timerPosition });
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      // The mousedown listener is registered on contentRoot via addEventListener
      const mousedownHandler = mockContentRoot._listeners.mousedown?.[0];
      // mousemove and mouseup are registered on document via addEventListener
      const mousemoveHandler = (document as any)._listeners.mousemove?.[0];
      const mouseupHandler = (document as any)._listeners.mouseup?.[0];

      return { mousedownHandler, mousemoveHandler, mouseupHandler };
    }

    it("should start dragging on mousedown on contentRoot", async () => {
      const { mousedownHandler, mousemoveHandler } = await setupDragTest();

      mousedownHandler({
        target: mockContentRoot,
        offsetX: 10,
        offsetY: 10,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      mousemoveHandler({
        clientX: 200,
        clientY: 200,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      expect(mockContentRoot.style.left).toBe("190px");
      expect(mockContentRoot.style.top).toBe("190px");
    });

    it("should start dragging on mousedown on shadowContainer", async () => {
      const { mousedownHandler, mousemoveHandler } = await setupDragTest();

      mousedownHandler({
        target: mockShadowContainer,
        offsetX: 5,
        offsetY: 5,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      mousemoveHandler({
        clientX: 150,
        clientY: 150,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      expect(mockContentRoot.style.left).toBe("145px");
      expect(mockContentRoot.style.top).toBe("145px");
    });

    it("should update position during mousemove while dragging", async () => {
      const { mousedownHandler, mousemoveHandler } = await setupDragTest();

      mousedownHandler({
        target: mockContentRoot,
        offsetX: 5,
        offsetY: 5,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      // First move
      mousemoveHandler({
        clientX: 100,
        clientY: 100,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });
      expect(mockContentRoot.style.left).toBe("95px");
      expect(mockContentRoot.style.top).toBe("95px");

      // Second move
      mousemoveHandler({
        clientX: 300,
        clientY: 250,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });
      expect(mockContentRoot.style.left).toBe("295px");
      expect(mockContentRoot.style.top).toBe("245px");
    });

    it("should stop dragging on mouseup", async () => {
      const { mousedownHandler, mousemoveHandler, mouseupHandler } = await setupDragTest();

      mousedownHandler({
        target: mockContentRoot,
        offsetX: 5,
        offsetY: 5,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      mousemoveHandler({
        clientX: 100,
        clientY: 100,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });
      expect(mockContentRoot.style.left).toBe("95px");

      mouseupHandler({
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      // Move after release should not change position
      mousemoveHandler({
        clientX: 500,
        clientY: 500,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });
      expect(mockContentRoot.style.left).toBe("95px");
    });

    it("should reset position styles (top, bottom, left, right, transform) during drag", async () => {
      const { mousedownHandler, mousemoveHandler } = await setupDragTest("center");

      expect(mockContentRoot.style.transform).toBe("translate(-50%, -50%)");

      mousedownHandler({
        target: mockContentRoot,
        offsetX: 5,
        offsetY: 5,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      mousemoveHandler({
        clientX: 200,
        clientY: 200,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      expect(mockContentRoot.style.transform).toBe("");
      expect(mockContentRoot.style.bottom).toBe("");
      expect(mockContentRoot.style.right).toBe("");
    });

    it("should not start dragging when clicking on other elements inside the root", async () => {
      const { mousedownHandler, mousemoveHandler } = await setupDragTest();

      const otherElement = { tagName: "BUTTON" };

      mousedownHandler({
        target: otherElement,
        offsetX: 10,
        offsetY: 10,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      mousemoveHandler({
        clientX: 500,
        clientY: 500,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      });

      // Position should remain at the initial top-right setting
      expect(mockContentRoot.style.top).toBe("10px");
      expect(mockContentRoot.style.right).toBe("10px");
    });
  });

  describe("React render", () => {
    it("should call createRoot with the shadow container", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      expect(createRoot).toHaveBeenCalledWith(mockShadowContainer);
    });

    it("should pass correct Timer props including duration from message", async () => {
      await messageListener({ duration: 600 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      const renderMock = (createRoot as Mock).mock.results[0].value.render;
      const renderedJsx = renderMock.mock.calls[0][0];

      // Navigate JSX tree: StrictMode > [style, style, Timer]
      const strictModeChildren = renderedJsx.props.children;
      const timerElement = strictModeChildren[2];

      expect(timerElement.props.initialTime).toBe(600);
      expect(typeof timerElement.props.close).toBe("function");
      expect(timerElement.props.soundEnabled).toBe(true);
      expect(timerElement.props.alarmSound).toBe("Simple");
      expect(timerElement.props.volume).toBe(0.1);
    });

    it("should set soundEnabled to false when notificationType is not Alarm", async () => {
      (Settings.get as Mock).mockResolvedValue({
        ...defaultSettings,
        notificationType: NotificationType.None,
      });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      const renderMock = (createRoot as Mock).mock.results[0].value.render;
      const renderedJsx = renderMock.mock.calls[0][0];
      const strictModeChildren = renderedJsx.props.children;
      const timerElement = strictModeChildren[2];

      expect(timerElement.props.soundEnabled).toBe(false);
    });

    it("should pass custom alarmSound and volume from settings", async () => {
      (Settings.get as Mock).mockResolvedValue({
        ...defaultSettings,
        alarmSound: "Piano",
        volume: 0.8,
      });

      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      const renderMock = (createRoot as Mock).mock.results[0].value.render;
      const renderedJsx = renderMock.mock.calls[0][0];
      const strictModeChildren = renderedJsx.props.children;
      const timerElement = strictModeChildren[2];

      expect(timerElement.props.alarmSound).toBe("Piano");
      expect(timerElement.props.volume).toBe(0.8);
    });

    it("should provide a close function that removes the contentRoot from the DOM", async () => {
      await messageListener({ duration: 300 }, {} as chrome.runtime.MessageSender, mockSendResponse);

      const renderMock = (createRoot as Mock).mock.results[0].value.render;
      const renderedJsx = renderMock.mock.calls[0][0];
      const strictModeChildren = renderedJsx.props.children;
      const timerElement = strictModeChildren[2];

      timerElement.props.close();

      expect(mockContentRoot.remove).toHaveBeenCalledTimes(1);
    });
  });
});
