import { Button } from '@arys-rx/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
  onRecordingComplete: (uri: string) => void;
}

export function CameraScreenNative({ onRecordingComplete }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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
      <CameraView ref={cameraRef} className="flex-1" mode="video" facing="front">
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <Button
            label={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording}
            variant={recording ? 'danger' : 'primary'}
          />
        </View>
      </CameraView>
    </View>
  );
}
