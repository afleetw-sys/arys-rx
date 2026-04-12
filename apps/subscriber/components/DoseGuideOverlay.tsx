import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';

const BRAND = '#006aff';

interface StepConfig {
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  accentColor: string;
  bgColor: string;
  number: string;
  title: string;
  description: string;
}

const STEPS: StepConfig[] = [
  {
    number: '1',
    iconName: 'local_pharmacy',
    accentColor: BRAND,
    bgColor: '#eff6ff',
    title: 'Show your bottle',
    description:
      'Hold your medication bottle to the camera so the label is clearly visible.',
  },
  {
    number: '2',
    iconName: 'vaccines',
    accentColor: '#7c3aed',
    bgColor: '#f5f3ff',
    title: 'Show the dose',
    description:
      'Display your auto-injector or pill clearly before taking it.',
  },
  {
    number: '3',
    iconName: 'videocam',
    accentColor: '#16a34a',
    bgColor: '#f0fdf4',
    title: 'Take it & record',
    description:
      'Take your medication while recording. Keep steady and well-lit.',
  },
];

interface Props {
  visible: boolean;
  onStart: () => void;
}

export function DoseGuideOverlay({ visible, onStart }: Props) {
  const slideAnim = useRef(new Animated.Value(480)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible) {
      // Reset
      slideAnim.setValue(480);
      fadeAnim.setValue(0);
      stepAnims.forEach((a) => a.setValue(0));

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Stagger step rows in after card lands
        Animated.stagger(
          90,
          stepAnims.map((a) =>
            Animated.spring(a, {
              toValue: 1,
              damping: 18,
              stiffness: 220,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    }
  }, [visible]);

  function handleStart() {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 480, duration: 200, useNativeDriver: true }),
    ]).start(onStart);
  }

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.82)',
          justifyContent: 'flex-end',
          opacity: fadeAnim,
        }}
      >
        {/* Sheet */}
        <Animated.View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            transform: [{ translateY: slideAnim }],
            overflow: 'hidden',
          }}
        >
          {/* Pull handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 2 }}>
            <View
              style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0' }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: BRAND,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="assignment" size={22} color="#fff" />
            </View>
            <View>
              <Text style={{ fontSize: 19, fontWeight: '800', color: '#0f172a' }}>
                How to record your dose
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                3 quick steps — every time you record
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 20 }} />

          {/* Steps */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 10 }}>
            {STEPS.map((step, index) => (
              <Animated.View
                key={step.number}
                style={{
                  opacity: stepAnims[index],
                  transform: [
                    {
                      translateY: stepAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                  ],
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: step.bgColor,
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    gap: 14,
                  }}
                >
                  {/* Icon circle */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: step.accentColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcons name={step.iconName} size={24} color="#fff" />
                  </View>

                  {/* Text */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          backgroundColor: step.accentColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>
                          {step.number}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f172a' }}>
                        {step.title}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#64748b', lineHeight: 18 }}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* CTA */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 4 }}>
            <Pressable
              onPress={handleStart}
              style={({ pressed }) => ({
                backgroundColor: BRAND,
                borderRadius: 14,
                paddingVertical: 17,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <MaterialIcons name="videocam" size={22} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 }}>
                Start Recording
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
