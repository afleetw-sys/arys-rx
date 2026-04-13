import { BrandLogo } from '../../components/BrandLogo';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

const BRAND = '#006aff';

// ─── Focused input container ──────────────────────────────────────────────────

interface FocusInputProps extends TextInputProps {
  label: string;
}

function FocusInput({ label, style, ...props }: FocusInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={{
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? BRAND : '#e9edf2',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 11,
        paddingBottom: 11,
        backgroundColor: '#f8fafc',
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.6,
          color: focused ? BRAND : '#94a3b8',
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <TextInput
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor="#cbd5e1"
        style={[{ color: '#0f172a', fontSize: 15 }, style]}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Dark header */}
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}
        >
          <View style={{ marginBottom: 18 }}>
            <BrandLogo size={64} />
          </View>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '500', letterSpacing: -0.5 }}>
            Welcome back
          </Text>
          <Text style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
            Sign in to your arys·rx account
          </Text>
        </View>

        {/* White card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 28,
            paddingBottom: 48,
            gap: 12,
          }}
        >
          <FocusInput
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FocusInput
            label="PASSWORD"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Pressable
            onPress={() => router.replace('/onboarding')}
            style={{
              backgroundColor: BRAND,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Sign in</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 4 }}>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>Don't have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={{ color: BRAND, fontSize: 14, fontWeight: '500' }}>Create one</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
