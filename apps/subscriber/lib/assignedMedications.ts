export const ASSIGNED_MEDS = [
  {
    id: 'drug-001',
    name: 'Humira',
    genericName: 'adalimumab',
    manufacturer: 'AbbVie',
    dosage: '40mg/0.8mL',
    route: 'Subcutaneous injection',
  },
  {
    id: 'drug-002',
    name: 'Enbrel',
    genericName: 'etanercept',
    manufacturer: 'Amgen / Pfizer',
    dosage: '50mg/mL',
    route: 'Subcutaneous injection',
  },
] as const;

export type AssignedMedication = (typeof ASSIGNED_MEDS)[number];

export const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily', description: 'Once every day' },
  { id: 'weekly', label: 'Weekly', description: 'Once every week' },
  { id: 'biweekly', label: 'Every 2 weeks', description: 'Every other week' },
  { id: 'monthly', label: 'Monthly', description: 'Once a month' },
] as const;

export function frequencyLabel(id: string): string {
  const o = FREQUENCY_OPTIONS.find((x) => x.id === id);
  return o?.label ?? id;
}
