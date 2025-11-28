import { vi, Mock } from "vitest";

type StorageValue = Record<string, unknown>;

// Mock function types
type TabsQueryMock = Mock<(queryInfo: chrome.tabs.QueryInfo) => Promise<chrome.tabs.Tab[]>>;
type TabsSendMessageMock = Mock<<M = unknown, R = unknown>(tabId: number, message: M) => Promise<R>>;
type StorageGetMock = Mock<(keys?: string | string[] | Record<string, unknown> | null) => Promise<StorageValue>>;
type StorageSetMock = Mock<(items: StorageValue) => Promise<void>>;

// Chrome APIのモック
const chromeMock = {
  tabs: {
    query: vi.fn() as TabsQueryMock,
    sendMessage: vi.fn() as TabsSendMessageMock,
  },
  storage: {
    sync: {
      get: vi.fn().mockImplementation(() => Promise.resolve({})) as StorageGetMock,
      set: vi.fn().mockImplementation(() => Promise.resolve()) as StorageSetMock,
    },
  },
};

global.chrome = chromeMock as unknown as typeof chrome;

// Export typed mocks for use in tests
export const mockedChrome = chromeMock;

// windowのモック
global.window = { close: vi.fn() } as unknown as Window & typeof globalThis;
