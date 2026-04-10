import { getAllAdherenceHistory } from '@/lib/api';
import { AdherenceDot, Badge, Card } from '@arys-rx/ui';
import type { AdherenceRecord } from '@arys-rx/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';

function statusBadgeVariant(status: AdherenceRecord['status']) {
  if (status === 'taken') return 'success' as const;
  if (status === 'missed') return 'danger' as const;
  return 'neutral' as const;
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
  const adherenceRate = completed.length > 0 ? Math.round((taken / completed.length) * 100) : 0;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator color="#0284c7" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <FlatList
        data={records.filter((r) => r.status !== 'pending')}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 py-6 gap-3"
        ListHeaderComponent={
          <View className="mb-2">
            <Card>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-brand-600">{adherenceRate}%</Text>
                  <Text className="text-xs text-neutral-500">Adherence rate</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-neutral-800">{taken}</Text>
                  <Text className="text-xs text-neutral-500">Doses taken</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-neutral-800">{completed.length}</Text>
                  <Text className="text-xs text-neutral-500">Total doses</Text>
                </View>
              </View>
            </Card>
          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <AdherenceDot status={item.status} size="lg" />
                <View>
                  <Text className="font-medium text-neutral-800">{item.drugName}</Text>
                  <Text className="text-sm text-neutral-400">
                    {new Date(item.scheduledAt).toLocaleDateString()}
                    {item.takenAt && ` · Taken ${new Date(item.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </Text>
                </View>
              </View>
              <Badge label={item.status} variant={statusBadgeVariant(item.status)} />
            </View>
            {item.videoId && (
              <Text className="text-xs text-brand-600 mt-2">📹 Video recorded</Text>
            )}
          </Card>
        )}
        ListEmptyComponent={
          <Text className="text-neutral-400 text-center mt-8">No history yet.</Text>
        }
      />
    </SafeAreaView>
  );
}
