import { tableCardClass, tableScrollClass } from '@/lib/dashboard-ui';

interface Props {
  children: React.ReactNode;
}

export function DashboardTableCard({ children }: Props) {
  return (
    <div className={tableCardClass}>
      <div className={tableScrollClass}>{children}</div>
    </div>
  );
}
