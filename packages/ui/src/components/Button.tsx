import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: { container: 'bg-brand-600', text: 'text-white' },
  secondary: { container: 'bg-neutral-100 border border-neutral-200', text: 'text-neutral-800' },
  ghost: { container: 'bg-transparent', text: 'text-brand-600' },
  danger: { container: 'bg-danger-500', text: 'text-white' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const styles = variantStyles[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={[
        'rounded-2xl px-6 py-4 items-center justify-center',
        styles.container,
        disabled && 'opacity-40',
        fullWidth && 'w-full',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Text className={`text-base font-semibold ${styles.text}`}>{label}</Text>
    </Pressable>
  );
}
