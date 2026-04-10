import { Text, View } from 'react-native';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  success: { container: 'bg-success-50', text: 'text-success-700' },
  warning: { container: 'bg-warning-50', text: 'text-warning-700' },
  danger: { container: 'bg-danger-50', text: 'text-danger-700' },
  neutral: { container: 'bg-neutral-100', text: 'text-neutral-600' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const styles = variantStyles[variant];
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${styles.container}`}>
      <Text className={`text-xs font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
