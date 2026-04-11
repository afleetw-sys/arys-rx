import { Stack } from 'expo-router';

const BRAND = '#006aff';

export default function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="history"
        options={{
          title: 'Dose History',
          headerStyle: { backgroundColor: BRAND },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerStyle: { backgroundColor: BRAND },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        }}
      />
    </Stack>
  );
}
