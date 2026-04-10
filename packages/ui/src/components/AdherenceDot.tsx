import type { AdherenceStatus } from '@arys-rx/types';
import { View } from 'react-native';

interface AdherenceDotProps {
  status: AdherenceStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusColor: Record<AdherenceStatus, string> = {
  taken: 'bg-success-500',
  missed: 'bg-danger-500',
  pending: 'bg-neutral-300',
};

const sizeClass = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function AdherenceDot({ status, size = 'md' }: AdherenceDotProps) {
  return (
    <View className={`rounded-full ${statusColor[status]} ${sizeClass[size]}`} />
  );
}
