import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DayRecord } from "@/hooks/useTrainingStore";

interface Props {
  today: DayRecord;
  onComplete: (seconds: number) => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MaxRespiCard({ today, onComplete }: Props) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRunning(true);
    setElapsed(0);
    let t = 0;
    intervalRef.current = setInterval(() => {
      t++;
      setElapsed(t);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    onComplete(elapsed);
  };

  const thirtyMarker = Math.floor(elapsed / 30);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">🫁 Max Respi</h2>
          <p className="text-sm text-muted-foreground">Apnée maximale</p>
        </div>
        {today.maxRespi !== null && (
          <span className="text-primary font-medium text-sm">{formatTime(today.maxRespi)}</span>
        )}
      </div>
      {running && (
        <div className="text-center py-3">
          <p className="text-4xl font-mono font-bold text-foreground">{formatTime(elapsed)}</p>
          {thirtyMarker > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{thirtyMarker × 30}s passées</p>
          )}
          <Button onClick={stop} variant="destructive" className="w-full mt-3" size="sm">
            Stop
          </Button>
        </div>
      )}
      {!running && today.maxRespi === null && (
        <Button onClick={start} className="w-full mt-2" size="sm">
          Commencer
        </Button>
      )}
      {!running && today.maxRespi !== null && (
        <p className="text-center text-sm text-primary py-2">Record du jour : {formatTime(today.maxRespi)}</p>
      )}
    </div>
  );
}
