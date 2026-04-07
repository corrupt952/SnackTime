import { Clock, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TimeInput } from "./TimeInput";
import { Duration } from "@/domain/timer/value/duration";

interface CustomDurationModalProps {
  onClose: () => void;
  onSubmit: (duration: Duration) => void;
}

export const CustomDurationModal = ({ onClose, onSubmit }: CustomDurationModalProps) => {
  const { t } = useTranslation();
  const [time, setTime] = useState<string>("00:05:00");

  const handleSubmit = () => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    onSubmit(new Duration(totalSeconds));
  };

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-xs">
      <div className="flex items-center justify-center h-full">
        <Card className="w-[280px] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t("modal.customDuration.title")}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{t("modal.customDuration.description")}</div>
            <TimeInput value={time} onTimeChange={setTime} showSeconds />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={!time}>
                {t("common.set")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
