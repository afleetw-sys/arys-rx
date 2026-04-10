import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '@arys-rx/ui';

export default function SignInScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: '#0284c7',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              shadowColor: '#0284c7',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>Rx</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 }}>
            arys·rx
          </Text>
          <Text style={{ color: '#64748b', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            Medication adherence,{'\n'}made simple.
          </Text>
        </View>

        {/* CTAs */}
        <View style={{ width: '100%', gap: 12 }}>
          {/* TODO: Replace with Clerk SignIn component */}
          <Button
            label="Sign in"
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

        {/* Footer note */}
        <Text style={{ color: '#334155', fontSize: 12, marginTop: 32, textAlign: 'center' }}>
          Protected health information is encrypted{'\n'}and stored securely.
        </Text>
      </View>
    </SafeAreaView>
  );
}
