import { Checkbox } from "@/components/ui/checkbox";
import { DayRecord } from "@/hooks/useTrainingStore";

interface Props {
  today: DayRecord;
  onToggle: () => void;
}

export function SouplesseCard({ today, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">🧘 Souplesse</h2>
        <p className="text-sm text-muted-foreground">Étirements quotidiens</p>
      </div>
      <Checkbox checked={today.souplesse} onCheckedChange={onToggle} className="h-6 w-6" />
    </div>
  );
}
