import type { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`bg-white rounded-3xl p-5 ${className}`}
      style={{
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}
