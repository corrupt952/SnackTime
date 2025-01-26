import { vi } from "vitest";

type StorageValue = Record<string, any>;

// Chrome APIのモック
global.chrome = {
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
  storage: {
    sync: {
      get: vi.fn().mockImplementation(() => Promise.resolve({} as StorageValue)),
      set: vi.fn().mockImplementation((value: StorageValue) => Promise.resolve()),
    },
  },
} as any;

// windowのモック
global.window = { close: vi.fn() } as any;
