import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DayRecord, getGainageDuration } from "@/hooks/useTrainingStore";

interface Props {
  today: DayRecord;
  records: DayRecord[];
  onComplete: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function GainageCard({ today, records, onComplete }: Props) {
  const target = getGainageDuration(records);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(target);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRunning(true);
    setTimeLeft(target);
    let t = target;
    intervalRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        onComplete();
      }
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">💪 Gainage</h2>
          <p className="text-sm text-muted-foreground">Objectif : {formatTime(target)}</p>
        </div>
        {today.gainage && <span className="text-primary font-medium text-sm">✅</span>}
      </div>
      {running && (
        <p className="text-center text-4xl font-mono font-bold text-foreground py-3">
          {formatTime(timeLeft)}
        </p>
      )}
      {!today.gainage && !running && (
        <Button onClick={start} className="w-full mt-2" size="sm">
          Lancer le chrono
        </Button>
      )}
      {today.gainage && <p className="text-center text-sm text-primary py-2">Complété aujourd'hui</p>}
    </div>
  );
}
