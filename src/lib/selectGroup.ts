// Shared helper: everything a screen usually needs about one group.
// Used by several features, so it lives in lib/ (features never import each other).
import { AppData } from '@/models/types';
import { calculateBalances } from './splitCalculator';

export function selectGroup(data: AppData, groupId: string) {
  const group = data.groups.find((g) => g.id === groupId);
  const members = group?.members ?? [];
  const expenses = data.expenses.filter((e) => e.groupId === groupId);
  const settlements = data.settlements.filter((s) => s.groupId === groupId);
  const balances = calculateBalances(members.map((m) => m.id), expenses, settlements);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const memberName = (id: string) => members.find((m) => m.id === id)?.name ?? '?';
  // Position of a member in the group, used to pick their avatar color.
  const memberIndex = (id: string) => Math.max(0, members.findIndex((m) => m.id === id));

  return { group, members, expenses, settlements, balances, total, memberName, memberIndex };
}
