import { Button } from '@arys-rx/ui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  onRecordingComplete: (uri: string) => void;
  onReadyForRecording?: () => void;
}

export function CameraScreenNative({ onRecordingComplete, onReadyForRecording }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const cameraRef = useRef<CameraView>(null);
  const readyNotifiedRef = useRef(false);

  useEffect(() => {
    if (!permission?.granted || readyNotifiedRef.current) return;
    readyNotifiedRef.current = true;
    onReadyForRecording?.();
  }, [permission?.granted, onReadyForRecording]);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center gap-4 px-6">
        <Text className="text-white text-center text-base">
          Camera access is needed to record your dose.
        </Text>
        <Button label="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  async function startRecording() {
    if (!cameraRef.current) return;
    setRecording(true);
    const video = await cameraRef.current.recordAsync({ maxDuration: 30 });
    if (video?.uri) {
      onRecordingComplete(video.uri);
    }
  }

  async function stopRecording() {
    cameraRef.current?.stopRecording();
    setRecording(false);
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" mode="video" facing={facing}>
        <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-between px-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
            hitSlop={12}
            onPress={() => setFacing((prev) => (prev === 'front' ? 'back' : 'front'))}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(0,0,0,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="camera-reverse-outline" size={26} color="#ffffff" />
          </Pressable>
          <View className="flex-1 items-center px-2">
            <Button
              label={recording ? 'Stop Recording' : 'Start Recording'}
              onPress={recording ? stopRecording : startRecording}
              variant={recording ? 'danger' : 'primary'}
            />
          </View>
          <View style={{ width: 48 }} />
        </View>
      </CameraView>
    </View>
  );
}
