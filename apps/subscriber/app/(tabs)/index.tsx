import { ASSIGNED_MEDS } from '../../lib/assignedMedications';
import { getAllAdherenceHistory } from '../../lib/api';
import {
  dosageForDrugId,
  loadSubscriberSchedule,
  mergePendingWithProfile,
  type SavedSubscriberSchedule,
} from '../../lib/subscriberSchedule';
import type { AdherenceRecord } from '@arys-rx/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BRAND = '#006aff';

const PAGE = '#f5f5fa';
const INK = '#000000';
const MUTED = '#8e8e93';
const CARD = '#ffffff';
const SUBTLE_GRAY = '#f0f0f5';
const UPCOMING_ROW_BG = '#f5f5fa';
const AVATAR_BG = '#d6e8ff';
const AVATAR_INK = '#006aff';

const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  drug: 'Humira',
  dosage: '40mg/0.8mL',
  frequency: 'Every 2 weeks',
};

const HOME_AVATAR_INITIALS = 'SM';

const SCREEN_PAD = 20;
const CARD_GAP = 12;
const CARD_PAD = 20;
const ROW_V = 12;

function medicationListMeta(
  profile: SavedSubscriberSchedule | null,
  pending: AdherenceRecord[]
): { drugId: string; drugName: string; dosage: string; frequencyLabel: string }[] {
  if (profile?.medications.length) {
    return profile.medications.map((m) => ({
      drugId: m.drugId,
      drugName: m.drugName,
      dosage: m.dosage,
      frequencyLabel: m.frequencyLabel,
    }));
  }
  const seen = new Map<string, { drugId: string; drugName: string; dosage: string; frequencyLabel: string }>();
  for (const r of pending) {
    if (!seen.has(r.drugId)) {
      seen.set(r.drugId, {
        drugId: r.drugId,
        drugName: r.drugName,
        dosage: ASSIGNED_MEDS.find((m) => m.id === r.drugId)?.dosage ?? '',
        frequencyLabel: '',
      });
    }
  }
  if (seen.size === 0) {
    return [
      {
        drugId: 'drug-001',
        drugName: MOCK_USER.drug,
        dosage: MOCK_USER.dosage,
        frequencyLabel: MOCK_USER.frequency,
      },
    ];
  }
  return Array.from(seen.values());
}

function metaForDrug(
  medMetaList: { drugId: string; drugName: string; dosage: string; frequencyLabel: string }[],
  drugId: string
) {
  return medMetaList.find((m) => m.drugId === drugId);
}

function fmtDate(date: Date, opts: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', opts);
}

function fmtTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function usualTimeLabel(
  med: { drugId: string },
  pending: AdherenceRecord[],
  profile: SavedSubscriberSchedule | null
): string {
  const row = pending.find((r) => r.drugId === med.drugId);
  if (row) return fmtTime(new Date(row.scheduledAt));
  const saved = profile?.medications.find((m) => m.drugId === med.drugId);
  if (saved) return fmtTime(new Date(saved.nextScheduledAt));
  return '8:00 AM';
}

