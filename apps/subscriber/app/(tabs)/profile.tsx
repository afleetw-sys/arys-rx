import { SubscriberSubpageHeader } from '../../components/SubscriberSubpageHeader';
import {
  BRAND,
  CARD,
  CARD_GAP,
  CARD_PAD,
  CARD_RADIUS,
  INK,
  MUTED,
  PAGE,
  SCREEN_PAD,
  SUBTLE_GRAY,
} from '../../lib/subscriberTheme';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

// TODO: Replace with real user from Clerk
const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  memberId: 'MBR-10042',
  enrolledAt: '2024-01-15',
};

const MOCK_MEDS = [
  { name: 'Humira', dosage: '40mg/0.8mL', frequency: 'Every 2 weeks', doseTime: '8:00 AM' },
  { name: 'Enbrel', dosage: '50mg/mL', frequency: 'Weekly', doseTime: '9:00 AM' },
];

function CardRow({
  label,
  value,
  showDivider,
}: {
  label: string;
  value: string;
  showDivider?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: SUBTLE_GRAY,
      }}
    >
      <Text style={{ color: MUTED, fontSize: 14 }}>{label}</Text>
      <Text style={{ color: INK, fontSize: 14, fontWeight: '500' }}>{value}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '500',
        color: MUTED,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        paddingTop: 4,
        paddingBottom: 2,
      }}
    >
      {title}
    </Text>
  );
}

export default function ProfileScreen() {
  const initials = `${MOCK_USER.firstName[0]}${MOCK_USER.lastName[0]}`;

  return (
    <View style={{ flex: 1, backgroundColor: PAGE }}>
      <SubscriberSubpageHeader title="Profile" titleWeight="500" color={INK} />
      <ScrollView
        style={{ flex: 1, backgroundColor: PAGE }}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PAD,
          paddingTop: 2,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
      <View
        style={{
          backgroundColor: CARD,
          borderRadius: CARD_RADIUS,
          paddingHorizontal: CARD_PAD,
          paddingTop: 28,
          paddingBottom: 28,
          marginBottom: CARD_GAP,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: BRAND,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: '500' }}>{initials}</Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: INK,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {MOCK_USER.firstName} {MOCK_USER.lastName}
          </Text>
          <Text style={{ fontSize: 14, color: MUTED, marginTop: 6, textAlign: 'center' }}>
            {MOCK_USER.email}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: CARD,
          borderRadius: CARD_RADIUS,
          paddingHorizontal: CARD_PAD,
          paddingTop: 18,
          paddingBottom: 4,
          marginBottom: CARD_GAP,
        }}
      >
        <SectionHeader title="Account" />
        <CardRow label="Member ID" value={MOCK_USER.memberId} showDivider />
        <CardRow label="Enrolled since" value={MOCK_USER.enrolledAt} />
      </View>

      {MOCK_MEDS.map((med, i) => (
        <View
          key={i}
          style={{
            backgroundColor: CARD,
            borderRadius: CARD_RADIUS,
            paddingHorizontal: CARD_PAD,
            paddingTop: 18,
            paddingBottom: 4,
            marginBottom: CARD_GAP,
          }}
        >
          <SectionHeader title={med.name} />
          <CardRow label="Dosage" value={med.dosage} showDivider />
          <CardRow label="Frequency" value={med.frequency} showDivider />
          <CardRow label="Dose time" value={med.doseTime} />
        </View>
      ))}

      <Pressable
        onPress={() => router.replace('/(auth)/sign-in')}
        style={{
          backgroundColor: CARD,
          borderRadius: CARD_RADIUS,
          paddingVertical: 16,
          alignItems: 'center',
          marginBottom: CARD_GAP,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '500', color: '#dc2626' }}>Sign out</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/download')}
        style={{
          backgroundColor: CARD,
          borderRadius: CARD_RADIUS,
          paddingVertical: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '500', color: BRAND }}>Restart prototype</Text>
      </Pressable>
      </ScrollView>
    </View>
  );
}
