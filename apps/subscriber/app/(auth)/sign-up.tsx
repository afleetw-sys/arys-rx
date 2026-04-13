import { BrandLogo } from '../../components/BrandLogo';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
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
        style={[
          { color: '#0f172a', fontSize: 15 },
          Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
          style,
        ]}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Dark header */}
        <View style={{ alignItems: 'center', paddingTop: 32, paddingBottom: 28 }}>
          <View style={{ marginBottom: 18 }}>
            <BrandLogo size={64} />
          </View>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '500', letterSpacing: -0.5 }}>
            Create account
          </Text>
          <Text style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
            Join arys·rx and start tracking your doses
          </Text>
        </View>

        {/* White card */}
        <ScrollView
          style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* First + Last name row */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <FocusInput
                label="FIRST NAME"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Jane"
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FocusInput
                label="LAST NAME"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                autoCapitalize="words"
              />
            </View>
          </View>

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
            placeholder="Min. 8 characters"
            secureTextEntry
          />

          <FocusInput
            label="CONFIRM PASSWORD"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat password"
            secureTextEntry
          />

          <Pressable
            onPress={() => router.replace('/onboarding')}
            style={{
              backgroundColor: BRAND,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Create account</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>Already have an account?</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={{ color: BRAND, fontSize: 14, fontWeight: '500' }}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
