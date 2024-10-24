import { Duration } from "@/domain/timer/value/duration";

export class History {
  private static readonly key = "history";

  static async all(): Promise<History[]> {
    const histories = (await chrome.storage.sync.get(History.key))[History.key];
    return histories
      ? JSON.parse(histories).map((history: any) => {
          const duration = new Duration(history.duration.value);
          return new History(duration, new Date(history.createdAt));
        })
      : [];
  }

  static async add(duration: Duration) {
    let histories = await this.all();
    const history = new History(duration);

    // Remove the same duration from the list
    histories = histories.filter((h) => h.duration.toSeconds() !== history.duration.toSeconds());

    // Add the new duration to the top of the list
    histories.unshift(history);

    // Keep the list up to 5 items
    if (histories.length > 5) {
      histories.pop();
    }

    chrome.storage.sync.set({ [History.key]: JSON.stringify(histories) });
  }

  constructor(
    readonly duration: Duration,
    private readonly createdAt: Date = new Date(),
  ) {}
}
