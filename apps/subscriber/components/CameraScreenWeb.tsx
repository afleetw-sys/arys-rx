import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '@arys-rx/ui';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { DoseGuideOverlay } from './DoseGuideOverlay';

interface Props {
  onRecordingComplete: (uri: string) => void;
}

export function CameraScreenWeb({ onRecordingComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setPermissionDenied(true));

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  function stopStream() {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
  }

  function startRecording() {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      onRecordingComplete(URL.createObjectURL(blob));
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function handleClose() {
    if (recording) mediaRecorderRef.current?.stop();
    stopStream();
    router.back();
  }

  if (permissionDenied) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 24 }}
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
            Camera permission denied
          </Text>
          <Text
            style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 20 }}
          >
            Please allow camera access in your browser settings and reload the page.
          </Text>
        </View>
        <CloseButton onPress={handleClose} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', maxWidth: 480, borderRadius: 16, background: '#000' }}
      />
      <Button
        label={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
        variant={recording ? 'danger' : 'primary'}
      />

      {/* Guide shown on top of camera every time */}
      <DoseGuideOverlay visible={showGuide} onStart={() => setShowGuide(false)} />

      {/* Close button rendered last so it sits above the guide overlay */}
      <CloseButton onPress={handleClose} />
    </View>
  );
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute',
        top: 52,
        right: 16,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: pressed ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <MaterialIcons name="close" size={22} color="#fff" />
    </Pressable>
  );
}
