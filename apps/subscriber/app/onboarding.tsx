import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const BRAND = '#006aff';

// ─── Static data ─────────────────────────────────────────────────────────────

const ASSIGNED_MEDS = [
  {
    id: 'drug-001',
    name: 'Humira',
    genericName: 'adalimumab',
    manufacturer: 'AbbVie',
    dosage: '40mg/0.8mL',
    route: 'Subcutaneous injection',
  },
];

const METHOD_OPTIONS = [
  {
    id: 'self-injection',
    label: 'Self-injection',
    description: 'You administer it yourself at home',
    icon: '💉',
  },
  {
    id: 'provider-injection',
    label: 'Provider-administered',
    description: 'Given by a nurse or physician',
    icon: '🏥',
  },
  {
    id: 'oral',
    label: 'Oral tablet / capsule',
    description: 'Swallowed by mouth',
    icon: '💊',
  },
  {
    id: 'infusion',
    label: 'IV infusion',
    description: 'Administered at an infusion center',
    icon: '🩺',
  },
];

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily', description: 'Once every day' },
  { id: 'weekly', label: 'Weekly', description: 'Once every week' },
  { id: 'biweekly', label: 'Every 2 weeks', description: 'Every other week' },
  { id: 'monthly', label: 'Monthly', description: 'Once a month' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type MedStep = 'method' | 'frequency' | 'time';
type Phase = { kind: 'intro' } | { kind: 'med'; medIndex: number; step: MedStep };

interface MedConfig {
  drugId: string;
  method: string | null;
  frequency: string | null;
  time: string;
}

const STEPS_PER_MED = 3; // method + frequency + time
const TOTAL_STEPS = 1 + ASSIGNED_MEDS.length * STEPS_PER_MED;

function phaseStepNum(phase: Phase): number {
  if (phase.kind === 'intro') return 1;
  const offset = { method: 0, frequency: 1, time: 2 };
  return 2 + phase.medIndex * STEPS_PER_MED + offset[phase.step];
}

function phaseTitle(phase: Phase): string {
  if (phase.kind === 'intro') return 'Your Medications';
  const med = ASSIGNED_MEDS[phase.medIndex];
  if (phase.step === 'method') return `${med.name} · Administration`;
  if (phase.step === 'frequency') return `${med.name} · Dose Schedule`;
  return `${med.name} · Dose Time`;
}

function phaseSubtitle(phase: Phase): string {
  if (phase.kind === 'intro') return 'These specialty medications have been assigned to you.';
  const med = ASSIGNED_MEDS[phase.medIndex];
  if (phase.step === 'method') return 'How will you administer this medication?';
  if (phase.step === 'frequency') return `How often will you take ${med.name}?`;
  return 'Set the exact time you will take your dose.';
}

function ctaLabel(phase: Phase): string {
  if (phase.kind === 'intro') return 'Continue';
  const isLast =
    phase.step === 'time' && phase.medIndex === ASSIGNED_MEDS.length - 1;
  return isLast ? 'Get Started' : 'Continue';
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [medConfigs, setMedConfigs] = useState<MedConfig[]>(
    ASSIGNED_MEDS.map((m) => ({
      drugId: m.id,
      method: null,
      frequency: null,
      time: '8:00 AM',
    }))
  );

  function updateConfig(medIndex: number, patch: Partial<MedConfig>) {
    setMedConfigs((prev) =>
      prev.map((c, i) => (i === medIndex ? { ...c, ...patch } : c))
    );
  }

  function canContinue(): boolean {
    if (phase.kind === 'intro') return true;
    const cfg = medConfigs[phase.medIndex];
    if (phase.step === 'method') return !!cfg.method;
    if (phase.step === 'frequency') return !!cfg.frequency;
    return true; // time always has a default
  }

  function advance() {
    if (phase.kind === 'intro') {
      setPhase({ kind: 'med', medIndex: 0, step: 'method' });
    } else {
      const { medIndex, step } = phase;
      if (step === 'method') {
        setPhase({ kind: 'med', medIndex, step: 'frequency' });
      } else if (step === 'frequency') {
        setPhase({ kind: 'med', medIndex, step: 'time' });
      } else {
        // time → next med or done
        if (medIndex < ASSIGNED_MEDS.length - 1) {
          setPhase({ kind: 'med', medIndex: medIndex + 1, step: 'method' });
        } else {
          router.replace('/(tabs)/');
        }
      }
    }
  }

  const stepNum = phaseStepNum(phase);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Dark header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 }}>
        {/* Progress segments */}
        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 22 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor:
                  i < stepNum ? BRAND : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </View>

        <Text
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.8,
            marginBottom: 8,
          }}
        >
          STEP {stepNum} OF {TOTAL_STEPS}
          {phase.kind === 'med' && ASSIGNED_MEDS.length > 1
            ? `  ·  ${ASSIGNED_MEDS[phase.medIndex].name.toUpperCase()}`
            : ''}
        </Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 6 }}>
          {phaseTitle(phase)}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 20 }}>
          {phaseSubtitle(phase)}
        </Text>
      </View>

      {/* White content card */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#f8fafc',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {phase.kind === 'intro' && <StepMedications />}

          {phase.kind === 'med' && phase.step === 'method' && (
            <StepMethod
              selected={medConfigs[phase.medIndex].method}
              onSelect={(v) => updateConfig(phase.medIndex, { method: v })}
            />
          )}

          {phase.kind === 'med' && phase.step === 'frequency' && (
            <StepFrequency
              selected={medConfigs[phase.medIndex].frequency}
              onSelect={(v) => updateConfig(phase.medIndex, { frequency: v })}
            />
          )}

          {phase.kind === 'med' && phase.step === 'time' && (
            <StepTime
              onChange={(v) =>
                phase.kind === 'med' && updateConfig(phase.medIndex, { time: v })
              }
            />
          )}
        </ScrollView>

        {/* Fixed CTA */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 28, paddingTop: 12 }}>
          <Pressable
            onPress={advance}
            disabled={!canContinue()}
            style={{
              backgroundColor: BRAND,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: canContinue() ? 1 : 0.35,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
              {ctaLabel(phase)}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Step 1: Medications list ─────────────────────────────────────────────────

function StepMedications() {
  return (
    <View style={{ gap: 12 }}>
      {ASSIGNED_MEDS.map((med) => (
        <View
          key={med.id}
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            padding: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>
              {med.name}
            </Text>
            <View
              style={{
                backgroundColor: '#eff6ff',
                borderRadius: 99,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: BRAND, fontSize: 11, fontWeight: '600' }}>
                📹 Video required
              </Text>
            </View>
          </View>
          <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 3 }}>
            {med.genericName}
          </Text>
          <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 3 }}>
            {med.dosage} · {med.route}
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>
            {med.manufacturer}
          </Text>
        </View>
      ))}

      <View
        style={{
          backgroundColor: '#fffbeb',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#fef3c7',
          padding: 14,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <Text style={{ fontSize: 14 }}>ℹ️</Text>
        <Text style={{ color: '#92400e', fontSize: 13, flex: 1, lineHeight: 18 }}>
          Your medications are assigned by your health plan. Contact your care
          team if anything looks incorrect.
        </Text>
      </View>
    </View>
  );
}

