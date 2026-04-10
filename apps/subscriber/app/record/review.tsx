import { submitAdherenceRecord } from '../../lib/api';
import { Button, Card } from '@arys-rx/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';

export default function ReviewScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitAdherenceRecord({
        drugId: 'drug-001',
        scheduledAt: new Date().toISOString(),
        takenAt: new Date().toISOString(),
        // In a real app: upload video first, pass videoId here
        notes: 'Recorded via app',
      });
      router.replace('/(tabs)/');
    } catch {
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <View className="flex-1 px-4 py-6 gap-4">
        {/* Video preview placeholder */}
        <View className="flex-1 bg-neutral-800 rounded-2xl items-center justify-center">
          <Text className="text-neutral-400 text-4xl mb-2">🎬</Text>
          <Text className="text-neutral-400 text-sm">
            {uri ? 'Recording ready' : 'No recording'}
          </Text>
          {uri ? (
            <Text className="text-neutral-600 text-xs mt-1 px-8 text-center" numberOfLines={2}>
              {uri}
            </Text>
          ) : null}
        </View>

        <Card>
          <Text className="text-sm font-medium text-neutral-700 mb-1">Submitting for</Text>
          <Text className="text-lg font-bold text-neutral-900">Humira</Text>
          <Text className="text-neutral-500 text-sm">{new Date().toLocaleDateString()}</Text>
        </Card>

        <View className="gap-3">
          <Button
            label={submitting ? 'Submitting…' : 'Submit Adherence Record'}
            onPress={handleSubmit}
            disabled={submitting}
            fullWidth
          />
          <Button
            label="Retake"
            onPress={() => router.back()}
            variant="secondary"
            disabled={submitting}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
