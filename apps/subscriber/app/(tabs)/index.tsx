import { getAllAdherenceHistory } from '@/lib/api';
import { AdherenceDot, Button, Card } from '@arys-rx/ui';
import type { AdherenceRecord } from '@arys-rx/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';

export default function TodayScreen() {
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAdherenceHistory()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const nextDose = records.find((r) => r.status === 'pending');
  const recentRecords = records.filter((r) => r.status !== 'pending').slice(0, 3);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator color="#0284c7" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">
        {/* Next dose card */}
        {nextDose ? (
          <Card>
            <Text className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-1">
              Next Dose Due
            </Text>
            <Text className="text-xl font-bold text-neutral-900 mb-1">{nextDose.drugName}</Text>
            <Text className="text-neutral-500 mb-4">
              Scheduled {new Date(nextDose.scheduledAt).toLocaleDateString()}
            </Text>
            <Button
              label="Record Taking Dose"
              onPress={() => router.push('/record/camera')}
              fullWidth
            />
          </Card>
        ) : (
          <Card>
            <View className="items-center py-4 gap-2">
              <Text className="text-4xl">✅</Text>
              <Text className="text-lg font-semibold text-neutral-800">All caught up!</Text>
              <Text className="text-neutral-500 text-center">No doses pending today.</Text>
            </View>
          </Card>
        )}

        {/* Recent activity */}
        <Text className="text-base font-semibold text-neutral-700 mt-2">Recent Activity</Text>
        {recentRecords.length === 0 ? (
          <Text className="text-neutral-400">No history yet.</Text>
        ) : (
          recentRecords.map((r) => (
            <Card key={r.id}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <AdherenceDot status={r.status} size="lg" />
                  <View>
                    <Text className="font-medium text-neutral-800">{r.drugName}</Text>
                    <Text className="text-sm text-neutral-400">
                      {new Date(r.scheduledAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-medium capitalize text-neutral-500">{r.status}</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
