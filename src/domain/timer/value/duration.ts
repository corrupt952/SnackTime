export class Duration {
  constructor(private readonly value: number) {
    if (value <= 0) {
      throw new Error("Duration must be greater than 0.");
    }
  }

  toSeconds() {
    return this.value;
  }

  // TODO: Move this method to the view layer.
  toFormatted(): string {
    const h = String(Math.floor(this.value / (60 * 60))).padStart(2, "0");
    const m = String(Math.floor((this.value % (60 * 60)) / 60)).padStart(2, "0");
    const s = String(this.value % 60).padStart(2, "0");
    if (h === "00") {
      return `${m}:${s}`;
    }
    return `${h}:${m}:${s}`;
  }
}
