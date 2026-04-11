import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

const BRAND = '#006aff';

// TODO: Replace with real user from Clerk
const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  memberId: 'MBR-10042',
  enrolledAt: '2024-01-15',
  drug: 'Humira',
  dosage: '40mg/0.8mL',
  frequency: 'Every 2 weeks',
  doseTime: '8:00 AM',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
      }}
    >
      <Text style={{ color: '#64748b', fontSize: 14 }}>{label}</Text>
      <Text style={{ color: '#0f172a', fontSize: 14, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const initials = `${MOCK_USER.firstName[0]}${MOCK_USER.lastName[0]}`;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48, gap: 20 }}
    >
      {/* Avatar */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: BRAND,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: BRAND,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>{initials}</Text>
        </View>
        <Text style={{ fontSize: 19, fontWeight: '800', color: '#0f172a' }}>
          {MOCK_USER.firstName} {MOCK_USER.lastName}
        </Text>
        <Text style={{ fontSize: 14, color: '#94a3b8' }}>{MOCK_USER.email}</Text>
      </View>

      {/* Account info */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          paddingHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase', paddingTop: 14, paddingBottom: 4 }}>
          Account
        </Text>
        <Row label="Member ID" value={MOCK_USER.memberId} />
        <Row label="Enrolled since" value={MOCK_USER.enrolledAt} />
      </View>

      {/* Medication schedule */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          paddingHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase', paddingTop: 14, paddingBottom: 4 }}>
          Medication Schedule
        </Text>
        <Row label="Medication" value={`${MOCK_USER.drug} ${MOCK_USER.dosage}`} />
        <Row label="Frequency" value={MOCK_USER.frequency} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 13,
          }}
        >
          <Text style={{ color: '#64748b', fontSize: 14 }}>Dose time</Text>
          <Text style={{ color: '#0f172a', fontSize: 14, fontWeight: '600' }}>{MOCK_USER.doseTime}</Text>
        </View>
      </View>

      {/* Update schedule */}
      <Pressable
        onPress={() => router.push('/onboarding')}
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#0f172a' }}>
          Update medication schedule
        </Text>
        <Text style={{ fontSize: 18, color: BRAND }}>→</Text>
      </Pressable>

      {/* Sign out */}
      <Pressable
        onPress={() => router.replace('/(auth)/sign-in')}
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#fecdd3',
          padding: 16,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#dc2626' }}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}
