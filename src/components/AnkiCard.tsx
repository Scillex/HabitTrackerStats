import { Checkbox } from "@/components/ui/checkbox";
import { DayRecord } from "@/hooks/useTrainingStore";

interface Props {
  today: DayRecord;
  onToggle: () => void;
}

export function AnkiCard({ today, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">📚 Anki</h2>
        <p className="text-sm text-muted-foreground">Révision quotidienne</p>
      </div>
      <Checkbox checked={today.anki} onCheckedChange={onToggle} className="h-6 w-6" />
    </div>
  );
}
