import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

const BRAND = '#006aff';

// Assigned by the health plan — not user-entered
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

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily', description: 'Once every day' },
  { id: 'weekly', label: 'Weekly', description: 'Once every week' },
  { id: 'biweekly', label: 'Every 2 weeks', description: 'Every other week' },
  { id: 'monthly', label: 'Monthly', description: 'Once a month' },
];

const STEP_TITLES = ['Your Medications', 'Dose Schedule', 'Dose Time'];
const STEP_SUBTITLES = [
  'These specialty medications have been assigned to you.',
  'How often will you be taking your medication?',
  'Set the exact time you will take your dose each day.',
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [doseTime, setDoseTime] = useState<string>('8:00 AM');

  const canContinue =
    step === 1 || (step === 2 && !!frequency) || step === 3;

  function handleContinue() {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      router.replace('/(tabs)/');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Dark header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 }}>
        {/* Progress bar */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 22 }}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: s <= step ? BRAND : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </View>

        <Text
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.5,
            marginBottom: 8,
          }}
        >
          STEP {step} OF 3
        </Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 6 }}>
          {STEP_TITLES[step - 1]}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 20 }}>
          {STEP_SUBTITLES[step - 1]}
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
          {step === 1 && <StepMedications />}
          {step === 2 && (
            <StepFrequency selected={frequency} onSelect={setFrequency} />
          )}
          {step === 3 && <StepTime onChange={setDoseTime} />}
        </ScrollView>

        {/* Fixed CTA */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 28, paddingTop: 12 }}>
          <Pressable
            onPress={handleContinue}
            disabled={!canContinue}
            style={{
              backgroundColor: BRAND,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: canContinue ? 1 : 0.35,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
              {step === 3 ? 'Get Started' : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Step 1: Your Medications ────────────────────────────────────────────────

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

// ─── Step 2: Frequency ───────────────────────────────────────────────────────

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

// ─── Step 3: Exact Time Picker ───────────────────────────────────────────────

function StepTime({ onChange }: { onChange: (time: string) => void }) {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    onChange(`${hour}:${minute.toString().padStart(2, '0')} ${ampm}`);
  }, [hour, minute, ampm]); // eslint-disable-line react-hooks/exhaustive-deps

  function incHour() {
    setHour((h) => (h === 12 ? 1 : h + 1));
  }
  function decHour() {
    setHour((h) => (h === 1 ? 12 : h - 1));
  }
  function incMinute() {
    setMinute((m) => (m + 5 >= 60 ? 0 : m + 5));
  }
  function decMinute() {
    setMinute((m) => (m - 5 < 0 ? 55 : m - 5));
  }

  return (
    <View style={{ gap: 24 }}>
      {/* Time display */}
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
          {/* Hour column */}
          <PickerColumn
            value={hour.toString().padStart(2, '0')}
            onUp={incHour}
            onDown={decHour}
          />

          <Text style={{ fontSize: 44, fontWeight: '800', color: '#0f172a', marginBottom: 4 }}>
            :
          </Text>

          {/* Minute column */}
          <PickerColumn
            value={minute.toString().padStart(2, '0')}
            onUp={incMinute}
            onDown={decMinute}
          />

          {/* AM / PM */}
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

      {/* Preview */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#94a3b8', fontSize: 13 }}>Your dose will be scheduled for</Text>
        <Text style={{ color: '#0f172a', fontSize: 17, fontWeight: '700', marginTop: 4 }}>
          {hour}:{minute.toString().padStart(2, '0')} {ampm} every day
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
