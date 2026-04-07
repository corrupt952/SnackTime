import { describe, expect, it } from "vitest";
import { parseTimeToSeconds, DEFAULT_TIME } from "../../../../entrypoints/popup/components/CustomDurationModal.logic";
import { Duration } from "@/domain/timer/value/duration";

describe("CustomDurationModal logic", () => {
  describe("DEFAULT_TIME", () => {
    it("should be 00:05:00 (5 minutes)", () => {
      expect(DEFAULT_TIME).toBe("00:05:00");
    });

    it("should parse to 300 seconds", () => {
      expect(parseTimeToSeconds(DEFAULT_TIME)).toBe(300);
    });
  });

  describe("parseTimeToSeconds", () => {
    it("should parse hours, minutes, and seconds correctly", () => {
      expect(parseTimeToSeconds("01:30:00")).toBe(5400);
    });

    it("should parse minutes and seconds with zero hours", () => {
      expect(parseTimeToSeconds("00:05:00")).toBe(300);
    });

    it("should parse seconds only", () => {
      expect(parseTimeToSeconds("00:00:30")).toBe(30);
    });

    it("should handle minimum valid time (00:00:01)", () => {
      expect(parseTimeToSeconds("00:00:01")).toBe(1);
    });

    it("should handle maximum practical time (99:59:59)", () => {
      expect(parseTimeToSeconds("99:59:59")).toBe(359999);
    });

    it("should handle all zeros", () => {
      expect(parseTimeToSeconds("00:00:00")).toBe(0);
    });

    it("should correctly sum hours, minutes, and seconds", () => {
      // 2h 30m 45s = 7200 + 1800 + 45 = 9045
      expect(parseTimeToSeconds("02:30:45")).toBe(9045);
    });
  });

  describe("Duration integration with parseTimeToSeconds", () => {
    it("should create a valid Duration from a parsed time of 1 second", () => {
      const seconds = parseTimeToSeconds("00:00:01");
      const duration = new Duration(seconds);
      expect(duration.toSeconds()).toBe(1);
    });

    it("should create a valid Duration from default time", () => {
      const seconds = parseTimeToSeconds(DEFAULT_TIME);
      const duration = new Duration(seconds);
      expect(duration.toSeconds()).toBe(300);
      expect(duration.toFormatted()).toBe("05:00");
    });

    it("should throw when creating Duration from zero seconds", () => {
      const seconds = parseTimeToSeconds("00:00:00");
      expect(() => new Duration(seconds)).toThrow("Duration must be greater than 0.");
    });

    it("should create Duration with correct formatting for multi-hour time", () => {
      const seconds = parseTimeToSeconds("02:15:30");
      const duration = new Duration(seconds);
      expect(duration.toSeconds()).toBe(8130);
      expect(duration.toFormatted()).toBe("02:15:30");
    });
  });
});
