import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { getAllAdherenceHistory } from '../../lib/api';
import type { AdherenceRecord } from '@arys-rx/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BRAND = '#006aff';
const PAGE = '#f5f5fa';
const INK = '#000000';
const MUTED = '#8e8e93';
const BACK_LABEL = '#3c3c43';
const CARD_RADIUS = 16;
const SCREEN_PAD = 20;
const CARD_GAP = 12;

const TAKEN_ICON_BG = '#dcfce7';
const TAKEN_ICON = '#16a34a';
const TAKEN_BADGE_BG = '#dcfce7';
const TAKEN_BADGE_TEXT = '#166534';

const MISSED_ICON_BG = '#fee2e2';
const MISSED_ICON = '#dc2626';
const MISSED_BADGE_BG = '#fee2e2';
const MISSED_BADGE_TEXT = '#b91c1c';

function fmtDate(date: Date, opts: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', opts);
}

function fmtTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAdherenceHistory()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const completed = records.filter((r) => r.status !== 'pending');
  const takenCount = completed.filter((r) => r.status === 'taken').length;
  const adherenceRate =
    completed.length > 0 ? Math.round((takenCount / completed.length) * 100) : 0;

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PAGE }}>
        <ActivityIndicator color={BRAND} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: PAGE }}>
      <View
        style={{
          paddingTop: Math.max(insets.top, 8),
          paddingHorizontal: SCREEN_PAD,
          paddingBottom: 12,
          backgroundColor: PAGE,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -8, padding: 6 }}
        >
          <Ionicons name="chevron-back" size={26} color={BACK_LABEL} />
          <Text style={{ fontSize: 17, fontWeight: '400', color: BACK_LABEL, marginLeft: -4 }}>Back</Text>
        </Pressable>
      </View>

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
