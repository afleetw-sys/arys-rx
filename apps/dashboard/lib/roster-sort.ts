import type { MemberWithSummary } from '@/lib/program-metrics';

export function sortMembersForPortal(
  portal: 'hr' | 'pbm',
  members: MemberWithSummary[],
): MemberWithSummary[] {
  const list = [...members];
  if (portal === 'pbm') {
    list.sort((a, b) => {
      const byCompany = (a.companyName ?? '').localeCompare(b.companyName ?? '');
      if (byCompany !== 0) return byCompany;
      return a.id.localeCompare(b.id);
    });
  } else {
    list.sort((a, b) => a.id.localeCompare(b.id));
  }
  return list;
}
