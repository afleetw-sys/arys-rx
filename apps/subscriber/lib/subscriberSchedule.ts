import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AdherenceRecord } from '@arys-rx/types';
import { ASSIGNED_MEDS, frequencyLabel } from './assignedMedications';

const STORAGE_KEY = '@arys-rx/subscriber-schedule-v1';

export type SavedMedicationSchedule = {
  drugId: string;
  drugName: string;
  dosage: string;
  frequencyId: string;
  frequencyLabel: string;
  nextScheduledAt: string;
};

export type SavedSubscriberSchedule = {
  medications: SavedMedicationSchedule[];
  updatedAt: string;
};

function to24Hour(hour12: number, ampm: 'AM' | 'PM'): number {
  if (ampm === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

function setClockOnDate(base: Date, hour12: number, minute: number, ampm: 'AM' | 'PM'): Date {
  const d = new Date(base);
  d.setHours(to24Hour(hour12, ampm), minute, 0, 0);
  return d;
}

function addMonths(d: Date, n: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + n);
  return out;
}

export function computeNextScheduledAt(
  cfg: {
    frequency: string | null;
    lastDoseDate: Date | null;
    hour: number;
    minute: number;
    ampm: 'AM' | 'PM';
  },
  now = new Date()
): Date | null {
  if (!cfg.frequency) return null;

  if (cfg.frequency === 'daily') {
    let candidate = setClockOnDate(now, cfg.hour, cfg.minute, cfg.ampm);
    if (candidate.getTime() <= now.getTime()) {
      const tmr = new Date(now);
      tmr.setDate(tmr.getDate() + 1);
      candidate = setClockOnDate(tmr, cfg.hour, cfg.minute, cfg.ampm);
    }
    return candidate;
  }

  if (!cfg.lastDoseDate) return null;

  let next = setClockOnDate(cfg.lastDoseDate, cfg.hour, cfg.minute, cfg.ampm);
  const advance = () => {
    if (cfg.frequency === 'weekly') {
      next.setDate(next.getDate() + 7);
    } else if (cfg.frequency === 'biweekly') {
      next.setDate(next.getDate() + 14);
    } else if (cfg.frequency === 'monthly') {
      next = addMonths(next, 1);
    }
  };
  advance();
  let guard = 0;
  while (next.getTime() <= now.getTime() && guard++ < 500) {
    advance();
  }
  return next;
}

function medById(id: string) {
  return ASSIGNED_MEDS.find((m) => m.id === id);
}

export async function saveSubscriberScheduleFromConfigs(
  medConfigs: {
    drugId: string;
    frequency: string | null;
    lastDoseDate: Date | null;
    hour: number;
    minute: number;
    ampm: 'AM' | 'PM';
  }[]
): Promise<void> {
  const now = new Date();
  const medications: SavedMedicationSchedule[] = [];

  for (const cfg of medConfigs) {
    const meta = medById(cfg.drugId);
    if (!meta || !cfg.frequency) continue;
    const next = computeNextScheduledAt(cfg, now);
    if (!next) continue;
    medications.push({
      drugId: meta.id,
      drugName: meta.name,
      dosage: meta.dosage,
      frequencyId: cfg.frequency,
      frequencyLabel: frequencyLabel(cfg.frequency),
      nextScheduledAt: next.toISOString(),
    });
  }

  const payload: SavedSubscriberSchedule = {
    medications,
    updatedAt: now.toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function loadSubscriberSchedule(): Promise<SavedSubscriberSchedule | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedSubscriberSchedule;
    if (!parsed?.medications || !Array.isArray(parsed.medications)) return null;
    return parsed;
  } catch {
    return null;
  }
}

const MOCK_SUBSCRIBER_ID = 'user-sub-001';

export function mergePendingWithProfile(
  apiRecords: AdherenceRecord[],
  profile: SavedSubscriberSchedule | null
): AdherenceRecord[] {
  const apiPending = apiRecords.filter((r) => r.status === 'pending');
  const byDrug = new Map<string, AdherenceRecord>();
  for (const r of apiPending) {
    byDrug.set(r.drugId, r);
  }

  if (profile) {
    for (const m of profile.medications) {
      const existing = byDrug.get(m.drugId);
      byDrug.set(m.drugId, {
        id: existing?.id ?? `local-pending-${m.drugId}`,
        subscriberId: MOCK_SUBSCRIBER_ID,
        drugId: m.drugId,
        drugName: m.drugName,
        scheduledAt: m.nextScheduledAt,
        takenAt: null,
        status: 'pending',
        videoId: null,
        notes: null,
      });
    }
  }

  return [...byDrug.values()].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
}

export function dosageForDrugId(
  profile: SavedSubscriberSchedule | null,
  drugId: string
): string | undefined {
  return profile?.medications.find((m) => m.drugId === drugId)?.dosage;
}
