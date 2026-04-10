interface Props {
  rate: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AdherenceRateBadge({ rate, size = 'md' }: Props) {
  const color =
    rate >= 90
      ? 'bg-success-50 text-success-700'
      : rate >= 70
        ? 'bg-warning-50 text-warning-700'
        : 'bg-danger-50 text-danger-700';

  const textSize =
    size === 'lg' ? 'text-2xl font-bold' : size === 'sm' ? 'text-xs' : 'text-sm font-medium';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${color} ${textSize}`}>
      {rate.toFixed(0)}%
    </span>
  );
}
