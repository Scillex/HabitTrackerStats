import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DayRecord } from "@/hooks/useTrainingStore";
import { BarChart3 } from "lucide-react";

interface Props {
  records: DayRecord[];
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function StatsDialog({ records }: Props) {
  const total = records.length;
  const ankiCount = records.filter((r) => r.anki).length;
  const eqCount = records.filter((r) => r.equilibreLeft && r.equilibreRight).length;
  const gainageCount = records.filter((r) => r.gainage).length;
  const souplesseCount = records.filter((r) => r.souplesse).length;
  const respiRecords = records.filter((r) => r.maxRespi !== null);
  const bestRespi = respiRecords.length > 0 ? Math.max(...respiRecords.map((r) => r.maxRespi!)) : 0;

  const stats = [
    { label: "📚 Anki", value: `${ankiCount}/${total} jours` },
    { label: "⚖️ Équilibre", value: `${eqCount}/${total} jours` },
    { label: "💪 Gainage", value: `${gainageCount}/${total} jours` },
    { label: "🧘 Souplesse", value: `${souplesseCount}/${total} jours` },
    { label: "🫁 Max Respi", value: bestRespi > 0 ? `Record: ${formatTime(bestRespi)}` : "Pas encore" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <BarChart3 className="mr-2 h-4 w-4" />
          Statistiques
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Statistiques</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {stats.map((s) => (
            <div key={s.label} className="flex justify-between items-center">
              <span className="text-foreground">{s.label}</span>
              <span className="text-muted-foreground text-sm">{s.value}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
