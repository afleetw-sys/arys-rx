import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '@arys-rx/ui';

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6 gap-6">
        <View className="items-center gap-2">
          <View className="w-16 h-16 rounded-2xl bg-brand-600 items-center justify-center">
            <Text className="text-white text-2xl font-bold">Rx</Text>
          </View>
          <Text className="text-2xl font-bold text-neutral-900">arys-rx</Text>
          <Text className="text-neutral-500 text-center">
            Medication adherence tracking
          </Text>
        </View>

        <View className="w-full gap-3 mt-4">
          {/* TODO: Replace with Clerk SignIn component */}
          <Button
            label="Sign in (demo)"
            onPress={() => router.replace('/(tabs)/')}
            fullWidth
          />
          <Button
            label="Create account"
            onPress={() => router.push('/(auth)/sign-up')}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
