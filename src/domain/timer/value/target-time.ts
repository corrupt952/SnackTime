export class TargetTime {
  constructor(private readonly value: Date) {
    if (value < new Date()) {
      // 指定時刻が現在時刻より前の場合は、翌日の同時刻とする
      this.value = new Date(value.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  static fromString(time: string): TargetTime {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time format. Please use HH:mm format (24-hour).");
    }

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
