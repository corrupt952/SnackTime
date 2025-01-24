import { Clock, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TimeInput } from "./TimeInput";

interface TimeInputModalProps {
  onClose: () => void;
  onSubmit: (time: string) => void;
}

export const TimeInputModal = ({ onClose, onSubmit }: TimeInputModalProps) => {
  const getDefaultTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const [time, setTime] = useState<string>(getDefaultTime());

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center h-full">
        <Card className="w-[280px] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Set end time</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Enter the time you want the timer to end at.
              <br />
              If the time is earlier than now, it will be set for tomorrow.
            </div>
            <TimeInput value={time} onTimeChange={setTime} placeholder="14:30" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSubmit(time)} disabled={!time}>
                Set
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
