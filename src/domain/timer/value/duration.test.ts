import { describe, expect, it } from "vitest";
import { Duration } from "./duration";

describe("Duration", () => {
  describe("constructor", () => {
    it("正の数値で初期化できる", () => {
      expect(() => new Duration(1)).not.toThrow();
      expect(() => new Duration(100)).not.toThrow();
    });

    it("0以下の値でエラーを投げる", () => {
      expect(() => new Duration(0)).toThrow("Duration must be greater than 0.");
      expect(() => new Duration(-1)).toThrow("Duration must be greater than 0.");
    });
  });

  describe("toSeconds", () => {
    it("秒数を返す", () => {
      const duration = new Duration(60);
      expect(duration.toSeconds()).toBe(60);
    });
  });

  describe("toFormatted", () => {
    it("1時間未満の場合は分:秒のフォーマットで返す", () => {
      expect(new Duration(65).toFormatted()).toBe("01:05");
      expect(new Duration(599).toFormatted()).toBe("09:59");
    });

    it("1時間以上の場合は時:分:秒のフォーマットで返す", () => {
      expect(new Duration(3600).toFormatted()).toBe("01:00:00");
      expect(new Duration(3900).toFormatted()).toBe("01:05:00");
    });
  });
});
