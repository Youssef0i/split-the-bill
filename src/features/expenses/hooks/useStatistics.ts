// VIEWMODEL for the Statistics screen: totals by category and by payer.
import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { selectGroup } from '@/lib/selectGroup';

export function useStatistics(groupId: string) {
  const { data, status, error, reload } = useAppContext();

  return useMemo(() => {
    const { group, members, expenses, total, memberIndex } = selectGroup(data, groupId);

    // Sum of amounts per category, biggest first.
    const byCategoryMap: Record<string, number> = {};
    for (const e of expenses) {
      const c = e.category ?? 'Other';
      byCategoryMap[c] = (byCategoryMap[c] ?? 0) + e.amount;
    }
    const byCategory = Object.entries(byCategoryMap)
      .map(([category, amount]) => ({ category, amount, percent: total ? amount / total : 0 }))
      .sort((a, b) => b.amount - a.amount);

    // How much each member paid, biggest first.
    const byPayer = members
      .map((m) => ({
        id: m.id,
        name: m.name,
        index: memberIndex(m.id),
        paid: expenses.filter((e) => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0),
      }))
      .sort((a, b) => b.paid - a.paid);

    const perPerson = members.length ? total / members.length : 0;
    const biggest = expenses.reduce<(typeof expenses)[number] | undefined>(
      (max, e) => (!max || e.amount > max.amount ? e : max),
      undefined,
    );

    return { group, total, perPerson, count: expenses.length, byCategory, byPayer, biggest, status, error, reload };
  }, [data, groupId, status, error, reload]);
}
