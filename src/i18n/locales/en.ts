export const en = {
  common: {
    appName: "Snack Time",
    cancel: "Cancel",
    set: "Set",
    preview: "Preview",
  },
  popup: {
    setEndTime: "Set end time",
    presets: "Presets",
    recent: "Recent",
    custom: "⚡Custom",
  },
  modal: {
    setEndTime: {
      title: "Set end time",
      description: "Enter the time you want the timer to end at.",
      descriptionTomorrow: "If the time is earlier than now, it will be set for tomorrow.",
    },
    customDuration: {
      title: "Set custom duration",
      description: "Enter the duration in HH:mm:ss format.",
    },
  },
  options: {
    subtitle: "Timer Extension Settings",
    nav: {
      general: "General",
      appearance: "Appearance",
      notification: "Notification",
    },
    general: {
      title: "General Settings",
      language: {
        label: "Language",
        description: "Choose your preferred language for the extension interface.",
      },
      timerPosition: {
        label: "Timer Position",
        description:
          "Choose where the timer appears on web pages. You can still drag it to any position after it appears.",
        selectPrompt: "Click to select timer position:",
      },
      presetTimers: "Preset Timers",
    },
    appearance: {
      title: "Appearance",
      colorScheme: "Color Scheme",
      preview: "Preview",
      applyToSettings: {
        label: "Apply to this page",
        description: "Use selected theme for the settings page",
      },
    },
    notification: {
      title: "Notification",
      type: "Notification Type",
      alarmSound: "Alarm Sound",
      volume: "Volume",
    },
  },
  notificationType: {
    alarm: "Alarm",
    none: "None",
    alarmDescription: "Play sound notification",
    noneDescription: "Silent mode",
  },
  colorScheme: {
    system: "System",
    light: "Light",
    dark: "Dark",
    lemon: "Lemon",
    mint: "Mint",
    rose: "Rose",
    yorusora: "よるそら - Yorusora",
    lavender: "Lavender",
    systemDescription: "Match system preference",
    lightDescription: "Always light theme",
    darkDescription: "Always dark theme",
    lemonDescription: "Bright yellow theme",
    mintDescription: "Fresh mint theme",
    roseDescription: "Soft rose theme",
    yorusoraDescription: "Night sky indigo theme",
    lavenderDescription: "Soft purple theme",
  },
  presetEditor: {
    quickTemplates: {
      title: "Quick Templates",
      description: "Click a template to apply preset times instantly",
    },
    customPresets: {
      title: "Custom Presets",
      description: "Set your own timer values for each preset button",
    },
    preset: "Preset {{number}}",
    minutes: "minutes",
    resetToDefaults: "Reset to Defaults",
    custom: "Custom",
    userDefined: "User defined",
  },
  templates: {
    breaks: {
      name: "Breaks",
      description: "1, 3, 5, 10 min",
    },
    pomodoro: {
      name: "Pomodoro",
      description: "25, 5, 15, 30 min",
    },
    study: {
      name: "Study",
      description: "45, 10, 60, 90 min",
    },
    meditation: {
      name: "Meditation",
      description: "2, 5, 10, 20 min",
    },
    meetings: {
      name: "Meetings",
      description: "15, 30, 45, 60 min",
    },
  },
  timer: {
    timesUp: "Time's up!",
  },
  position: {
    topLeft: "top left",
    topRight: "top right",
    bottomLeft: "bottom left",
    bottomRight: "bottom right",
    center: "center",
  },
  language: {
    system: "System Default",
    en: "English",
    ja: "Japanese",
    systemDescription: "Use browser/OS language setting",
  },
  themeCategory: {
    basic: "Basic",
    seijaku: "Seijaku",
  },
} as const;
