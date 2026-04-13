import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INK, PAGE, SCREEN_PAD } from '../lib/subscriberTheme';

type Props = {
  title: string;
  titleWeight?: '400' | '500';
  color?: string;
};

export function SubscriberSubpageHeader({
  title,
  titleWeight = '500',
  color = INK,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 8),
        paddingHorizontal: SCREEN_PAD,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PAGE,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -8, padding: 6 }}
      >
        <Ionicons name="chevron-back" size={28} color={color} />
        <Text style={{ fontSize: 17, fontWeight: titleWeight, color, marginLeft: -2 }}>{title}</Text>
      </Pressable>
    </View>
  );
}
