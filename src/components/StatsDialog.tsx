import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DayRecord } from "@/hooks/useTrainingStore";
import { BarChart3, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  records: DayRecord[];
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export function StatsDialog({ records }: Props) {
  const total = records.length;
  const ankiCount = records.filter((r) => r.anki).length;
  const eqCount = records.filter((r) => r.equilibreLeft && r.equilibreRight).length;
  const gainageCount = records.filter((r) => r.gainage).length;
  const souplesseCount = records.filter((r) => r.souplesse).length;
  const respiRecords = records.filter((r) => r.maxRespi !== null);
  const bestRespi = respiRecords.length > 0 ? Math.max(...respiRecords.map((r) => r.maxRespi!)) : 0;

  const summary = [
    { label: "📚 Anki", value: `${ankiCount}/${total}` },
    { label: "⚖️ Équilibre", value: `${eqCount}/${total}` },
    { label: "💪 Gainage", value: `${gainageCount}/${total}` },
    { label: "🧘 Souplesse", value: `${souplesseCount}/${total}` },
    { label: "🫁 Max Respi", value: bestRespi > 0 ? `Record: ${formatTime(bestRespi)}` : "—" },
  ];

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <BarChart3 className="mr-2 h-4 w-4" />
          Statistiques
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Statistiques</DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {summary.map((s) => (
            <div key={s.label} className="flex justify-between items-center rounded-md bg-muted px-3 py-2">
              <span className="text-foreground">{s.label}</span>
              <span className="text-muted-foreground font-medium">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Daily history */}
        <ScrollArea className="h-[300px] mt-2">
          <div className="space-y-2">
            {sortedRecords.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée</p>
            )}
            {sortedRecords.map((r) => (
              <div key={r.date} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium text-foreground mb-2">{formatDate(r.date)}</p>
                <div className="grid grid-cols-5 gap-1 text-xs text-center">
                  {[
                    { label: "Anki", done: r.anki },
                    { label: "Équil.", done: r.equilibreLeft && r.equilibreRight },
                    { label: "Gain.", done: r.gainage },
                    { label: "Soupl.", done: r.souplesse },
                    { label: "Respi", done: r.maxRespi !== null, extra: r.maxRespi !== null ? formatTime(r.maxRespi!) : undefined },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-0.5">
                      <span className="text-muted-foreground">{item.label}</span>
                      {item.done ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive opacity-50" />
                      )}
                      {item.extra && <span className="text-muted-foreground">{item.extra}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
