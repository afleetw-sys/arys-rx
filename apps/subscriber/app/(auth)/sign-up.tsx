import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '@arys-rx/ui';

export default function SignUpScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 }}>
            Create account
          </Text>
          <Text style={{ color: '#64748b', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            {/* TODO: Replace with Clerk SignUp component */}
            Sign-up form coming soon.
          </Text>
        </View>

        <View style={{ width: '100%' }}>
          <Button
            label="Back to sign in"
            onPress={() => router.back()}
            variant="ghost"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
