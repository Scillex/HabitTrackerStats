import { useState, useCallback } from "react";

export interface DayRecord {
  date: string; // YYYY-MM-DD
  anki: boolean;
  equilibreLeft: boolean;
  equilibreRight: boolean;
  gainage: boolean;
  souplesse: boolean;
  maxRespi: number | null; // seconds held
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadRecords(): DayRecord[] {
  try {
    return JSON.parse(localStorage.getItem("training-records") || "[]");
  } catch {
    return [];
  }
}

function saveRecords(records: DayRecord[]) {
  localStorage.setItem("training-records", JSON.stringify(records));
}

function getOrCreateToday(records: DayRecord[]): DayRecord {
  const today = todayStr();
  const existing = records.find((r) => r.date === today);
  if (existing) return existing;
  return {
    date: today,
    anki: false,
    equilibreLeft: false,
    equilibreRight: false,
    gainage: false,
    souplesse: false,
    maxRespi: null,
  };
}

export function getGainageDuration(records: DayRecord[]): number {
  // Start at 170s (2min50). +5s/day until 180s (3min), then +2s/day
  const completedDays = records.filter((r) => r.gainage).length;
  let duration = 170;
  let remaining = completedDays;

  // Phase 1: +5s per day until 180
  while (remaining > 0 && duration < 180) {
    duration += 5;
    remaining--;
  }
  if (duration > 180) duration = 180;

  // Phase 2: +2s per day after 180
  duration += remaining * 2;

  return duration;
}

export function useTrainingStore() {
  const [records, setRecords] = useState<DayRecord[]>(loadRecords);
  const today = getOrCreateToday(records);

  const updateToday = useCallback(
    (patch: Partial<DayRecord>) => {
      setRecords((prev) => {
        const todayDate = todayStr();
        const idx = prev.findIndex((r) => r.date === todayDate);
        let next: DayRecord[];
        if (idx >= 0) {
          next = [...prev];
          next[idx] = { ...next[idx], ...patch };
        } else {
          next = [...prev, { ...getOrCreateToday(prev), ...patch }];
        }
        saveRecords(next);
        return next;
      });
    },
    []
  );

  return { records, today, updateToday };
}
