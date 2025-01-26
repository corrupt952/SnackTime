import { Duration } from "@/domain/timer/value/duration";

interface HistoryData {
  duration: {
    value: number;
  };
  createdAt: string;
}

export class History {
  private static readonly key = "history";
  private static readonly maxHistoryItems = 5;

  static async all(): Promise<History[]> {
    try {
      const stored = (await chrome.storage.sync.get(History.key))[History.key];
      if (!stored) {
        return [];
      }

      const histories = this.parseHistories(stored);
      return this.normalizeHistories(histories);
    } catch (error) {
      console.warn("Failed to load histories:", error);
      return [];
    }
  }

  static async add(duration: Duration): Promise<void> {
    try {
      let histories = await this.all();
      const history = new History(duration);

      histories = this.removeDuplicate(histories, history);
      histories = this.addToTop(histories, history);
      histories = this.limitSize(histories);

      await chrome.storage.sync.set({
        [History.key]: JSON.stringify(histories),
      });
    } catch (error) {
      console.warn("Failed to save history:", error);
    }
  }

  private static parseHistories(stored: string): History[] {
    try {
      const data = JSON.parse(stored) as HistoryData[];
      return data.reduce<History[]>((validHistories, history) => {
        try {
          const duration = new Duration(history.duration.value);
          const createdAt = new Date(history.createdAt);
          if (!isNaN(createdAt.getTime())) {
            validHistories.push(new History(duration, createdAt));
          }
        } catch (error) {
          console.warn("Skipping invalid history:", error);
        }
        return validHistories;
      }, []);
    } catch (error) {
      console.warn("Failed to parse histories:", error);
      return [];
    }
  }

  private static normalizeHistories(histories: History[]): History[] {
    return histories.filter((history) => {
      return (
        history.duration instanceof Duration && history.createdAt instanceof Date && !isNaN(history.createdAt.getTime())
      );
    });
  }

  private static removeDuplicate(histories: History[], newHistory: History): History[] {
    return histories.filter((h) => h.duration.toSeconds() !== newHistory.duration.toSeconds());
  }

  private static addToTop(histories: History[], history: History): History[] {
    return [history, ...histories];
  }

  private static limitSize(histories: History[]): History[] {
    return histories.slice(0, this.maxHistoryItems);
  }

  constructor(
    readonly duration: Duration,
    private readonly createdAt: Date = new Date(),
  ) {}

  toJSON(): HistoryData {
    return {
      duration: { value: this.duration.toSeconds() },
      createdAt: this.createdAt.toISOString(),
    };
  }
}
