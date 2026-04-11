import { router } from 'expo-router';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

const BRAND = '#006aff';
const IOS_BLUE = '#0a84ff';

// Simulated keyboard row
function KeyRow({ keys, wide }: { keys: string[]; wide?: string[] }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 9 }}>
      {keys.map((k) => {
        const isWide = wide?.includes(k);
        return (
          <View
            key={k}
            style={{
              backgroundColor: isWide ? '#3a3a3c' : '#4a4a4e',
              borderRadius: 5,
              minWidth: isWide ? 44 : 30,
              height: 42,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 0,
              elevation: 2,
            }}
          >
            <Text style={{ color: '#fff', fontSize: k.length > 1 ? 12 : 16, fontWeight: '400' }}>
              {k}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function DownloadScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ flex: 1, paddingTop: 12, paddingBottom: 0 }}>
        {/* Brief heading */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.6 }}>
            HOW MEMBERS GET STARTED
          </Text>
        </View>

        {/* iPhone screen mockup */}
        <View
          style={{
            flex: 1,
            marginHorizontal: 12,
            borderRadius: 28,
            overflow: 'hidden',
            backgroundColor: '#000',
            borderWidth: 1,
            borderColor: '#2a2a2a',
          }}
        >
          {/* Status bar */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 6,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>10:19</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {/* Signal dots */}
              <View style={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
                {[7, 10, 13, 16].map((h, i) => (
                  <View
                    key={i}
                    style={{ width: 3, height: h, backgroundColor: i < 3 ? '#fff' : '#555', borderRadius: 1 }}
                  />
                ))}
              </View>
              {/* WiFi */}
              <Text style={{ color: '#fff', fontSize: 14 }}>▲</Text>
              {/* Battery */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 3,
                  paddingHorizontal: 2,
                  paddingVertical: 1,
                  gap: 1,
                }}
              >
                <View style={{ width: 18, height: 10, backgroundColor: '#34c759', borderRadius: 1 }} />
                <View style={{ width: 2, height: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
              </View>
            </View>
          </View>

          {/* Messages nav header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingBottom: 8,
              borderBottomWidth: 0.5,
              borderBottomColor: '#2c2c2e',
            }}
          >
            {/* Back */}
            <Text style={{ color: IOS_BLUE, fontSize: 24, lineHeight: 28, marginRight: 4 }}>‹</Text>

            {/* Contact info — centered */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#636366',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15 }}>Rx</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>27979</Text>
                <Text style={{ color: IOS_BLUE, fontSize: 12 }}>›</Text>
              </View>
            </View>

            {/* Video icon placeholder */}
            <View style={{ width: 32 }} />
          </View>

          {/* Message thread */}
          <View style={{ flex: 1, padding: 14, gap: 6 }}>
            {/* Timestamp */}
            <Text style={{ color: '#636366', fontSize: 11, textAlign: 'center', marginBottom: 4 }}>
              Today 9:14 AM
            </Text>

            {/* SMS bubble */}
            <View
              style={{
                backgroundColor: '#1c1c1e',
                borderRadius: 18,
                borderBottomLeftRadius: 5,
                padding: 12,
                maxWidth: '88%',
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ color: '#e5e5e7', fontSize: 14, lineHeight: 20 }}>
                Hi Jane! Your employer has requested you download the{' '}
                <Text style={{ fontWeight: '700', color: '#fff' }}>arys·rx</Text> app to
                support your specialty medication adherence program.{'\n\n'}
                Tap the link below to get started:{'\n'}
                <Text
                  style={{ color: IOS_BLUE, textDecorationLine: 'underline' }}
                  onPress={() => router.push('/(auth)/sign-in')}
                >
                  arys-rx.app/join/k9x2m
                </Text>
              </Text>
            </View>

            {/* Delivered */}
            <Text style={{ color: '#636366', fontSize: 11, marginLeft: 4 }}>Delivered</Text>
          </View>

          {/* Compose bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderTopWidth: 0.5,
              borderTopColor: '#2c2c2e',
              gap: 8,
            }}
          >
            <Text style={{ color: IOS_BLUE, fontSize: 24, lineHeight: 28 }}>+</Text>
            <View
              style={{
                flex: 1,
                backgroundColor: '#1c1c1e',
                borderRadius: 18,
                borderWidth: 0.5,
                borderColor: '#3a3a3c',
                paddingHorizontal: 14,
                paddingVertical: 9,
              }}
            >
              <Text style={{ color: '#4a4a4e', fontSize: 15 }}>Text Message · SMS</Text>
            </View>
            <Text style={{ color: '#636366', fontSize: 20 }}>🎤</Text>
          </View>

          {/* Keyboard */}
          <View style={{ backgroundColor: '#1c1c1e', paddingTop: 10, paddingHorizontal: 4 }}>
            <KeyRow keys={['Q','W','E','R','T','Y','U','I','O','P']} />
            <KeyRow keys={['A','S','D','F','G','H','J','K','L']} />
            <KeyRow keys={['⇧','Z','X','C','V','B','N','M','⌫']} wide={['⇧','⌫']} />
            {/* Spacebar row */}
            <View style={{ flexDirection: 'row', gap: 5, paddingHorizontal: 2, paddingBottom: 12 }}>
              {[{ label: '123', w: 42 }, { label: '🌐', w: 42 }, { label: 'space', flex: 1 }, { label: 'return', w: 78 }].map((k) => (
                <View
                  key={k.label}
                  style={{
                    width: k.w,
                    flex: (k as { flex?: number }).flex,
                    height: 42,
                    borderRadius: 5,
                    backgroundColor: k.label === 'space' ? '#4a4a4e' : '#3a3a3c',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: k.label === 'space' ? 14 : 13 }}>
                    {k.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CTA below mockup */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Pressable
            onPress={() => router.push('/(auth)/sign-in')}
            style={{
              backgroundColor: BRAND,
              borderRadius: 14,
              paddingVertical: 15,
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
        </View>
      </View>
    </SafeAreaView>
  );
}