function UpcomingWhen({ d }: { d: Date }) {
  const datePart = `${fmtDate(d, { weekday: 'long' })}, ${fmtDate(d, { month: 'short', day: 'numeric' })}`;
  const timePart = fmtTime(d);
  return (
    <Text style={{ marginTop: 6, lineHeight: 20 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', color: INK }}>{datePart}</Text>
      <Text style={{ fontSize: 14, fontWeight: '400', color: MUTED }}>  {timePart}</Text>
    </Text>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [scheduleProfile, setScheduleProfile] = useState<SavedSubscriberSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      void (async () => {
        try {
          const [hist, profile] = await Promise.all([
            getAllAdherenceHistory(),
            loadSubscriberSchedule(),
          ]);
          if (!active) return;
          setRecords(hist);
          setScheduleProfile(profile);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const pending = mergePendingWithProfile(records, scheduleProfile);
  const pendingSorted = [...pending].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
  const nextDose = pendingSorted[0] ?? null;
  const medMetaList = medicationListMeta(scheduleProfile, pending);

  const nextDoseDosage = nextDose
    ? dosageForDrugId(scheduleProfile, nextDose.drugId) ??
      ASSIGNED_MEDS.find((m) => m.id === nextDose.drugId)?.dosage
    : undefined;

  const cardRadius = 16;

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PAGE }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <ActivityIndicator color={BRAND} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAGE }} edges={['bottom', 'left', 'right']}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingTop: Math.max(insets.top, 12),
          paddingHorizontal: SCREEN_PAD,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 22, fontWeight: '500', color: INK, letterSpacing: -0.3 }}>arys·rx</Text>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: AVATAR_BG,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: AVATAR_INK }}>{HOME_AVATAR_INITIALS}</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PAD,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Next Scheduled Dose */}
        <View
          style={{
            backgroundColor: CARD,
            borderRadius: cardRadius,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              backgroundColor: BRAND,
              paddingHorizontal: CARD_PAD,
              paddingTop: CARD_PAD,
              paddingBottom: 18,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="time-outline" size={16} color="#ffffff" />
              </View>
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '500' }}>Next Scheduled Dose</Text>
            </View>
            {nextDose ? (
              <>
                <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '500', marginBottom: 6, lineHeight: 34 }}>
                  {fmtDate(new Date(nextDose.scheduledAt), {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.92)', fontSize: 16, fontWeight: '400' }}>
                  {fmtTime(new Date(nextDose.scheduledAt))}
                </Text>
              </>
            ) : (
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '500' }}>All caught up</Text>
            )}
          </View>

          <View style={{ paddingHorizontal: CARD_PAD, paddingTop: 16, paddingBottom: 4 }}>
            <Text
              style={{
                color: MUTED,
                fontSize: 11,
                fontWeight: '500',
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              MEDICATION
            </Text>
            <Text style={{ color: INK, fontSize: 17, fontWeight: '500', lineHeight: 22 }}>
              {nextDose
                ? `${nextDose.drugName} ${nextDoseDosage ?? ''}`.trim()
                : `${MOCK_USER.drug} ${MOCK_USER.dosage}`}
            </Text>
          </View>

          <View style={{ paddingHorizontal: CARD_PAD, paddingTop: 12, paddingBottom: CARD_PAD }}>
            <Pressable
              onPress={() => router.push('/record/camera')}
              style={{
                backgroundColor: BRAND,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="videocam-outline" size={22} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Record Dose</Text>
            </Pressable>
          </View>
        </View>

        {/* Your Medications */}
        <View
          style={{
            marginTop: CARD_GAP,
            backgroundColor: CARD,
            borderRadius: cardRadius,
            paddingHorizontal: CARD_PAD,
            paddingTop: 18,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '500', color: INK }}>Your Medications</Text>
            <Pressable onPress={() => router.push('/onboarding')} hitSlop={8}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: BRAND }}>Edit</Text>
            </Pressable>
          </View>

          {medMetaList.map((med, idx) => (
            <View
              key={med.drugId}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingVertical: ROW_V,
                borderTopWidth: idx > 0 ? 1 : 0,
                borderTopColor: SUBTLE_GRAY,
              }}
            >
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: INK }}>{med.drugName}</Text>
                <Text style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{med.dosage}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: INK }}>
                  {usualTimeLabel(med, pendingSorted, scheduleProfile)}
                </Text>
                <Text style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
                  {med.frequencyLabel || MOCK_USER.frequency}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Upcoming Doses */}
        <View
          style={{
            marginTop: CARD_GAP,
            backgroundColor: CARD,
            borderRadius: cardRadius,
            paddingHorizontal: CARD_PAD,
            paddingTop: 18,
            paddingBottom: CARD_PAD,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '500', color: INK }}>Upcoming Doses</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/history')}
              hitSlop={8}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '500', color: INK }}>View History</Text>
              <Ionicons name="chevron-forward" size={14} color={INK} />
            </Pressable>
          </View>

          {pendingSorted.length === 0 ? (
            <Text style={{ fontSize: 14, color: MUTED, paddingVertical: 12 }}>No upcoming doses scheduled.</Text>
          ) : (
            pendingSorted.map((r, i) => {
              const d = new Date(r.scheduledAt);
              const meta = metaForDrug(medMetaList, r.drugId);
              const freq = meta?.frequencyLabel || MOCK_USER.frequency;
              const dosage = meta?.dosage ?? ASSIGNED_MEDS.find((m) => m.id === r.drugId)?.dosage ?? '';
              const isLast = i === pendingSorted.length - 1;
              return (
                <View
                  key={r.id}
                  style={{
                    backgroundColor: UPCOMING_ROW_BG,
                    borderRadius: 12,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    marginBottom: isLast ? 0 : 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 10, minWidth: 0 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: INK, lineHeight: 20 }}>
                      {r.drugName} {dosage}
                    </Text>
                    <Text style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{freq}</Text>
                    <UpcomingWhen d={d} />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: CARD,
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#f0f0f5',
                      flexShrink: 0,
                    }}
                  >
                    <Ionicons name="videocam-outline" size={14} color={MUTED} />
                    <Text style={{ fontSize: 12, fontWeight: '500', color: MUTED }}>Scheduled</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
