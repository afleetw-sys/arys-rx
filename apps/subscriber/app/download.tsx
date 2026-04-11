import { router } from 'expo-router';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

const BRAND = '#006aff';

export default function DownloadScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: 32, paddingBottom: 36 }}>

        {/* Heading */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' }}>
            How it starts
          </Text>
          <Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
            Members receive a text invitation{'\n'}to download and enroll.
          </Text>
        </View>

        {/* iPhone mockup */}
        <View
          style={{
            backgroundColor: '#111',
            borderRadius: 48,
            width: 260,
            paddingTop: 16,
            paddingBottom: 24,
            paddingHorizontal: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 24 },
            shadowOpacity: 0.7,
            shadowRadius: 48,
            elevation: 24,
            borderWidth: 1,
            borderColor: '#2a2a2a',
          }}
        >
          {/* Dynamic Island */}
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <View
              style={{
                width: 96,
                height: 26,
                backgroundColor: '#000',
                borderRadius: 13,
              }}
            />
          </View>

          {/* Screen */}
          <View
            style={{
              backgroundColor: '#f2f2f7',
              borderRadius: 32,
              overflow: 'hidden',
              minHeight: 340,
            }}
          >
            {/* Messages nav bar */}
            <View
              style={{
                backgroundColor: '#f2f2f7',
                paddingTop: 10,
                paddingBottom: 8,
                paddingHorizontal: 14,
                borderBottomWidth: 0.5,
                borderBottomColor: '#c8c8cc',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ color: BRAND, fontSize: 12 }}>‹</Text>
              {/* Contact avatar */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#34c759',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Rx</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#000' }}>arys·rx</Text>
                <Text style={{ fontSize: 9, color: '#8e8e93' }}>Health Plan</Text>
              </View>
            </View>

            {/* Message thread */}
            <View style={{ padding: 12, gap: 8 }}>
              {/* Timestamp */}
              <Text style={{ fontSize: 9, color: '#8e8e93', textAlign: 'center', marginBottom: 2 }}>
                Today 9:14 AM
              </Text>

              {/* SMS bubble */}
              <View
                style={{
                  backgroundColor: '#e9e9eb',
                  borderRadius: 16,
                  borderBottomLeftRadius: 4,
                  padding: 10,
                  maxWidth: '88%',
                  alignSelf: 'flex-start',
                }}
              >
                <Text style={{ fontSize: 11, color: '#000', lineHeight: 16 }}>
                  Hi Jane 👋{'\n\n'}
                  You've been enrolled in the{' '}
                  <Text style={{ fontWeight: '700' }}>arys·rx</Text> medication adherence
                  program by your health plan.{'\n\n'}
                  Download the app to start recording your doses:{'\n'}
                  <Text style={{ color: BRAND }}>arys-rx.app/get</Text>
                </Text>
              </View>

              {/* Delivered */}
              <Text style={{ fontSize: 9, color: '#8e8e93', alignSelf: 'flex-start', marginLeft: 4 }}>
                Delivered
              </Text>
            </View>
          </View>

          {/* Home indicator */}
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <View
              style={{
                width: 100,
                height: 4,
                backgroundColor: '#333',
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        {/* CTA */}
        <View style={{ width: '100%', gap: 14 }}>
          <Pressable
            onPress={() => router.replace('/onboarding')}
            style={{
              backgroundColor: BRAND,
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              shadowColor: BRAND,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
              Continue to Setup →
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={{ alignItems: 'center', paddingVertical: 6 }}>
            <Text style={{ color: '#475569', fontSize: 14 }}>Go back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
