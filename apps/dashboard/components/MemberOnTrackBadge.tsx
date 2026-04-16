interface Props {
  onTrack: boolean;
}

export function MemberOnTrackBadge({ onTrack }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        onTrack ? 'bg-success-50 text-success-700' : 'bg-amber-50 text-amber-800'
      }`}
    >
      {onTrack ? 'On track' : 'Needs attention'}
    </span>
  );
}
