import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '@arys-rx/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { DoseGuideOverlay } from './DoseGuideOverlay';

interface Props {
  onRecordingComplete: (uri: string) => void;
}

export function CameraScreenNative({ onRecordingComplete }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0f172a',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(255,255,255,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <MaterialIcons name="videocam_off" size={32} color="rgba(255,255,255,0.5)" />
        </View>
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center' }}>
          Camera access required
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
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
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} mode="video" facing="front">
        <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
          <Button
            label={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording}
            variant={recording ? 'danger' : 'primary'}
          />
        </View>
      </CameraView>

      {/* Guide shown on top of camera every time */}
      <DoseGuideOverlay visible={showGuide} onStart={() => setShowGuide(false)} />
    </View>
  );
}
