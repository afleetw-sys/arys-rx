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

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="px-4 py-6 gap-4">
        {/* Avatar */}
        <View className="items-center gap-2 mb-2">
          <View className="w-20 h-20 rounded-full bg-brand-100 items-center justify-center">
            <Text className="text-3xl font-bold text-brand-600">
              {MOCK_USER.firstName[0]}{MOCK_USER.lastName[0]}
            </Text>
          </View>
          <Text className="text-xl font-bold text-neutral-900">
            {MOCK_USER.firstName} {MOCK_USER.lastName}
          </Text>
          <Text className="text-neutral-500">{MOCK_USER.email}</Text>
        </View>

        {/* Details */}
        <Card>
          <View className="gap-3">
            <ProfileRow label="Member ID" value={MOCK_USER.memberId} />
            <ProfileRow label="Enrolled since" value={MOCK_USER.enrolledAt} />
          </View>
        </Card>

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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-neutral-500 text-sm">{label}</Text>
      <Text className="text-neutral-800 font-medium text-sm">{value}</Text>
    </View>
  );
}
