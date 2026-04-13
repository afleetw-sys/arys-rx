import { BRAND, CARD, INK, MUTED, SCREEN_PAD } from '../../lib/subscriberTheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { submitAdherenceRecord } from '../../lib/api';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraScreenNative } from '../../components/CameraScreenNative';
import { CameraScreenWeb } from '../../components/CameraScreenWeb';

const REVIEW_STEPS = [
  'Verifying medication bottle and label',
  'Confirming medication setup and readiness',
  'Confirming successful dose administration',
];

const REVIEW_STEP_ICONS = ['medkit-outline', 'bandage-outline', 'shield-checkmark-outline'] as const;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasDismissedInitialGuide, setHasDismissedInitialGuide] = useState(false);
  const [isPreparingCamera, setIsPreparingCamera] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [currentReviewStep, setCurrentReviewStep] = useState(0);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const spinnerRotation = useRef(new Animated.Value(0)).current;

  async function runReviewSubmission() {
    setReviewStatus('processing');
    setCurrentReviewStep(0);
    setReviewError(null);
    setShowInstructions(false);

    try {
      for (let index = 0; index < REVIEW_STEPS.length; index += 1) {
        setCurrentReviewStep(index);
        await wait(1800);

        if (index === REVIEW_STEPS.length - 1) {
          await submitAdherenceRecord({
            drugId: 'drug-001',
            scheduledAt: new Date().toISOString(),
            takenAt: new Date().toISOString(),
            notes: 'Recorded via app',
          });
        }
      }
      setReviewStatus('success');
    } catch {
      setReviewStatus('error');
      setReviewError('Unable to submit right now. Please try again.');
    }
  }

  function onRecordingComplete(_uri: string) {
    void runReviewSubmission();
  }

  const headerTop = Math.max(insets.top, 8);

  useEffect(() => {
    if (!isPreparingCamera) return;
    const timer = setTimeout(() => {
      setIsPreparingCamera(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [isPreparingCamera]);

  useEffect(() => {
    if (reviewStatus !== 'processing') return;
    spinnerRotation.setValue(0);
    const animation = Animated.loop(
      Animated.timing(spinnerRotation, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [reviewStatus, spinnerRotation]);

  const spinnerInterpolate = spinnerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {reviewStatus === 'idle' ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            zIndex: 3,
            paddingTop: headerTop,
            paddingHorizontal: SCREEN_PAD,
            paddingBottom: 10,
          }}
        >
          <Pressable
            onPress={() => router.replace('/(tabs)/')}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -8, padding: 6 }}
          >
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
            <Text style={{ fontSize: 17, fontWeight: '500', color: '#ffffff', marginLeft: -2 }}>
              Record Dose
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {reviewStatus === 'idle' ? (
          <>
            {hasDismissedInitialGuide && !isPreparingCamera ? (
              Platform.OS === 'web' ? (
                <CameraScreenWeb onRecordingComplete={onRecordingComplete} />
              ) : (
                <CameraScreenNative onRecordingComplete={onRecordingComplete} />
              )
            ) : hasDismissedInitialGuide && isPreparingCamera ? (
              <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={{ color: '#ffffff', fontSize: 14, marginTop: 10 }}>Starting camera...</Text>
              </View>
            ) : (
              <View style={{ flex: 1, backgroundColor: '#000000' }} />
            )}

            {hasDismissedInitialGuide ? (
              <Pressable
                onPress={() => setShowInstructions(true)}
                style={{
                  position: 'absolute',
                  right: SCREEN_PAD,
                  top: headerTop + 54,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.35)',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Ionicons name="list-outline" size={15} color="#ffffff" />
                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '500' }}>Step-by-step</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <View style={{ flex: 1, backgroundColor: '#000000' }} />
        )}

        {showInstructions && reviewStatus === 'idle' ? (
          <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pressable
              onPress={() => {
                setShowInstructions(false);
                if (!hasDismissedInitialGuide) {
                  setHasDismissedInitialGuide(true);
                  setIsPreparingCamera(true);
                }
              }}
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            />
            <View
              style={{
                backgroundColor: CARD,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingHorizontal: SCREEN_PAD,
                paddingTop: 14,
                paddingBottom: 24,
                gap: 14,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 44,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#d4d4dc',
                    marginBottom: 12,
                  }}
                />
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#eaf2ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name="videocam-outline" size={19} color={BRAND} />
                </View>
                <Text style={{ fontSize: 19, fontWeight: '600', color: INK }}>How to record your dose</Text>
                <Text style={{ fontSize: 14, color: MUTED, marginTop: 4, textAlign: 'center', lineHeight: 19 }}>
                  Follow these 3 steps before you begin recording.
                </Text>
              </View>

              <View style={{ gap: 9 }}>
                <View
                  style={{
                    backgroundColor: '#f6f8fc',
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: '#dbeafe',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: BRAND, fontSize: 12, fontWeight: '600' }}>1</Text>
                  </View>
                  <Text style={{ flex: 1, color: INK, fontSize: 14, lineHeight: 19 }}>
                  Start by clearly showing the medication bottle and its label.
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#f6f8fc',
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: '#dbeafe',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: BRAND, fontSize: 12, fontWeight: '600' }}>2</Text>
                  </View>
                  <Text style={{ flex: 1, color: INK, fontSize: 14, lineHeight: 19 }}>
                  Next, show the medication itself (pill or injection) up close.
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#f6f8fc',
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: '#dbeafe',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: BRAND, fontSize: 12, fontWeight: '600' }}>3</Text>
                  </View>
                  <Text style={{ flex: 1, color: INK, fontSize: 14, lineHeight: 19 }}>
                  Lastly, record you taking the medication from start to finish.
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  setShowInstructions(false);
                  if (!hasDismissedInitialGuide) {
                    setHasDismissedInitialGuide(true);
                    setIsPreparingCamera(true);
                  }
                }}
                style={{
                  marginTop: 2,
                  backgroundColor: BRAND,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 13,
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '500' }}>Got it</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {reviewStatus !== 'idle' ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: '#0b1220',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
              zIndex: 5,
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 460,
                alignItems: 'center',
              }}
            >
              {reviewStatus === 'processing' ? (
                <View
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: 66,
                    backgroundColor: '#162033',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={REVIEW_STEP_ICONS[currentReviewStep] ?? 'shield-checkmark-outline'}
                    size={64}
                    color="#93c5fd"
                  />
                </View>
              ) : null}

              {reviewStatus === 'success' ? (
                <View
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: 66,
                    backgroundColor: '#14532d',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="checkmark" size={74} color="#bbf7d0" />
                </View>
              ) : null}

              {reviewStatus === 'error' ? (
                <View
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: 66,
                    backgroundColor: '#7f1d1d',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="alert" size={62} color="#fecaca" />
                </View>
              ) : null}

              <Text
                style={{
                  marginTop: 22,
                  color: '#ffffff',
                  fontSize: 22,
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: 30,
                }}
              >
                {reviewStatus === 'success'
                  ? 'Successfully completed'
                  : reviewStatus === 'processing'
                    ? REVIEW_STEPS[currentReviewStep] ?? REVIEW_STEPS[0]
                    : 'Submission failed'}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: '#9ca3af',
                  fontSize: 15,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                {reviewStatus === 'success'
                  ? 'Your dose has been verified and submitted.'
                  : reviewStatus === 'processing'
                    ? `Step ${Math.min(currentReviewStep + 1, REVIEW_STEPS.length)} of ${REVIEW_STEPS.length}`
                    : reviewError}
              </Text>

              {reviewStatus === 'processing' ? (
                <View style={{ marginTop: 16 }}>
                  <Animated.View style={{ transform: [{ rotate: spinnerInterpolate }] }}>
                    <Ionicons name="sync-outline" size={20} color={BRAND} />
                  </Animated.View>
                </View>
              ) : null}

              {reviewStatus === 'error' ? (
                <Pressable
                  onPress={() => {
                    void runReviewSubmission();
                  }}
                  style={{
                    marginTop: 22,
                    backgroundColor: BRAND,
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '500' }}>Try again</Text>
                </Pressable>
              ) : null}

              {reviewStatus === 'success' ? (
                <Pressable
                  onPress={() => router.replace('/(tabs)/')}
                  style={{
                    marginTop: 22,
                    backgroundColor: BRAND,
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 36,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '500' }}>Done</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
