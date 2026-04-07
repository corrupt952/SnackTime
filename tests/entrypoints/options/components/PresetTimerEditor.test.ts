import { describe, expect, it } from "vitest";
import {
  quickTemplateData,
  getSelectedTemplateId,
  validateMinutesInput,
  updatePresetAtIndex,
  DEFAULT_PRESETS,
} from "../../../../entrypoints/options/components/PresetTimerEditor.logic";
import { PresetTimer } from "@/domain/settings/models/settings";

describe("PresetTimerEditor logic", () => {
  describe("DEFAULT_PRESETS", () => {
    it("should contain 4 presets with values 1, 3, 5, 10", () => {
      expect(DEFAULT_PRESETS).toEqual([{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }]);
    });
  });

  describe("quickTemplateData", () => {
    it("should contain 5 templates", () => {
      expect(quickTemplateData).toHaveLength(5);
    });

    it("should have unique template IDs", () => {
      const ids = quickTemplateData.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have exactly 4 presets per template", () => {
      for (const template of quickTemplateData) {
        expect(template.presets).toHaveLength(4);
      }
    });
  });

  describe("getSelectedTemplateId", () => {
    it("should detect breaks template", () => {
      const presets: PresetTimer[] = [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }];
      expect(getSelectedTemplateId(presets)).toBe("breaks");
    });

    it("should detect pomodoro template", () => {
      const presets: PresetTimer[] = [{ minutes: 25 }, { minutes: 5 }, { minutes: 15 }, { minutes: 30 }];
      expect(getSelectedTemplateId(presets)).toBe("pomodoro");
    });

    it("should detect study template", () => {
      const presets: PresetTimer[] = [{ minutes: 45 }, { minutes: 10 }, { minutes: 60 }, { minutes: 90 }];
      expect(getSelectedTemplateId(presets)).toBe("study");
    });

    it("should detect meditation template", () => {
      const presets: PresetTimer[] = [{ minutes: 2 }, { minutes: 5 }, { minutes: 10 }, { minutes: 20 }];
      expect(getSelectedTemplateId(presets)).toBe("meditation");
    });

    it("should detect meetings template", () => {
      const presets: PresetTimer[] = [{ minutes: 15 }, { minutes: 30 }, { minutes: 45 }, { minutes: 60 }];
      expect(getSelectedTemplateId(presets)).toBe("meetings");
    });

    it("should return custom when presets do not match any template", () => {
      const presets: PresetTimer[] = [{ minutes: 7 }, { minutes: 14 }, { minutes: 21 }, { minutes: 28 }];
      expect(getSelectedTemplateId(presets)).toBe("custom");
    });

    it("should return custom when preset count differs from templates", () => {
      const presets: PresetTimer[] = [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }];
      expect(getSelectedTemplateId(presets)).toBe("custom");
    });

    it("should return custom for empty presets array", () => {
      expect(getSelectedTemplateId([])).toBe("custom");
    });

    it("should not match when values are same but in different order", () => {
      const presets: PresetTimer[] = [{ minutes: 10 }, { minutes: 5 }, { minutes: 3 }, { minutes: 1 }];
      expect(getSelectedTemplateId(presets)).toBe("custom");
    });
  });

  describe("validateMinutesInput", () => {
    it("should accept valid minute values", () => {
      expect(validateMinutesInput("5")).toBe(5);
      expect(validateMinutesInput("1")).toBe(1);
      expect(validateMinutesInput("999")).toBe(999);
    });

    it("should convert 0 to 1 (minimum fallback)", () => {
      expect(validateMinutesInput("0")).toBe(1);
    });

    it("should reject negative values", () => {
      expect(validateMinutesInput("-1")).toBeNull();
      expect(validateMinutesInput("-100")).toBeNull();
    });

    it("should reject values above 999", () => {
      expect(validateMinutesInput("1000")).toBeNull();
      expect(validateMinutesInput("9999")).toBeNull();
    });

    it("should reject non-numeric input", () => {
      expect(validateMinutesInput("abc")).toBeNull();
      expect(validateMinutesInput("")).toBeNull();
      expect(validateMinutesInput("12.5")).toBe(12);
    });
  });

  describe("updatePresetAtIndex", () => {
    const basePresets: PresetTimer[] = [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }];

    it("should update the preset at the given index", () => {
      const result = updatePresetAtIndex(basePresets, 0, "25");
      expect(result).toEqual([{ minutes: 25 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }]);
    });

    it("should update the last preset", () => {
      const result = updatePresetAtIndex(basePresets, 3, "60");
      expect(result).toEqual([{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 60 }]);
    });

    it("should return null for invalid input", () => {
      expect(updatePresetAtIndex(basePresets, 0, "abc")).toBeNull();
      expect(updatePresetAtIndex(basePresets, 0, "-5")).toBeNull();
      expect(updatePresetAtIndex(basePresets, 0, "1000")).toBeNull();
    });

    it("should not mutate the original presets array", () => {
      const original = [...basePresets];
      updatePresetAtIndex(basePresets, 0, "25");
      expect(basePresets).toEqual(original);
    });

    it("should produce presets that match a template after applying template values", () => {
      let result = updatePresetAtIndex(basePresets, 0, "25");
      result = updatePresetAtIndex(result!, 1, "5");
      result = updatePresetAtIndex(result!, 2, "15");
      result = updatePresetAtIndex(result!, 3, "30");
      expect(getSelectedTemplateId(result!)).toBe("pomodoro");
    });
  });
});
