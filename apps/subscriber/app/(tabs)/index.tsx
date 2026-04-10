import { getAllAdherenceHistory } from '../../lib/api';
import { Button, Card } from '@arys-rx/ui';
import type { AdherenceRecord } from '@arys-rx/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
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

export default function TodayScreen() {
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAdherenceHistory()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const nextDose = records.find((r) => r.status === 'pending');
  const recentRecords = records.filter((r) => r.status !== 'pending').slice(0, 4);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator color="#0284c7" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 32,
          gap: 16,
        }}
      >
        {/* Date chip */}
        <View>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#e0f2fe',
              borderRadius: 99,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: '#0369a1', fontSize: 13, fontWeight: '500' }}>{dateLabel}</Text>
          </View>
        </View>

        {/* Next dose hero */}
        {nextDose ? (
          <View
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 24,
              padding: 22,
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Text
              style={{
                color: '#7dd3fc',
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Next Dose Due
            </Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 }}>
              {nextDose.drugName}
            </Text>
            <Text style={{ color: '#64748b', fontSize: 14, marginBottom: 22 }}>
              Scheduled{' '}
              {new Date(nextDose.scheduledAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <Button
              label="Record Taking Dose"
              onPress={() => router.push('/record/camera')}
              fullWidth
            />
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 24,
              padding: 28,
              alignItems: 'center',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 10 }}>✅</Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 }}>
              All caught up!
            </Text>
            <Text style={{ color: '#64748b', textAlign: 'center', fontSize: 14 }}>
              No doses pending today.
            </Text>
          </View>
        )}

        {/* Recent activity */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>Recent Activity</Text>

        {recentRecords.length === 0 ? (
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>No history yet.</Text>
        ) : (
          recentRecords.map((r) => (
            <Card key={r.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: STATUS_COLOR[r.status] ?? '#94a3b8',
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#0f172a' }}>
                      {r.drugName}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                      {new Date(r.scheduledAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                <StatusPill status={r.status} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
