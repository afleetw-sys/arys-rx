import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '@arys-rx/ui';

export default function SignUpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6 gap-6">
        <Text className="text-2xl font-bold text-neutral-900">Create account</Text>
        <Text className="text-neutral-500 text-center">
          {/* TODO: Replace with Clerk SignUp component */}
          Sign-up form coming soon.
        </Text>
        <Button
          label="Back to sign in"
          onPress={() => router.back()}
          variant="ghost"
        />
      </View>
    </SafeAreaView>
  );
}
