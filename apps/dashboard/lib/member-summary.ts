import type { AdherenceSummary } from '@arys-rx/types';

export function safeAdherenceRate(summary: AdherenceSummary): number {
  const r = summary.adherenceRate;
  return typeof r === 'number' && Number.isFinite(r) ? r : 0;
}

export function formatMedicationCount(summary: AdherenceSummary): string {
  const n = summary.medicationCount;
  if (typeof n === 'number' && Number.isFinite(n) && n >= 0) return String(n);
  return '—';
}

export function medicationProgramLine(summary: AdherenceSummary): string {
  const c = formatMedicationCount(summary);
  if (c === '—') return 'Medication count unavailable';
  return `${c} medications on program`;
}
