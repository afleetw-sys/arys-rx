import { Button } from '@arys-rx/ui';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

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

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: true })
      .then((stream) => {
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
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, [onReadyForRecording]);

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
    <View className="flex-1 bg-black items-center justify-center gap-6">
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
    </View>
  );
}
