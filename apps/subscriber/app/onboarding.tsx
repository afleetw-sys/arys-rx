import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
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
  minute: number; // 0, 5, 10, … 55
  ampm: 'AM' | 'PM';
}

const TOTAL_STEPS = 1 + ASSIGNED_MEDS.length;

function phaseStepNum(phase: Phase): number {
  return phase.kind === 'intro' ? 1 : 2 + phase.medIndex;
}

function phaseTitle(phase: Phase): string {
  if (phase.kind === 'intro') return 'Your Medications';
  return `${ASSIGNED_MEDS[phase.medIndex].name} Schedule`;
}

function phaseSubtitle(phase: Phase): string {
  if (phase.kind === 'intro') return 'These specialty medications have been assigned to you.';
  return `Configure when you take ${ASSIGNED_MEDS[phase.medIndex].name}.`;
}

function ctaLabel(phase: Phase): string {
  if (phase.kind === 'intro') return 'Continue';
  return phase.medIndex === ASSIGNED_MEDS.length - 1 ? 'Get Started' : 'Continue';
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
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

  function canContinue(): boolean {
    if (phase.kind === 'intro') return true;
    const cfg = medConfigs[phase.medIndex];
    if (!cfg.frequency) return false;
    if (cfg.frequency !== 'daily' && !cfg.lastDoseDate) return false;
    return true;
  }

  async function advance() {
    if (phase.kind === 'intro') {
      setPhase({ kind: 'med', medIndex: 0 });
    } else {
      const next = phase.medIndex + 1;
      if (next < ASSIGNED_MEDS.length) {
        setPhase({ kind: 'med', medIndex: next });
      } else {
        await saveSubscriberScheduleFromConfigs(medConfigs);
        router.replace('/(tabs)/');
      }
    }
  }

  const stepNum = phaseStepNum(phase);
  const cfg = phase.kind === 'med' ? medConfigs[phase.medIndex] : null;

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
                backgroundColor: i < stepNum ? BRAND : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </View>

        <Text
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 11,
            fontWeight: '500',
            letterSpacing: 0.8,
            marginBottom: 8,
          }}
        >
          STEP {stepNum} OF {TOTAL_STEPS}
          {phase.kind === 'med' && ASSIGNED_MEDS.length > 1
            ? `  ·  ${ASSIGNED_MEDS[phase.medIndex].name.toUpperCase()}`
            : ''}
        </Text>
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
          <Pressable
            onPress={() => void advance()}
            disabled={!canContinue()}
            style={{
              backgroundColor: BRAND,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: canContinue() ? 1 : 0.35,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
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
          <DateStrip selected={lastDoseDate} onSelect={onLastDoseDateChange} />
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
          <MaterialClock
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

// ─── Date strip ───────────────────────────────────────────────────────────────

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function DateStrip({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return d;
  });

  useEffect(() => {
    // Scroll to show today (rightmost)
    scrollRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {days.map((d, i) => {
        const isSelected = selected
          ? d.toDateString() === selected.toDateString()
          : false;
        const isToday = d.toDateString() === today.toDateString();
        return (
          <Pressable
            key={i}
            onPress={() => onSelect(d)}
            style={{
              width: 52,
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: isSelected ? BRAND : '#fff',
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? BRAND : '#e9edf2',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '500',
                color: isSelected ? 'rgba(255,255,255,0.8)' : '#94a3b8',
              }}
            >
              {isToday ? 'TODAY' : DAY_LABELS[d.getDay()]}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: isSelected ? '#fff' : '#0f172a',
                marginTop: 4,
              }}
            >
              {d.getDate()}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: isSelected ? 'rgba(255,255,255,0.8)' : '#94a3b8',
                marginTop: 2,
              }}
            >
              {MONTH_LABELS[d.getMonth()]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Material-style clock picker ──────────────────────────────────────────────

const CLOCK_SIZE = 240;
const CLOCK_R = CLOCK_SIZE / 2;  // 120
const MARKER_R = 82;             // distance from center to number markers
const MARKER_SIZE = 36;

// Clock positions: index 0 = 12 o'clock, clockwise
const HOUR_ORDER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTE_ORDER = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function clockPos(index: number): { x: number; y: number } {
  const angle = (index / 12) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CLOCK_R + MARKER_R * Math.cos(angle),
    y: CLOCK_R + MARKER_R * Math.sin(angle),
  };
}

function MaterialClock({
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
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');

  const selHourIdx = HOUR_ORDER.indexOf(hour);
  const nearestMinute = (Math.round(minute / 5) * 5) % 60;
  const selMinuteIdx = MINUTE_ORDER.indexOf(nearestMinute);

  const selIdx = mode === 'hour' ? selHourIdx : selMinuteIdx;
  const selPos = clockPos(selIdx >= 0 ? selIdx : 0);

  // Hand: rectangle centered at midpoint of line from clock center → selPos
  const handAngle =
    Math.atan2(selPos.y - CLOCK_R, selPos.x - CLOCK_R) * (180 / Math.PI);
  const midX = (CLOCK_R + selPos.x) / 2;
  const midY = (CLOCK_R + selPos.y) / 2;

  return (
    <View style={{ alignItems: 'center', gap: 20 }}>
      {/* Digital display + AM/PM */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: '#e9edf2',
        }}
      >
        {/* Hour tab */}
        <Pressable
          onPress={() => setMode('hour')}
          style={{
            backgroundColor: mode === 'hour' ? BRAND : '#f5f7fa',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            minWidth: 58,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: '300',
              letterSpacing: 1,
              color: mode === 'hour' ? '#fff' : '#0f172a',
            }}
          >
            {hour.toString().padStart(2, '0')}
          </Text>
        </Pressable>

        <Text style={{ fontSize: 30, fontWeight: '300', color: '#94a3b8', marginHorizontal: 2 }}>
          :
        </Text>

        {/* Minute tab */}
        <Pressable
          onPress={() => setMode('minute')}
          style={{
            backgroundColor: mode === 'minute' ? BRAND : '#f5f7fa',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            minWidth: 58,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: '300',
              letterSpacing: 1,
              color: mode === 'minute' ? '#fff' : '#0f172a',
            }}
          >
            {minute.toString().padStart(2, '0')}
          </Text>
        </Pressable>

        {/* AM / PM */}
        <View style={{ marginLeft: 12, gap: 6 }}>
          {(['AM', 'PM'] as const).map((p) => (
            <Pressable
              key={p}
              onPress={() => onAmpmChange(p)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: ampm === p ? BRAND : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: ampm === p ? '#fff' : '#94a3b8',
                }}
              >
                {p}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Clock face */}
      <View
        style={{
          width: CLOCK_SIZE,
          height: CLOCK_SIZE,
          borderRadius: CLOCK_R,
          backgroundColor: '#e8f0fe',
        }}
      >
        {/* Hand: rectangle from center to selected marker */}
        {selIdx >= 0 && (
          <View
            style={{
              position: 'absolute',
              width: MARKER_R,
              height: 2,
              left: midX - MARKER_R / 2,
              top: midY - 1,
              backgroundColor: BRAND,
              borderRadius: 1,
              transform: [{ rotate: `${handAngle}deg` }],
            }}
          />
        )}

        {/* Center dot */}
        <View
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: BRAND,
            left: CLOCK_R - 5,
            top: CLOCK_R - 5,
          }}
        />

        {/* Hour markers */}
        {mode === 'hour' &&
          HOUR_ORDER.map((h, i) => {
            const { x, y } = clockPos(i);
            const isSelected = h === hour;
            return (
              <Pressable
                key={h}
                onPress={() => {
                  onHourChange(h);
                  setMode('minute'); // auto-advance to minute mode
                }}
                style={{
                  position: 'absolute',
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                  borderRadius: MARKER_SIZE / 2,
                  backgroundColor: isSelected ? BRAND : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: x - MARKER_SIZE / 2,
                  top: y - MARKER_SIZE / 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: isSelected ? '500' : '400',
                    color: isSelected ? '#fff' : '#1e293b',
                  }}
                >
                  {h}
                </Text>
              </Pressable>
            );
          })}

        {/* Minute markers */}
        {mode === 'minute' &&
          MINUTE_ORDER.map((m, i) => {
            const { x, y } = clockPos(i);
            const isSelected = m === nearestMinute;
            return (
              <Pressable
                key={m}
                onPress={() => onMinuteChange(m)}
                style={{
                  position: 'absolute',
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                  borderRadius: MARKER_SIZE / 2,
                  backgroundColor: isSelected ? BRAND : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: x - MARKER_SIZE / 2,
                  top: y - MARKER_SIZE / 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isSelected ? '500' : '400',
                    color: isSelected ? '#fff' : '#1e293b',
                  }}
                >
                  {m.toString().padStart(2, '0')}
                </Text>
              </Pressable>
            );
          })}
      </View>

      {/* Mode hint */}
      <Text style={{ color: '#94a3b8', fontSize: 12 }}>
        {mode === 'hour' ? 'Select hour — will advance to minute' : 'Select minute'}
      </Text>
    </View>
  );
}
