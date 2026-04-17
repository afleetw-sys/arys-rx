import { Button } from '@arys-rx/ui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  onRecordingComplete: (uri: string) => void;
  onReadyForRecording?: () => void;
}

export function CameraScreenWeb({ onRecordingComplete, onReadyForRecording }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const readyNotifiedRef = useRef(false);
  const [recording, setRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const stopPreviewTracks = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: true,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        if (!readyNotifiedRef.current) {
          readyNotifiedRef.current = true;
          onReadyForRecording?.();
        }
      })
      .catch(() => setPermissionDenied(true));

    return () => {
      cancelled = true;
      stopPreviewTracks();
    };
  }, [facingMode, onReadyForRecording, stopPreviewTracks]);

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

  if (permissionDenied) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6 gap-4">
        <Text className="text-white text-center">
          Camera permission was denied. Please allow camera access in your browser and reload.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black items-center justify-center gap-6 px-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', maxWidth: 480, borderRadius: 16, background: '#000' }}
      />
      <View className="w-full max-w-[480px] flex-row items-center justify-between gap-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Flip camera"
          disabled={recording}
          onPress={() =>
            setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
          }
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: recording ? 0.35 : 1,
          }}
        >
          <Ionicons name="camera-reverse-outline" size={24} color="#ffffff" />
        </Pressable>
        <View className="flex-1 items-center">
          <Button
            label={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording}
            variant={recording ? 'danger' : 'primary'}
          />
        </View>
        <View style={{ width: 48 }} />
      </View>
    </View>
  );
}