// ─── Method selection ─────────────────────────────────────────────────────────

function StepMethod({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      {METHOD_OPTIONS.map((opt) => {
        const active = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              borderWidth: active ? 2 : 1,
              borderColor: active ? BRAND : '#e2e8f0',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {/* Icon badge */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: active ? '#eff6ff' : '#f8fafc',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: 22 }}>{opt.icon}</Text>
            </View>

            {/* Labels */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f172a' }}>
                {opt.label}
              </Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                {opt.description}
              </Text>
            </View>

            {/* Radio indicator */}
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: active ? 0 : 1.5,
                borderColor: '#cbd5e1',
                backgroundColor: active ? BRAND : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {active && (
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>✓</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Frequency selection ──────────────────────────────────────────────────────

function StepFrequency({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      {FREQUENCY_OPTIONS.map((opt) => {
        const active = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: active ? 2 : 1,
              borderColor: active ? BRAND : '#e2e8f0',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#0f172a' }}>
                {opt.label}
              </Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                {opt.description}
              </Text>
            </View>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: active ? 0 : 1.5,
                borderColor: '#cbd5e1',
                backgroundColor: active ? BRAND : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {active && (
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>✓</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Exact time picker ────────────────────────────────────────────────────────

function StepTime({ onChange }: { onChange: (time: string) => void }) {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    onChange(`${hour}:${minute.toString().padStart(2, '0')} ${ampm}`);
  }, [hour, minute, ampm]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ gap: 24 }}>
      {/* Picker card */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          padding: 28,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <PickerColumn
            value={hour.toString().padStart(2, '0')}
            onUp={() => setHour((h) => (h === 12 ? 1 : h + 1))}
            onDown={() => setHour((h) => (h === 1 ? 12 : h - 1))}
          />

          <Text style={{ fontSize: 44, fontWeight: '800', color: '#0f172a', marginBottom: 4 }}>
            :
          </Text>

          <PickerColumn
            value={minute.toString().padStart(2, '0')}
            onUp={() => setMinute((m) => (m + 5 >= 60 ? 0 : m + 5))}
            onDown={() => setMinute((m) => (m - 5 < 0 ? 55 : m - 5))}
          />

          <View style={{ gap: 8, marginLeft: 12 }}>
            {(['AM', 'PM'] as const).map((p) => (
              <Pressable
                key={p}
                onPress={() => setAmpm(p)}
                style={{
                  backgroundColor: ampm === p ? BRAND : '#f1f5f9',
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  minWidth: 56,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: ampm === p ? '#fff' : '#64748b',
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Live preview */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#94a3b8', fontSize: 13 }}>Dose reminder will be sent at</Text>
        <Text style={{ color: '#0f172a', fontSize: 18, fontWeight: '700', marginTop: 4 }}>
          {hour}:{minute.toString().padStart(2, '0')} {ampm}
        </Text>
      </View>
    </View>
  );
}

function PickerColumn({
  value,
  onUp,
  onDown,
}: {
  value: string;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <Pressable
        onPress={onUp}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#f1f5f9',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: BRAND, fontSize: 18, fontWeight: '700', lineHeight: 22 }}>▲</Text>
      </Pressable>

      <Text
        style={{
          fontSize: 44,
          fontWeight: '800',
          color: '#0f172a',
          minWidth: 68,
          textAlign: 'center',
        }}
      >
        {value}
      </Text>

      <Pressable
        onPress={onDown}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#f1f5f9',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: BRAND, fontSize: 18, fontWeight: '700', lineHeight: 22 }}>▼</Text>
      </Pressable>
    </View>
  );
}
