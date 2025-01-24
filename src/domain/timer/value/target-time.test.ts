import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { TargetTime } from "./target-time";

describe("TargetTime", () => {
  describe("fromString", () => {
    it("正しい形式の時刻文字列からインスタンスを作成できる", () => {
      expect(() => TargetTime.fromString("13:30")).not.toThrow();
      expect(() => TargetTime.fromString("00:00")).not.toThrow();
      expect(() => TargetTime.fromString("23:59")).not.toThrow();
    });

    it("不正な形式の時刻文字列でエラーを投げる", () => {
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

    it("現在時刻から目標時刻までの秒数を計算できる", () => {
      // 10:00に設定
      vi.setSystemTime(new Date("2024-01-24T10:00:00"));

      const cases = [
        { time: "10:30", expected: 1800 }, // 30分後
        { time: "11:00", expected: 3600 }, // 1時間後
        { time: "10:05", expected: 300 }, // 5分後
      ];

      cases.forEach(({ time, expected }) => {
        const target = TargetTime.fromString(time);
        expect(target.toDuration()).toBe(expected);
      });
    });

    it("目標時刻が現在時刻より前の場合は翌日として計算する", () => {
      // 15:00に設定
      vi.setSystemTime(new Date("2024-01-24T15:00:00"));

      const cases = [
        { time: "14:00", expected: 82800 }, // 23時間後
        { time: "00:00", expected: 32400 }, // 9時間後
        { time: "14:59", expected: 86340 }, // 23時間59分後
      ];

      cases.forEach(({ time, expected }) => {
        const target = TargetTime.fromString(time);
        expect(target.toDuration()).toBe(expected);
      });
    });
  });
});
