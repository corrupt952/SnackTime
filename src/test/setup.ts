import { vi } from "vitest";

// Chrome APIのモック
global.chrome = {
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
} as any;

// windowのモック
global.window = { close: vi.fn() } as any;
