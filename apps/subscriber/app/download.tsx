import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';

const IOS_BLUE = '#0a84ff';

function KeyRow({
  keys,
  wide = [],
  padded = false,
}: {
  keys: string[];
  wide?: string[];
  padded?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 10,
        paddingHorizontal: padded ? 20 : 4,
      }}
    >
      {keys.map((k) => (
        <View
          key={k}
          style={{
            flex: wide.includes(k) ? 1.6 : 1,
            height: 42,
            backgroundColor: wide.includes(k) ? '#3a3a3c' : '#4a4a4e',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 0,
            elevation: 2,
          }}
        >
          <Text style={{ color: '#fff', fontSize: k.length > 1 ? 13 : 17, fontWeight: '400' }}>
            {k}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function DownloadScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Status bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 4,
          paddingBottom: 6,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>10:19</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Signal bars */}
          <View style={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
            {[7, 10, 13, 16].map((h, i) => (
              <View
                key={i}
                style={{
                  width: 3,
                  height: h,
                  backgroundColor: i < 3 ? '#fff' : '#555',
                  borderRadius: 1,
                }}
              />
            ))}
          </View>
          {/* Wi-Fi */}
          <Text style={{ color: '#fff', fontSize: 12 }}>WiFi</Text>
          {/* Battery */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <View
              style={{
                width: 22,
                height: 11,
                borderRadius: 3,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
                padding: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#34c759',
                  borderRadius: 1.5,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Messages nav header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingBottom: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: '#2c2c2e',
        }}
      >
        {/* Back chevron */}
        <Text style={{ color: IOS_BLUE, fontSize: 28, lineHeight: 32, paddingRight: 4 }}>‹</Text>

        {/* Centered contact */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#48484a',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 3,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Rx</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>27979</Text>
            <Text style={{ color: IOS_BLUE, fontSize: 13 }}>›</Text>
          </View>
        </View>

        {/* Spacer matches chevron width */}
        <View style={{ width: 32 }} />
      </View>

      {/* Message thread */}
      <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 14, gap: 6 }}>
        {/* Timestamp */}
        <Text style={{ color: '#636366', fontSize: 11, textAlign: 'center', marginBottom: 6 }}>
          Today 9:14 AM
        </Text>

        {/* SMS bubble */}
        <View
          style={{
            backgroundColor: '#1c1c1e',
            borderRadius: 18,
            borderBottomLeftRadius: 4,
            padding: 14,
            maxWidth: '85%',
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: '#e5e5e7', fontSize: 15, lineHeight: 22 }}>
            Hi Jane! 👋{'\n\n'}Your employer has enrolled you in the{' '}
            <Text style={{ fontWeight: '700', color: '#fff' }}>arys·rx</Text> specialty
            medication adherence program.{'\n\n'}Tap the link below to download the app and
            complete your enrollment:{'\n'}
            <Text
              style={{ color: IOS_BLUE, textDecorationLine: 'underline' }}
              onPress={() => router.push('/(auth)/sign-in')}
            >
              arys-rx.app/join/k9x2m
            </Text>
            {'\n\n'}Questions? Contact your HR team or call{' '}
            <Text style={{ color: IOS_BLUE }}>1-800-ARYS-RX</Text>
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
          backgroundColor: '#000',
        }}
      >
        <Text style={{ color: IOS_BLUE, fontSize: 26, lineHeight: 30 }}>+</Text>
        <View
          style={{
            flex: 1,
            backgroundColor: '#1c1c1e',
            borderRadius: 20,
            borderWidth: 0.5,
            borderColor: '#3a3a3c',
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: '#48484a', fontSize: 15 }}>Text Message · SMS</Text>
        </View>
        <Text style={{ color: '#636366', fontSize: 22 }}>🎤</Text>
      </View>

      {/* Keyboard */}
      <View style={{ backgroundColor: '#1c1c1e', paddingTop: 10 }}>
        <KeyRow keys={['Q','W','E','R','T','Y','U','I','O','P']} />
        <KeyRow keys={['A','S','D','F','G','H','J','K','L']} padded />
        <KeyRow keys={['⇧','Z','X','C','V','B','N','M','⌫']} wide={['⇧','⌫']} />
        {/* Space bar row */}
        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            paddingHorizontal: 4,
            paddingBottom: 6,
          }}
        >
          {[
            { label: '123', flex: 1.5 },
            { label: '🌐', flex: 1.5 },
            { label: 'space', flex: 5 },
            { label: 'return', flex: 2 },
          ].map((k) => (
            <View
              key={k.label}
              style={{
                flex: k.flex,
                height: 42,
                borderRadius: 5,
                backgroundColor: k.label === 'space' ? '#4a4a4e' : '#3a3a3c',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14 }}>{k.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
