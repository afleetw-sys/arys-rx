import { getAllAdherenceHistory } from '../../lib/api';
import type { AdherenceRecord } from '@arys-rx/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const BRAND = '#006aff';

function fmtDate(date: Date, opts: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', opts);
}

function fmtTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HistoryScreen() {
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator color={BRAND} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        gap: 20,
      }}
    >
      {/* Adherence rate card */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          padding: 28,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text style={{ color: BRAND, fontSize: 56, fontWeight: '800', lineHeight: 64 }}>
          {adherenceRate}%
        </Text>
        <Text style={{ color: '#0f172a', fontSize: 15, fontWeight: '500', marginTop: 6 }}>
          Overall Adherence Rate
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
          {takenCount} of {completed.length} doses taken
        </Text>
      </View>

      {/* List header */}
      <Text style={{ fontSize: 17, fontWeight: '700', color: '#0f172a' }}>Dose History</Text>

      {completed.length === 0 ? (
        <Text style={{ color: '#94a3b8', fontSize: 14 }}>No history yet.</Text>
      ) : (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          {completed.map((r, i) => {
            const isTaken = r.status === 'taken';
            const d = new Date(r.scheduledAt);
            return (
              <View
                key={r.id}
                style={{
                  flexDirection: 'row',
                  padding: 16,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: '#f1f5f9',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* Status circle */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isTaken ? '#22c55e' : '#ef4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  <MaterialIcons
                    name={isTaken ? 'check' : 'close'}
                    size={18}
                    color="#fff"
                  />
                </View>

                {/* Details */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 4 }}
                  >
                    {fmtDate(d, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 1 }}>
                    Scheduled: {fmtTime(d)}
                  </Text>
                  {r.takenAt && (
                    <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 5 }}>
                      Taken: {fmtTime(new Date(r.takenAt))}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isTaken ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {isTaken ? 'Dose Taken' : 'Dose Missed'}
                  </Text>
                </View>

                {/* Video link */}
                {r.videoId && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <MaterialIcons name="videocam" size={16} color={BRAND} />
                    <Text style={{ fontSize: 13, color: BRAND, fontWeight: '500' }}>Video</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
