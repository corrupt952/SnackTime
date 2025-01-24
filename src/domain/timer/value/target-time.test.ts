import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { TargetTime } from "./target-time";

describe("TargetTime", () => {
  describe("fromString", () => {
    it("should create instance from valid time string", () => {
      expect(() => TargetTime.fromString("13:30")).not.toThrow();
      expect(() => TargetTime.fromString("00:00")).not.toThrow();
      expect(() => TargetTime.fromString("23:59")).not.toThrow();
    });

    it("should throw error for invalid time format", () => {
      expect(() => TargetTime.fromString("24:00")).toThrow();
      expect(() => TargetTime.fromString("12:60")).toThrow();
      expect(() => TargetTime.fromString("1:30")).toThrow();
      expect(() => TargetTime.fromString("invalid")).toThrow();
    });
  });

  describe("toDuration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should calculate seconds from current time to target time", () => {
      // Set current time to 10:00
      vi.setSystemTime(new Date("2024-01-24T10:00:00"));

      const cases = [
        { time: "10:30", expected: 1800 }, // 30 minutes later
        { time: "11:00", expected: 3600 }, // 1 hour later
        { time: "10:05", expected: 300 }, // 5 minutes later
      ];

      cases.forEach(({ time, expected }) => {
        const target = TargetTime.fromString(time);
        expect(target.toDuration()).toBe(expected);
      });
    });

    it("should calculate as next day when target time is earlier than current time", () => {
      // Set current time to 15:00
      vi.setSystemTime(new Date("2024-01-24T15:00:00"));

      const cases = [
        { time: "14:00", expected: 82800 }, // 23 hours later
        { time: "00:00", expected: 32400 }, // 9 hours later
        { time: "14:59", expected: 86340 }, // 23 hours 59 minutes later
      ];

      cases.forEach(({ time, expected }) => {
        const target = TargetTime.fromString(time);
        expect(target.toDuration()).toBe(expected);
      });
    });
  });
});
