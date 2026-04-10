import { Button, Card } from '@arys-rx/ui';
import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';

// TODO: Replace with real user from Clerk
const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  memberId: 'MBR-10042',
  enrolledAt: '2024-01-15',
};

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
      }}
    >
      <Text style={{ color: '#94a3b8', fontSize: 14 }}>{label}</Text>
      <Text style={{ color: '#0f172a', fontSize: 14, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const initials = `${MOCK_USER.firstName[0]}${MOCK_USER.lastName[0]}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 20 }}>
        {/* Avatar block */}
        <View style={{ alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#0f172a',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text style={{ color: '#7dd3fc', fontSize: 26, fontWeight: '800' }}>{initials}</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>
            {MOCK_USER.firstName} {MOCK_USER.lastName}
          </Text>
          <Text style={{ fontSize: 14, color: '#94a3b8' }}>{MOCK_USER.email}</Text>
        </View>

        {/* Details card */}
        <Card>
          <View style={{ gap: 14 }}>
            <ProfileRow label="Member ID" value={MOCK_USER.memberId} />
            <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />
            <ProfileRow label="Enrolled since" value={MOCK_USER.enrolledAt} />
          </View>
        </Card>

        {/* Sign out */}
        <Button
          label="Sign out"
          onPress={() => router.replace('/(auth)/sign-in')}
          variant="secondary"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
