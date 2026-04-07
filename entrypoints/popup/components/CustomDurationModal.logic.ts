/**
 * Parse a time string in "HH:MM:SS" format to total seconds.
 * Returns the total number of seconds.
 */
export function parseTimeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export const DEFAULT_TIME = "00:05:00";
