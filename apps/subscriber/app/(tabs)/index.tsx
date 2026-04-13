import { ASSIGNED_MEDS, assignedMedDosage } from '../../lib/assignedMedications';
import { getAllAdherenceHistory } from '../../lib/api';
import { fmtDate, fmtTime } from '../../lib/formatDateTime';
import {
  AVATAR_BG,
  AVATAR_INK,
  BRAND,
  CARD,
  CARD_GAP,
  CARD_PAD,
  INK,
  MUTED,
  PAGE,
  SCREEN_PAD,
  SUBTLE_GRAY,
} from '../../lib/subscriberTheme';
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
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  drug: 'Humira',
  dosage: '40mg/0.8mL',
  frequency: 'Every 2 weeks',
};

const HOME_AVATAR_INITIALS = 'SM';

const ROW_V = 12;

function medicationListMeta(
  profile: SavedSubscriberSchedule | null,
  pending: AdherenceRecord[]
): { drugId: string; drugName: string; dosage: string; frequencyLabel: string }[] {
  const profileByDrug = new Map(
    (profile?.medications ?? []).map((m) => [m.drugId, m] as const)
  );
  const pendingByDrug = new Map<string, AdherenceRecord>();
  for (const r of pending) {
    if (!pendingByDrug.has(r.drugId)) pendingByDrug.set(r.drugId, r);
  }

  const baseList = ASSIGNED_MEDS.map((assigned) => {
    const saved = profileByDrug.get(assigned.id);
    const fromPending = pendingByDrug.get(assigned.id);
    return {
      drugId: assigned.id,
      drugName: saved?.drugName ?? fromPending?.drugName ?? assigned.name,
      dosage: saved?.dosage ?? assigned.dosage,
      frequencyLabel: saved?.frequencyLabel ?? (assigned.id === 'drug-001' ? MOCK_USER.frequency : 'Weekly'),
    };
  });

  const knownDrugIds = new Set<string>(baseList.map((m) => m.drugId));
  const extrasFromProfile = (profile?.medications ?? [])
    .filter((m) => !knownDrugIds.has(m.drugId))
    .map((m) => ({
      drugId: m.drugId,
      drugName: m.drugName,
      dosage: m.dosage,
      frequencyLabel: m.frequencyLabel,
    }));

  return [...baseList, ...extrasFromProfile];
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

const UpcomingWhen = memo(function UpcomingWhen({ scheduledAt }: { scheduledAt: string }) {
  const d = new Date(scheduledAt);
  const datePart = `${fmtDate(d, { weekday: 'long' })}, ${fmtDate(d, { month: 'short', day: 'numeric' })}`;
  const timePart = fmtTime(d);
  return (
    <Text style={{ marginTop: 6, lineHeight: 20 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', color: INK }}>{datePart}</Text>
      <Text style={{ fontSize: 14, fontWeight: '400', color: MUTED }}>  {timePart}</Text>
    </Text>
  );
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [scheduleProfile, setScheduleProfile] = useState<SavedSubscriberSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const showLoadingSpinnerRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (showLoadingSpinnerRef.current) setLoading(true);
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
          if (active) {
            if (showLoadingSpinnerRef.current) setLoading(false);
            showLoadingSpinnerRef.current = false;
          }
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const { pendingSorted, medMetaList, medMetaByDrugId, nextDose } = useMemo(() => {
    const pending = mergePendingWithProfile(records, scheduleProfile);
    const pendingSorted = [...pending].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
    const medMetaList = medicationListMeta(scheduleProfile, pending);
    const medMetaByDrugId = new Map(medMetaList.map((m) => [m.drugId, m]));
    return {
      pendingSorted,
      medMetaList,
      medMetaByDrugId,
      nextDose: pendingSorted[0] ?? null,
    };
  }, [records, scheduleProfile]);

  const nextDoseDosage = useMemo(() => {
    if (!nextDose) return undefined;
    const fromProfile = dosageForDrugId(scheduleProfile, nextDose.drugId);
    if (fromProfile) return fromProfile;
    const d = assignedMedDosage(nextDose.drugId);
    return d || undefined;
  }, [scheduleProfile, nextDose]);

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
            <Pressable onPress={() => router.push('/onboarding?edit=1')} hitSlop={8}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: BRAND }}>Edit</Text>
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
              <Text style={{ fontSize: 15, fontWeight: '500', color: INK }}>View History</Text>
              <Ionicons name="chevron-forward" size={16} color={INK} />
            </Pressable>
          </View>

          {pendingSorted.length === 0 ? (
            <Text style={{ fontSize: 14, color: MUTED, paddingVertical: 12 }}>No upcoming doses scheduled.</Text>
          ) : (
            pendingSorted.map((r, i) => {
              const meta = medMetaByDrugId.get(r.drugId);
              const freq = meta?.frequencyLabel || MOCK_USER.frequency;
              const dosage = meta?.dosage || assignedMedDosage(r.drugId);
              const isLast = i === pendingSorted.length - 1;
              return (
                <View
                  key={r.id}
                  style={{
                    backgroundColor: PAGE,
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
                    <UpcomingWhen scheduledAt={r.scheduledAt} />
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
