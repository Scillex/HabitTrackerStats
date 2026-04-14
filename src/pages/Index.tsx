import { useTrainingStore } from "@/hooks/useTrainingStore";
import { AnkiCard } from "@/components/AnkiCard";
import { EquilibreCard } from "@/components/EquilibreCard";
import { GainageCard } from "@/components/GainageCard";
import { SouplesseCard } from "@/components/SouplesseCard";
import { MaxRespiCard } from "@/components/MaxRespiCard";
import { StatsDialog } from "@/components/StatsDialog";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { records, today, updateToday } = useTrainingStore();

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-4 text-center">Entraînement</h1>
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <AnkiCard today={today} onToggle={() => updateToday({ anki: !today.anki })} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <EquilibreCard
              today={today}
              onComplete={(leg) =>
                updateToday(leg === "left" ? { equilibreLeft: true } : { equilibreRight: true })
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <GainageCard today={today} records={records} onComplete={() => updateToday({ gainage: true })} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SouplesseCard today={today} onToggle={() => updateToday({ souplesse: !today.souplesse })} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <MaxRespiCard today={today} onComplete={(s) => updateToday({ maxRespi: s })} />
          </CardContent>
        </Card>
        <StatsDialog records={records} />
      </div>
    </div>
  );
};

export default Index;
