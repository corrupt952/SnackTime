export const ja = {
  common: {
    appName: "Snack Time",
    cancel: "キャンセル",
    set: "設定",
    preview: "プレビュー",
  },
  popup: {
    setEndTime: "終了時刻を設定",
    presets: "プリセット",
    recent: "履歴",
    custom: "⚡カスタム",
  },
  modal: {
    setEndTime: {
      title: "終了時刻を設定",
      description: "タイマーを終了させたい時刻を入力してください。",
      descriptionTomorrow: "現在時刻より前の場合は、翌日に設定されます。",
    },
    customDuration: {
      title: "カスタム時間を設定",
      description: "HH:mm:ss形式で時間を入力してください。",
    },
  },
  options: {
    subtitle: "タイマー拡張機能の設定",
    nav: {
      general: "一般",
      appearance: "外観",
      notification: "通知",
    },
    general: {
      title: "一般設定",
      language: {
        label: "言語",
        description: "拡張機能の表示言語を選択します。",
      },
      timerPosition: {
        label: "タイマーの位置",
        description: "Webページ上でタイマーが表示される位置を選択します。表示後もドラッグで移動できます。",
        selectPrompt: "クリックしてタイマーの位置を選択：",
      },
      presetTimers: "プリセットタイマー",
    },
    appearance: {
      title: "外観",
      colorScheme: "カラースキーム",
      preview: "プレビュー",
      applyToSettings: {
        label: "このページに適用",
        description: "設定ページにも選択したテーマを使用",
      },
    },
    notification: {
      title: "通知",
      type: "通知タイプ",
      alarmSound: "アラーム音",
      volume: "音量",
    },
  },
  notificationType: {
    alarm: "アラーム",
    none: "なし",
    alarmDescription: "音で通知",
    noneDescription: "サイレントモード",
  },
  colorScheme: {
    system: "システム",
    light: "ライト",
    dark: "ダーク",
    lemon: "レモン",
    mint: "ミント",
    rose: "ローズ",
    lavender: "ラベンダー",
    nightsky: "夜空",
    deepsea: "深海",
    twilight: "黄昏",
    ink: "墨",
    sepia: "セピア",
    eveningrain: "暮雨",
    systemDescription: "システム設定に従う",
    lightDescription: "常にライトテーマ",
    darkDescription: "常にダークテーマ",
    lemonDescription: "明るいイエローテーマ",
    mintDescription: "爽やかなミントテーマ",
    roseDescription: "柔らかなローズテーマ",
    lavenderDescription: "柔らかなパープルテーマ",
    nightskyDescription: "夜空のインディゴテーマ",
    deepseaDescription: "深海の静けさ、生物発光",
    twilightDescription: "日没後の空、マジックアワー",
    inkDescription: "書道の静寂、朱のアクセント",
    sepiaDescription: "古い写真、ノスタルジック",
    eveningrainDescription: "夕暮れの雨、しっとりした静けさ",
  },
  presetEditor: {
    quickTemplates: {
      title: "クイックテンプレート",
      description: "テンプレートをクリックしてプリセット時間を即座に適用",
    },
    customPresets: {
      title: "カスタムプリセット",
      description: "各プリセットボタンの時間を自由に設定",
    },
    preset: "プリセット {{number}}",
    minutes: "分",
    resetToDefaults: "デフォルトに戻す",
    custom: "カスタム",
    userDefined: "ユーザー定義",
  },
  templates: {
    breaks: {
      name: "休憩",
      description: "1, 3, 5, 10 分",
    },
    pomodoro: {
      name: "ポモドーロ",
      description: "25, 5, 15, 30 分",
    },
    study: {
      name: "学習",
      description: "45, 10, 60, 90 分",
    },
    meditation: {
      name: "瞑想",
      description: "2, 5, 10, 20 分",
    },
    meetings: {
      name: "会議",
      description: "15, 30, 45, 60 分",
    },
  },
  timer: {
    timesUp: "時間です！",
  },
  position: {
    topLeft: "左上",
    topRight: "右上",
    bottomLeft: "左下",
    bottomRight: "右下",
    center: "中央",
  },
  language: {
    system: "システムのデフォルト",
    en: "英語",
    ja: "日本語",
    systemDescription: "ブラウザ/OSの言語設定を使用",
  },
  themeCategory: {
    basic: "基本",
    seijaku: "静寂",
  },
} as const;
