import { Stack } from 'expo-router';

export default function RecordLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'fullScreenModal',
      }}
    >
      <Stack.Screen name="camera" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
