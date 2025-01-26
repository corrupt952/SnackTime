import { describe, expect, it, vi, beforeEach } from "vitest";
import { History } from "./history";
import { Duration } from "@/domain/timer/value/duration";

describe("History", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  describe("all", () => {
    it("should return empty array when storage is empty", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() => Promise.resolve({ history: null }));
      const histories = await History.all();
      expect(histories).toEqual([]);
    });

    it("should parse and return stored histories", async () => {
      const now = new Date("2024-01-01T00:00:00.000Z");
      const storedData = [
        { duration: { value: 300 }, createdAt: now.toISOString() },
        { duration: { value: 600 }, createdAt: now.toISOString() },
      ];

      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          history: JSON.stringify(storedData),
        }),
      );

      const histories = await History.all();
      expect(histories).toHaveLength(2);
      expect(histories[0].duration.toSeconds()).toBe(300);
      expect(histories[1].duration.toSeconds()).toBe(600);
    });

    it("should handle storage error and return empty array", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockRejectedValue(new Error("Storage error"));
      const histories = await History.all();
      expect(histories).toEqual([]);
    });

    it("should handle invalid JSON and return empty array", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          history: "invalid json",
        }),
      );
      const histories = await History.all();
      expect(histories).toEqual([]);
    });

    it("should filter out invalid history data", async () => {
      const now = new Date("2024-01-01T00:00:00.000Z");
      const storedData = [
        { duration: { value: 300 }, createdAt: now.toISOString() },
        { duration: { value: -1 }, createdAt: now.toISOString() }, // invalid duration
        { duration: { value: 600 }, createdAt: "invalid date" }, // invalid date
      ];

      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          history: JSON.stringify(storedData),
        }),
      );

      const histories = await History.all();
      expect(histories).toHaveLength(1);
      expect(histories[0].duration.toSeconds()).toBe(300);
    });
  });

  describe("add", () => {
    it("should add new history to empty list", async () => {
      const getAllSpy = vi
        .spyOn(chrome.storage.sync, "get")
        .mockImplementation(() => Promise.resolve({ history: null }));
      const setStorage = vi.spyOn(chrome.storage.sync, "set");
      const now = new Date("2024-01-01T00:00:00.000Z");
      vi.setSystemTime(now);

      await History.add(new Duration(300));

      expect(getAllSpy).toHaveBeenCalled();
      expect(setStorage).toHaveBeenCalledWith({
        history: JSON.stringify([
          {
            duration: { value: 300 },
            createdAt: now.toISOString(),
          },
        ]),
      });
    });

    it("should remove duplicate duration and add to top", async () => {
      const now = new Date("2024-01-01T00:00:00.000Z");
      // Order by newest first (most recent at the beginning)
      const existingData = [
        { duration: { value: 1500 }, createdAt: now.toISOString() },
        { duration: { value: 1200 }, createdAt: now.toISOString() },
        { duration: { value: 900 }, createdAt: now.toISOString() },
        { duration: { value: 600 }, createdAt: now.toISOString() },
        { duration: { value: 300 }, createdAt: now.toISOString() },
      ];

      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          history: JSON.stringify(existingData),
        }),
      );
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      const newNow = new Date("2024-01-02T00:00:00.000Z");
      vi.setSystemTime(newNow);
      await History.add(new Duration(300)); // Same duration as last item

      expect(setStorage).toHaveBeenCalledWith({
        history: JSON.stringify([
          {
            duration: { value: 300 },
            createdAt: newNow.toISOString(),
          },
          {
            duration: { value: 1500 },
            createdAt: now.toISOString(),
          },
          {
            duration: { value: 1200 },
            createdAt: now.toISOString(),
          },
          {
            duration: { value: 900 },
            createdAt: now.toISOString(),
          },
          {
            duration: { value: 600 },
            createdAt: now.toISOString(),
          },
        ]),
      });
    });

    it("should limit history size to maximum items", async () => {
      const now = new Date("2024-01-01T00:00:00.000Z");
      // Order by newest first (most recent at the beginning)
      const existingData = [
        { duration: { value: 1500 }, createdAt: now.toISOString() },
        { duration: { value: 1200 }, createdAt: now.toISOString() },
        { duration: { value: 900 }, createdAt: now.toISOString() },
        { duration: { value: 600 }, createdAt: now.toISOString() },
        { duration: { value: 300 }, createdAt: now.toISOString() },
      ];

      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          history: JSON.stringify(existingData),
        }),
      );
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      const newNow = new Date("2024-01-02T00:00:00.000Z");
      vi.setSystemTime(newNow);
      await History.add(new Duration(1800));

      const savedHistories = JSON.parse((setStorage.mock.calls[0][0] as { history: string }).history);
      expect(savedHistories).toHaveLength(5);
      expect(savedHistories[0].duration.value).toBe(1800); // New value added
      expect(savedHistories[4].duration.value).toBe(600); // Oldest value is removed
    });

    it("should handle storage error silently", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() => Promise.resolve({ history: null }));
      vi.spyOn(chrome.storage.sync, "set").mockRejectedValue(new Error("Storage error"));

      await expect(History.add(new Duration(300))).resolves.not.toThrow();
    });
  });
});
