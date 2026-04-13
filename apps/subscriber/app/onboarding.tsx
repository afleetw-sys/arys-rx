import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { ASSIGNED_MEDS, FREQUENCY_OPTIONS } from '../lib/assignedMedications';
import { saveSubscriberScheduleFromConfigs } from '../lib/subscriberSchedule';

const BRAND = '#006aff';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = { kind: 'intro' } | { kind: 'med'; medIndex: number };

interface MedConfig {
  drugId: string;
  frequency: string | null;
  lastDoseDate: Date | null;
  hour: number;   // 1–12
  minute: number; // 0–59
  ampm: 'AM' | 'PM';
}

const TOTAL_STEPS = 1 + ASSIGNED_MEDS.length;

function phaseStepNum(phase: Phase): number {
  return phase.kind === 'intro' ? 1 : 2 + phase.medIndex;
}

function phaseTitle(phase: Phase): string {
  if (phase.kind === 'intro') return 'Your Medications';
  return 'Medication Schedule';
}

function phaseSubtitle(phase: Phase): string {
  if (phase.kind === 'intro') return 'These specialty medications have been assigned to you.';
  return 'Set how often and when you take this medication.';
}

function ctaLabel(phase: Phase): string {
  if (phase.kind === 'intro') return 'Continue';
  return phase.medIndex === ASSIGNED_MEDS.length - 1 ? 'Get Started' : 'Continue';
}

