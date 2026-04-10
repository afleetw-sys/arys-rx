import { Stack } from 'expo-router';

export default function RecordLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        presentation: 'fullScreenModal',
      }}
    >
      <Stack.Screen name="camera" options={{ title: 'Record Dose' }} />
      <Stack.Screen name="review" options={{ title: 'Review & Submit' }} />
    </Stack>
  );
}
