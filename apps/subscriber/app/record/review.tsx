import Ionicons from '@expo/vector-icons/Ionicons';
import { submitAdherenceRecord } from '../../lib/api';
import { Button, Card } from '@arys-rx/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28, gap: 16 }}>
        {/* Video preview area */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#1e293b',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Ionicons name="film-outline" size={48} color="#64748b" />
          <Text style={{ color: '#64748b', fontSize: 15, fontWeight: '500' }}>
            {uri ? 'Recording ready' : 'No recording'}
          </Text>
          {uri ? (
            <Text
              style={{ color: '#334155', fontSize: 11, paddingHorizontal: 32, textAlign: 'center' }}
              numberOfLines={2}
            >
              {uri}
            </Text>
          ) : null}
        </View>

        {/* Drug info card */}
        <Card>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#94a3b8', marginBottom: 6 }}>
            Submitting for
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#0f172a', marginBottom: 2 }}>
            Humira
          </Text>
          <Text style={{ fontSize: 14, color: '#94a3b8' }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Card>

        {/* Actions */}
        <View style={{ gap: 12 }}>
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
