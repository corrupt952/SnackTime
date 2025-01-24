export class TargetTime {
  constructor(private readonly value: Date) {
    if (value < new Date()) {
      // 指定時刻が現在時刻より前の場合は、翌日の同時刻とする
      this.value = new Date(value.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  static fromString(time: string): TargetTime {
    // HH:mm形式のみを許可する正規表現
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      throw new Error("Invalid time format. Please use HH:mm format (24-hour).");
    }

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return new TargetTime(target);
  }

  toDuration(): number {
    const now = new Date();
    return Math.ceil((this.value.getTime() - now.getTime()) / 1000);
  }

  toString(): string {
    return this.value.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
