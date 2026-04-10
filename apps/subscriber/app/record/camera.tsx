import { Button } from '@arys-rx/ui';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { CameraScreenNative } from '@/components/CameraScreenNative';
import { CameraScreenWeb } from '@/components/CameraScreenWeb';

// Platform-split: use native camera on device, web fallback in browser
export default function CameraScreen() {
  function onRecordingComplete(uri: string) {
    router.push({ pathname: '/record/review', params: { uri } });
  }

  if (Platform.OS === 'web') {
    return <CameraScreenWeb onRecordingComplete={onRecordingComplete} />;
  }

  return <CameraScreenNative onRecordingComplete={onRecordingComplete} />;
}
