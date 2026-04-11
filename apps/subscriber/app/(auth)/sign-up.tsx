import { router } from 'expo-router';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

const BRAND = '#006aff';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Dark header */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 32,
          paddingBottom: 28,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>
          Create account
        </Text>
        <Text style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
          Join arys·rx and start tracking your doses
        </Text>
      </View>

      {/* White card */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: 24,
          paddingBottom: 40,
          gap: 12,
        }}
      >
        {/* Name row */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: '#f8fafc',
            }}
          >
            <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600', marginBottom: 3 }}>
              FIRST NAME
            </Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Jane"
              placeholderTextColor="#cbd5e1"
              style={{ color: '#0f172a', fontSize: 15 }}
              autoCapitalize="words"
            />
          </View>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: '#f8fafc',
            }}
          >
            <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600', marginBottom: 3 }}>
              LAST NAME
            </Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
              placeholderTextColor="#cbd5e1"
              style={{ color: '#0f172a', fontSize: 15 }}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email */}
        <View
          style={{
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#f8fafc',
          }}
        >
          <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600', marginBottom: 3 }}>
            EMAIL
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#cbd5e1"
            style={{ color: '#0f172a', fontSize: 15 }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password */}
        <View
          style={{
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#f8fafc',
          }}
        >
          <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600', marginBottom: 3 }}>
            PASSWORD
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 characters"
            placeholderTextColor="#cbd5e1"
            style={{ color: '#0f172a', fontSize: 15 }}
            secureTextEntry
          />
        </View>

        {/* Confirm password */}
        <View
          style={{
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#f8fafc',
          }}
        >
          <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600', marginBottom: 3 }}>
            CONFIRM PASSWORD
          </Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat password"
            placeholderTextColor="#cbd5e1"
            style={{ color: '#0f172a', fontSize: 15 }}
            secureTextEntry
          />
        </View>

        {/* Create account CTA */}
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
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Create account</Text>
        </Pressable>

        {/* Switch to sign in */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>Already have an account?</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: BRAND, fontSize: 14, fontWeight: '600' }}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
