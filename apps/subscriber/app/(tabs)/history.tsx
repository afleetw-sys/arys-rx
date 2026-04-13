import { SubscriberSubpageHeader } from '../../components/SubscriberSubpageHeader';
import { ASSIGNED_MEDS } from '../../lib/assignedMedications';
import { getAllAdherenceHistory } from '../../lib/api';
import { fmtDate, fmtTime } from '../../lib/formatDateTime';
import {
  BACK_LABEL,
  BRAND,
  CARD_GAP,
  CARD_RADIUS,
  INK,
  MUTED,
  PAGE,
  SCREEN_PAD,
} from '../../lib/subscriberTheme';
import type { AdherenceRecord } from '@arys-rx/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

const TAKEN_ICON_BG = '#dcfce7';
const TAKEN_ICON = '#16a34a';
const TAKEN_BADGE_BG = '#dcfce7';
const TAKEN_BADGE_TEXT = '#166534';

const MISSED_ICON_BG = '#fee2e2';
const MISSED_ICON = '#dc2626';
const MISSED_BADGE_BG = '#fee2e2';
const MISSED_BADGE_TEXT = '#b91c1c';

function withMedicationHistoryFallback(records: AdherenceRecord[]): AdherenceRecord[] {
  const completed = records.filter((r) => r.status !== 'pending');
  const byDrug = new Map<string, AdherenceRecord[]>(ASSIGNED_MEDS.map((m) => [m.id, []]));
  for (const row of completed) {
    const bucket = byDrug.get(row.drugId) ?? [];
    bucket.push(row);
    byDrug.set(row.drugId, bucket);
  }

  const now = new Date();
  const fallbackRows: AdherenceRecord[] = [];
  for (let index = 0; index < ASSIGNED_MEDS.length; index += 1) {
    const med = ASSIGNED_MEDS[index];
    if ((byDrug.get(med.id)?.length ?? 0) > 0) continue;
    const scheduled = new Date(now);
    scheduled.setDate(scheduled.getDate() - (index + 1) * 7);
    scheduled.setHours(8 + index, 0, 0, 0);
    fallbackRows.push({
      id: `local-history-${med.id}`,
      subscriberId: 'user-sub-001',
      drugId: med.id,
      drugName: med.name,
      scheduledAt: scheduled.toISOString(),
      takenAt: null,
      status: 'missed',
      videoId: null,
      notes: null,
    });
  }

  return [...completed, ...fallbackRows].sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );
}

export default function HistoryScreen() {
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const showLoadingSpinnerRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (showLoadingSpinnerRef.current) setLoading(true);
      void (async () => {
        try {
          const hist = await getAllAdherenceHistory();
          if (!active) return;
          setRecords(hist);
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

  const { completed, takenCount, adherenceRate } = useMemo(() => {
    const completed = withMedicationHistoryFallback(records);
    const takenCount = completed.filter((r) => r.status === 'taken').length;
    const adherenceRate =
      completed.length > 0 ? Math.round((takenCount / completed.length) * 100) : 0;
    return { completed, takenCount, adherenceRate };
  }, [records]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PAGE }}>
        <ActivityIndicator color={BRAND} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: PAGE }}>
      <SubscriberSubpageHeader title="Back" titleWeight="400" color={BACK_LABEL} />

      <ScrollView
        style={{ flex: 1, backgroundColor: PAGE }}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PAD,
          paddingTop: CARD_GAP,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: BRAND,
            borderRadius: CARD_RADIUS,
            paddingVertical: 28,
            paddingHorizontal: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 56, fontWeight: '500', lineHeight: 62 }}>
            {adherenceRate}%
          </Text>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', marginTop: 8 }}>
            Overall Adherence Rate
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, fontWeight: '400', marginTop: 6 }}>
            {takenCount} of {completed.length} doses taken
          </Text>
        </View>

        <Text style={{ fontSize: 17, fontWeight: '500', color: INK, marginBottom: 10 }}>Dose History</Text>

        {completed.length === 0 ? (
          <Text style={{ color: MUTED, fontSize: 14 }}>No history yet.</Text>
        ) : (
          completed.map((r) => {
            const isTaken = r.status === 'taken';
            const d = new Date(r.scheduledAt);
            return (
              <View
                key={r.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: CARD_RADIUS,
                  padding: 16,
                  marginBottom: CARD_GAP,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isTaken ? TAKEN_ICON_BG : MISSED_ICON_BG,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  <Ionicons
                    name={isTaken ? 'checkmark' : 'close'}
                    size={20}
                    color={isTaken ? TAKEN_ICON : MISSED_ICON}
                  />
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: MUTED, marginBottom: 4 }}>
                    {r.drugName}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: INK, lineHeight: 20 }}>
                    {fmtDate(d, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>
                    Scheduled: {fmtTime(d)}
                  </Text>
                  {isTaken && r.takenAt ? (
                    <Text style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
                      Taken: {fmtTime(new Date(r.takenAt))}
                    </Text>
                  ) : null}
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 999,
                      backgroundColor: isTaken ? TAKEN_BADGE_BG : MISSED_BADGE_BG,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: isTaken ? TAKEN_BADGE_TEXT : MISSED_BADGE_TEXT,
                      }}
                    >
                      {isTaken ? 'Dose Taken' : 'Dose Missed'}
                    </Text>
                  </View>
                </View>

                {isTaken && r.videoId ? (
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#93c5fd',
                      flexShrink: 0,
                    }}
                  >
                    <Ionicons name="videocam-outline" size={14} color={BRAND} />
                    <Text style={{ fontSize: 13, color: BRAND, fontWeight: '500' }}>Video</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
