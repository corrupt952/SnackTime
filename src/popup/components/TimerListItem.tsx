import { Duration } from "@/domain/timer/value/duration";
import { Button } from "@/components/ui/button";

interface TimerListItemProps {
  duration: Duration;
  onStart: () => void;
}

export const TimerListItem = ({ duration, onStart }: TimerListItemProps) => {
  const text = duration.toFormatted();
  return (
    <Button variant="ghost" className="w-full justify-end" onClick={onStart}>
      {text}
    </Button>
  );
};
