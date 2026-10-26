// Pure business logic (no React), so it is easy to unit test.
import { Balances, Expense, ExpenseShare, ID, Settlement, Transfer } from '@/models/types';

const toCents = (n: number) => Math.round(n * 100);
const fromCents = (n: number) => n / 100;

/**
 * Split an amount equally. Leftover piasters go to the first members,
 * so the shares always add up exactly to the total.
 */
export function splitEqually(amount: number, memberIds: ID[]): ExpenseShare[] {
  if (memberIds.length === 0) throw new Error('Choose at least one member');
  if (amount <= 0) throw new Error('Amount must be greater than zero');

  const total = toCents(amount);
  const base = Math.floor(total / memberIds.length);
  const remainder = total - base * memberIds.length;

  return memberIds.map((memberId, i) => ({
    memberId,
    amount: fromCents(base + (i < remainder ? 1 : 0)),
  }));
}

/** Check that a custom split is valid and adds up to the total. */
export function validateCustomSplit(
  amount: number,
  shares: ExpenseShare[],
): { valid: boolean; error?: string } {
  if (amount <= 0) return { valid: false, error: 'Amount must be greater than zero' };
  if (shares.length === 0) return { valid: false, error: 'Choose at least one member' };
  if (shares.some((s) => s.amount < 0)) return { valid: false, error: 'Shares cannot be negative' };

  const sum = shares.reduce((acc, s) => acc + toCents(s.amount), 0);
  if (sum !== toCents(amount)) {
    return {
      valid: false,
      error: `Shares add up to ${fromCents(sum)} but the total is ${amount}`,
    };
  }
  return { valid: true };
}

/** Net balance of every member after all expenses and settlements. */
export function calculateBalances(
  memberIds: ID[],
  expenses: Expense[],
  settlements: Settlement[] = [],
): Balances {
  const cents: Record<ID, number> = {};
  memberIds.forEach((id) => (cents[id] = 0));

  for (const e of expenses) {
    cents[e.paidBy] = (cents[e.paidBy] ?? 0) + toCents(e.amount);
    for (const s of e.shares) {
      cents[s.memberId] = (cents[s.memberId] ?? 0) - toCents(s.amount);
    }
  }
  for (const s of settlements) {
    cents[s.from] = (cents[s.from] ?? 0) + toCents(s.amount);
    cents[s.to] = (cents[s.to] ?? 0) - toCents(s.amount);
  }

  const result: Balances = {};
  Object.keys(cents).forEach((id) => (result[id] = fromCents(cents[id])));
  return result;
}

/** Fewest simple transfers that settle everyone (greedy). */
export function suggestTransfers(balances: Balances): Transfer[] {
  const debtors = Object.entries(balances)
    .filter(([, b]) => b < 0)
    .map(([id, b]) => ({ id, c: -toCents(b) }))
    .sort((a, b) => b.c - a.c);
  const creditors = Object.entries(balances)
    .filter(([, b]) => b > 0)
    .map(([id, b]) => ({ id, c: toCents(b) }))
    .sort((a, b) => b.c - a.c);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].c, creditors[j].c);
    transfers.push({ from: debtors[i].id, to: creditors[j].id, amount: fromCents(pay) });
    debtors[i].c -= pay;
    creditors[j].c -= pay;
    if (debtors[i].c === 0) i++;
    if (creditors[j].c === 0) j++;
  }
  return transfers;
}
