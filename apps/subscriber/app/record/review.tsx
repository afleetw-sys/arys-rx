import { BRAND, INK, PAGE } from '../../lib/subscriberTheme';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function ReviewScreen() {
  useEffect(() => {
    router.replace('/record/camera');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: PAGE }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <ActivityIndicator color={BRAND} size="small" />
        <Text style={{ color: INK, fontSize: 14 }}>Returning to recording...</Text>
      </View>
    </View>
  );
}