function validationMessage(phase: Phase, configs: MedConfig[]): string | null {
  if (phase.kind === 'intro') return null;
  const cfg = configs[phase.medIndex];
  if (!cfg.frequency) return 'Select how often you take this medication.';
  if (cfg.frequency !== 'daily' && !cfg.lastDoseDate) return 'Choose the date of your last dose.';
  return null;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

function isEditScheduleParam(v: string | string[] | undefined): boolean {
  const s = Array.isArray(v) ? v[0] : v;
  return s === '1' || s === 'true';
}

export default function OnboardingScreen() {
  const { edit } = useLocalSearchParams<{ edit?: string | string[] }>();
  const isEditingSchedule = isEditScheduleParam(edit);

  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [scheduleSubmitAttempted, setScheduleSubmitAttempted] = useState(false);
  const [medConfigs, setMedConfigs] = useState<MedConfig[]>(
    ASSIGNED_MEDS.map((m) => ({
      drugId: m.id,
      frequency: null,
      lastDoseDate: null,
      hour: 8,
      minute: 0,
      ampm: 'AM',
    }))
  );

  function updateConfig(medIndex: number, patch: Partial<MedConfig>) {
    setMedConfigs((prev) =>
      prev.map((c, i) => (i === medIndex ? { ...c, ...patch } : c))
    );
  }

  const currentValidationMessage = validationMessage(phase, medConfigs);

  useEffect(() => {
    if (phase.kind === 'med' && !currentValidationMessage) {
      setScheduleSubmitAttempted(false);
    }
  }, [phase, currentValidationMessage]);

  async function advance() {
    if (phase.kind === 'intro') {
      setScheduleSubmitAttempted(false);
      setPhase({ kind: 'med', medIndex: 0 });
      return;
    }
    const msg = validationMessage(phase, medConfigs);
    if (msg) {
      setScheduleSubmitAttempted(true);
      return;
    }
    setScheduleSubmitAttempted(false);
    const next = phase.medIndex + 1;
    if (next < ASSIGNED_MEDS.length) {
      setPhase({ kind: 'med', medIndex: next });
    } else {
      await saveSubscriberScheduleFromConfigs(medConfigs);
      router.replace('/(tabs)/');
    }
  }

  function goBack() {
    if (phase.kind === 'intro') {
      router.back();
      return;
    }
    if (phase.medIndex === 0) {
      setScheduleSubmitAttempted(false);
      setPhase({ kind: 'intro' });
      return;
    }
    setScheduleSubmitAttempted(false);
    setPhase({ kind: 'med', medIndex: phase.medIndex - 1 });
  }

  const stepNum = phaseStepNum(phase);
  const cfg = phase.kind === 'med' ? medConfigs[phase.medIndex] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Dark header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 22 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: i < stepNum ? BRAND : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            gap: 12,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'rgba(255,255,255,0.45)',
              fontSize: 11,
              fontWeight: '500',
              letterSpacing: 0.8,
            }}
          >
            STEP {stepNum} OF {TOTAL_STEPS}
          </Text>
          {isEditingSchedule ? (
            <Pressable
              onPress={() => router.back()}
              hitSlop={14}
              accessibilityLabel="Close"
              style={{ padding: 4, marginRight: -4 }}
            >
              <Ionicons name="close" size={24} color="rgba(255,255,255,0.92)" />
            </Pressable>
          ) : null}
        </View>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500', marginBottom: 6 }}>
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

          {phase.kind === 'med' && cfg && (
            <StepSchedule
              medication={ASSIGNED_MEDS[phase.medIndex]}
              frequency={cfg.frequency}
              onFrequencyChange={(v) =>
                updateConfig(phase.medIndex, {
                  frequency: v,
                  lastDoseDate: v === 'daily' ? null : cfg.lastDoseDate,
                })
              }
              lastDoseDate={cfg.lastDoseDate}
              onLastDoseDateChange={(d) => updateConfig(phase.medIndex, { lastDoseDate: d })}
              hour={cfg.hour}
              minute={cfg.minute}
              ampm={cfg.ampm}
              onHourChange={(h) => updateConfig(phase.medIndex, { hour: h })}
              onMinuteChange={(m) => updateConfig(phase.medIndex, { minute: m })}
              onAmpmChange={(p) => updateConfig(phase.medIndex, { ampm: p })}
            />
          )}
        </ScrollView>

        {/* Fixed CTA */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 28, paddingTop: 12 }}>
          {phase.kind === 'med' && scheduleSubmitAttempted && currentValidationMessage ? (
            <Text style={{ color: '#b91c1c', fontSize: 13, marginBottom: 10 }}>{currentValidationMessage}</Text>
          ) : (
            <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>
              {phase.kind === 'intro'
                ? 'Review your assigned medications, then continue.'
                : 'Set this schedule now and you can update it later.'}
            </Text>
          )}
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
            {phase.kind === 'med' ? (
              <Pressable
                onPress={goBack}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#cbd5e1',
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#0f172a' }}>Back</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={() => void advance()}
              style={{
                flex: 1,
                backgroundColor: BRAND,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
                {ctaLabel(phase)}
              </Text>
            </Pressable>
          </View>
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
            borderColor: '#e9edf2',
            padding: 18,
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
            <Text style={{ fontSize: 20, fontWeight: '500', color: '#0f172a' }}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="videocam-outline" size={13} color={BRAND} />
                <Text style={{ color: BRAND, fontSize: 11, fontWeight: '500' }}>Video required</Text>
              </View>
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
        <Ionicons name="information-circle-outline" size={18} color="#b45309" />
        <Text style={{ color: '#92400e', fontSize: 13, flex: 1, lineHeight: 18 }}>
          Your medications are assigned by your health plan. Contact your care
          team if anything looks incorrect.
        </Text>
      </View>
    </View>
  );
}

// ─── Step 2+: Combined schedule step ─────────────────────────────────────────

function StepSchedule({
  medication,
  frequency,
  onFrequencyChange,
  lastDoseDate,
  onLastDoseDateChange,
  hour,
  minute,
  ampm,
  onHourChange,
  onMinuteChange,
  onAmpmChange,
}: {
  medication: (typeof ASSIGNED_MEDS)[number];
  frequency: string | null;
  onFrequencyChange: (v: string) => void;
  lastDoseDate: Date | null;
  onLastDoseDateChange: (d: Date) => void;
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
  onAmpmChange: (p: 'AM' | 'PM') => void;
}) {
  const isDaily = frequency === 'daily';
  const showDateStrip = !!frequency && !isDaily;

  return (
    <View style={{ gap: 24 }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e9edf2',
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '500', color: '#94a3b8', letterSpacing: 0.7 }}>
          SCHEDULING FOR
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#0f172a' }}>{medication.name}</Text>
        <Text style={{ fontSize: 13, color: '#64748b' }}>
          {medication.dosage} · {medication.route}
        </Text>
      </View>

      {/* Frequency */}
      <View>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: '#94a3b8',
            letterSpacing: 0.8,
            marginBottom: 10,
          }}
        >
          HOW OFTEN
        </Text>
        <View style={{ gap: 8 }}>
          {FREQUENCY_OPTIONS.map((opt) => {
            const active = frequency === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onFrequencyChange(opt.id)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  borderWidth: active ? 2 : 1,
                  borderColor: active ? BRAND : '#e9edf2',
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#0f172a' }}>
                    {opt.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
                    {opt.description}
                  </Text>
                </View>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: active ? 0 : 1.5,
                    borderColor: '#dfe4ea',
                    backgroundColor: active ? BRAND : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {active && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Last dose date (non-daily only) */}
      {showDateStrip && (
        <View>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: '#94a3b8',
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            WHEN WAS YOUR LAST DOSE?
          </Text>
          <DateField selected={lastDoseDate} onSelect={onLastDoseDateChange} />
        </View>
      )}

      {/* Time picker (appears once frequency is chosen) */}
      {!!frequency && (
        <View>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: '#94a3b8',
              letterSpacing: 0.8,
              marginBottom: 16,
            }}
          >
            {isDaily ? 'WHAT TIME DO YOU TAKE IT?' : 'AT WHAT TIME?'}
          </Text>
          <TimeNumberInputs
            hour={hour}
            minute={minute}
            ampm={ampm}
            onHourChange={onHourChange}
            onMinuteChange={onMinuteChange}
            onAmpmChange={onAmpmChange}
          />
        </View>
      )}
    </View>
  );
}

// ─── Date picker modal ────────────────────────────────────────────────────────

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function startOfMonth(d: Date): Date {
  const out = new Date(d);
  out.setDate(1);
  out.setHours(0, 0, 0, 0);
  return out;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DateField({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(startOfMonth(selected ?? today));

  const firstDow = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(displayMonth);
      d.setDate(i + 1);
      d.setHours(0, 0, 0, 0);
      return d;
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function openPicker() {
    setDisplayMonth(startOfMonth(selected ?? today));
    setOpen(true);
  }

  function prevMonth() {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() - 1);
    setDisplayMonth(startOfMonth(d));
  }

  function nextMonth() {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() + 1);
    if (startOfMonth(d).getTime() > startOfMonth(today).getTime()) return;
    setDisplayMonth(startOfMonth(d));
  }

  const canGoNext = startOfMonth(displayMonth).getTime() < startOfMonth(today).getTime();

  return (
    <>
      <Pressable
        onPress={openPicker}
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e9edf2',
          paddingHorizontal: 14,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#0f172a' }}>
            {selected ? formatDateLong(selected) : 'Select date'}
          </Text>
          <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            Tap to choose from calendar
          </Text>
        </View>
        <Ionicons name="calendar-outline" size={20} color={BRAND} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(2,6,23,0.45)',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View
            style={{
              width: '100%',
              maxWidth: 430,
              backgroundColor: '#fff',
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 24,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: '#d6dbe3' }} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Pressable onPress={prevMonth} hitSlop={8}>
                <Ionicons name="chevron-back" size={22} color="#0f172a" />
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>
                {MONTH_LABELS[displayMonth.getMonth()]} {displayMonth.getFullYear()}
              </Text>
              <Pressable onPress={nextMonth} hitSlop={8} disabled={!canGoNext} style={{ opacity: canGoNext ? 1 : 0.35 }}>
                <Ionicons name="chevron-forward" size={22} color="#0f172a" />
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              {DAY_LABELS.map((label) => (
                <View key={label} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                  <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>{label}</Text>
                </View>
              ))}
            </View>

            {Array.from({ length: cells.length / 7 }, (_, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: 'row' }}>
                {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => {
                  if (!day) {
                    return <View key={`empty-${rowIndex}-${colIndex}`} style={{ flex: 1, height: 42 }} />;
                  }
                  const isFuture = day.getTime() > today.getTime();
                  const isSelected = selected ? isSameDay(day, selected) : false;
                  return (
                    <Pressable
                      key={`${day.toISOString()}-${colIndex}`}
                      onPress={() => {
                        onSelect(day);
                        setOpen(false);
                      }}
                      disabled={isFuture}
                      style={{
                        flex: 1,
                        height: 42,
                        marginVertical: 2,
                        marginHorizontal: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? BRAND : 'transparent',
                        opacity: isFuture ? 0.35 : 1,
                      }}
                    >
                      <Text style={{ fontSize: 14, color: isSelected ? '#fff' : '#0f172a', fontWeight: isSelected ? '600' : '400' }}>
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── Time (hour / minute number inputs) ───────────────────────────────────────

function TimeNumberInputs({
  hour,
  minute,
  ampm,
  onHourChange,
  onMinuteChange,
  onAmpmChange,
}: {
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
  onAmpmChange: (p: 'AM' | 'PM') => void;
}) {
  const minuteRef = useRef<TextInput>(null);
  const [hourText, setHourText] = useState(String(hour));
  const [minuteText, setMinuteText] = useState(minute.toString().padStart(2, '0'));

  useEffect(() => {
    setHourText(String(hour));
    setMinuteText(minute.toString().padStart(2, '0'));
  }, [hour, minute]);

  const commitHour = () => {
    const trimmed = hourText.trim();
    let n = parseInt(trimmed, 10);
    if (trimmed === '' || Number.isNaN(n)) {
      n = hour;
    }
    n = Math.min(12, Math.max(1, n));
    onHourChange(n);
    setHourText(String(n));
  };

  const commitMinute = () => {
    const trimmed = minuteText.trim();
    let n = parseInt(trimmed, 10);
    if (trimmed === '' || Number.isNaN(n)) {
      n = minute;
    }
    n = Math.min(59, Math.max(0, n));
    onMinuteChange(n);
    setMinuteText(n.toString().padStart(2, '0'));
  };

  const digitField = {
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#0f172a',
    textAlign: 'center' as const,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9edf2',
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9edf2',
        padding: 14,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TextInput
            value={hourText}
            onChangeText={(t: string) => {
              const d = t.replace(/\D/g, '').slice(0, 2);
              setHourText(d);
              if (d.length === 2) {
                const n = parseInt(d, 10);
                if (!Number.isNaN(n) && n >= 1 && n <= 12) {
                  onHourChange(n);
                  minuteRef.current?.focus();
                }
              }
            }}
            onBlur={commitHour}
            onSubmitEditing={() => {
              commitHour();
              minuteRef.current?.focus();
            }}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            returnKeyType="next"
            placeholder="12"
            placeholderTextColor="#94a3b8"
            style={{ ...digitField, width: 44, minHeight: 48 }}
          />
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#94a3b8' }}>:</Text>
          <TextInput
            ref={minuteRef}
            value={minuteText}
            onChangeText={(t: string) => {
              const d = t.replace(/\D/g, '').slice(0, 2);
              setMinuteText(d);
              if (d.length === 2) {
                const n = parseInt(d, 10);
                if (!Number.isNaN(n)) {
                  const clamped = Math.min(59, Math.max(0, n));
                  onMinuteChange(clamped);
                }
              }
            }}
            onBlur={commitMinute}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            placeholder="00"
            placeholderTextColor="#94a3b8"
            style={{ ...digitField, width: 48, minHeight: 48 }}
          />
        </View>
        <View style={{ flex: 1, minWidth: 8 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['AM', 'PM'] as const).map((p) => (
            <Pressable
              key={p}
              delayPressIn={0}
              onPress={() => onAmpmChange(p)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: ampm === p ? 0 : 1,
                borderColor: '#e9edf2',
                backgroundColor: ampm === p ? BRAND : '#fff',
                minWidth: 48,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 48,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '500', color: ampm === p ? '#fff' : '#0f172a' }}>{p}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
