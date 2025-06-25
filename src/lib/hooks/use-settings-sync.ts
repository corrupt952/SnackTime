import { useEffect, useRef } from "react";
import { Settings, type ExtensionSettings } from "@/domain/settings/models/settings";

export function useSettingsSync<K extends keyof ExtensionSettings>(
  key: K,
  value: ExtensionSettings[K]
): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    Settings.set({ [key]: value } as Partial<ExtensionSettings>);
  }, [key, value]);
}