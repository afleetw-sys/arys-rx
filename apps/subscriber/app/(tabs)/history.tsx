import { getAllAdherenceHistory } from '../../lib/api';
import { Card } from '@arys-rx/ui';
import type { AdherenceRecord } from '@arys-rx/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';

const STATUS_COLOR: Record<string, string> = {
  taken: '#22c55e',
  missed: '#ef4444',
  pending: '#f59e0b',
};

function StatusPill({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? '#94a3b8';
  return (
    <View
      style={{
        backgroundColor: color + '22',
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
        {status}
      </Text>
    </View>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: color ?? '#0f172a', marginBottom: 2 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '500' }}>{label}</Text>
    </View>
  );
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
  const taken = completed.filter((r) => r.status === 'taken').length;
  const missed = completed.filter((r) => r.status === 'missed').length;
  const adherenceRate = completed.length > 0 ? Math.round((taken / completed.length) * 100) : 0;

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator color="#0284c7" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <FlatList
        data={completed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 32,
          gap: 12,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: 8 }}>
            {/* Stats card */}
            <View
              style={{
                backgroundColor: '#0f172a',
                borderRadius: 24,
                padding: 22,
                flexDirection: 'row',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 6,
                marginBottom: 20,
              }}
            >
              <StatBox value={`${adherenceRate}%`} label="Adherence" color="#7dd3fc" />
              <View style={{ width: 1, backgroundColor: '#1e293b', marginVertical: 4 }} />
              <StatBox value={String(taken)} label="Taken" color="#86efac" />
              <View style={{ width: 1, backgroundColor: '#1e293b', marginVertical: 4 }} />
              <StatBox value={String(missed)} label="Missed" color="#fca5a5" />
            </View>

            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 }}>
              All Records
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: STATUS_COLOR[item.status] ?? '#94a3b8',
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#0f172a' }}>
                    {item.drugName}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                    {new Date(item.scheduledAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {item.takenAt &&
                      ` · ${new Date(item.takenAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`}
                  </Text>
                  {item.videoId && (
                    <Text style={{ fontSize: 12, color: '#0284c7', marginTop: 4 }}>
                      Video recorded
                    </Text>
                  )}
                </View>
              </View>
              <StatusPill status={item.status} />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 32, fontSize: 14 }}>
            No history yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
