export interface ProgramOverviewMetrics {
  enrolledCount: number;
  averageAdherence: number;
  videoVerificationRate: number;
}

interface Props {
  metrics: ProgramOverviewMetrics;
}

function IconPeople() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function IconTrendUp() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  subtitleSuccess,
  iconBoxClass,
  icon,
}: {
  title: string;
  value: string;
  subtitle: React.ReactNode;
  subtitleSuccess?: boolean;
  iconBoxClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70 sm:p-6">
      <div className="flex justify-between items-start gap-3">
        <span className="text-sm font-medium text-neutral-500">{title}</span>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBoxClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 tabular-nums sm:text-4xl">{value}</p>
      <div
        className={`mt-2 flex items-center gap-1.5 text-sm ${
          subtitleSuccess ? 'text-success-600 font-medium' : 'text-neutral-500'
        }`}
      >
        {subtitleSuccess ? (
          <svg
            className="w-4 h-4 shrink-0 text-success-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        ) : null}
        {subtitle}
      </div>
    </div>
  );
}

export function ProgramOverview({ metrics }: Props) {
  const { enrolledCount, averageAdherence, videoVerificationRate } = metrics;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      <MetricCard
        title="Enrolled Members"
        value={String(enrolledCount)}
        subtitle="Active in program"
        subtitleSuccess
        iconBoxClass="bg-sky-50 text-sky-600"
        icon={<IconPeople />}
      />
      <MetricCard
        title="Average Adherence"
        value={`${averageAdherence}%`}
        subtitle="Across all members"
        iconBoxClass="bg-emerald-50 text-emerald-600"
        icon={<IconTrendUp />}
      />
      <MetricCard
        title="Program Compliance"
        value={`${videoVerificationRate}%`}
        subtitle="Verified dose rate"
        iconBoxClass="bg-violet-50 text-violet-600"
        icon={<IconCheck />}
      />
    </div>
  );
}
