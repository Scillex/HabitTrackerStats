import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DayRecord } from "@/hooks/useTrainingStore";
import { Check } from "lucide-react";

interface Props {
  today: DayRecord;
  onComplete: (leg: "left" | "right") => void;
}

export function EquilibreCard({ today, onComplete }: Props) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [currentLeg, setCurrentLeg] = useState<"left" | "right">("left");
  const [round, setRound] = useState(0); // 0-2
  const [timeLeft, setTimeLeft] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const beep = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    osc.frequency.value = 800;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, []);

  const startTimer = useCallback(() => {
    setPhase("running");
    setRound(0);
    setTimeLeft(10);
    let r = 0;
    let t = 10;

    intervalRef.current = setInterval(() => {
      t--;
      if (t <= 0) {
        if (r < 2) {
          r++;
          t = 10;
          beep();
          setRound(r);
        } else {
          clearInterval(intervalRef.current!);
          beep();
          setPhase("done");
          onComplete(currentLeg === "left" ? "left" : "right");
          return;
        }
      }
      setTimeLeft(t);
    }, 1000);
  }, [beep, currentLeg, onComplete]);

  const handleStart = () => {
    if (!today.equilibreLeft) {
      setCurrentLeg("left");
    } else {
      setCurrentLeg("right");
    }
    startTimer();
  };

  const leftDone = today.equilibreLeft;
  const rightDone = today.equilibreRight;
  const allDone = leftDone && rightDone;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">⚖️ Équilibre</h2>
          <p className="text-sm text-muted-foreground">3×10s par jambe</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className={leftDone ? "text-primary font-medium" : "text-muted-foreground"}>
            G {leftDone ? <Check className="inline h-4 w-4" /> : "○"}
          </span>
          <span className={rightDone ? "text-primary font-medium" : "text-muted-foreground"}>
            D {rightDone ? <Check className="inline h-4 w-4" /> : "○"}
          </span>
        </div>
      </div>
      {phase === "running" && (
        <div className="text-center py-3">
          <p className="text-sm text-muted-foreground mb-1">
            {currentLeg === "left" ? "Jambe gauche" : "Jambe droite"} — Série {round + 1}/3
          </p>
          <p className="text-4xl font-mono font-bold text-foreground">{timeLeft}s</p>
        </div>
      )}
      {phase === "done" && (
        <p className="text-center text-sm text-primary py-2">
          {currentLeg === "left" ? "Gauche" : "Droite"} terminé !
        </p>
      )}
      {!allDone && phase !== "running" && (
        <Button onClick={handleStart} className="w-full mt-2" size="sm">
          {phase === "done" ? "Commencer l'autre jambe" : leftDone ? "Commencer (droite)" : "Commencer (gauche)"}
        </Button>
      )}
      {allDone && <p className="text-center text-sm text-primary font-medium py-2">✅ Complété</p>}
    </div>
  );
}
