import { expect, test } from '@jest/globals';
import { Expense } from '@/models/types';
import {
  calculateBalances,
  splitEqually,
  validateCustomSplit,
} from '@/lib/splitCalculator';

const expense = (paidBy: string, amount: number, shares: Expense['shares']): Expense => ({
  id: Math.random().toString(),
  groupId: 'g1',
  title: 'Test',
  amount,
  paidBy,
  splitType: 'custom',
  shares,
  createdAt: new Date().toISOString(),
});

// Test 1: equal split, including amounts that do not divide evenly.
test('splits an expense equally and the shares always add up to the total', () => {
  expect(splitEqually(300, ['a', 'b', 'c']).map((s) => s.amount)).toEqual([100, 100, 100]);

  const uneven = splitEqually(100, ['a', 'b', 'c']);
  expect(uneven.map((s) => s.amount)).toEqual([33.34, 33.33, 33.33]);
  expect(uneven.reduce((sum, s) => sum + s.amount, 0)).toBeCloseTo(100);
});

// Test 2: balances after several expenses and a settlement.
test('calculates who owes whom after expenses and a settlement', () => {
  const expenses = [
    expense('a', 300, splitEqually(300, ['a', 'b', 'c'])), // a paid for everyone
    expense('b', 90, splitEqually(90, ['a', 'b', 'c'])), // b paid for everyone
  ];
  expect(calculateBalances(['a', 'b', 'c'], expenses)).toEqual({ a: 170, b: -40, c: -130 });

  const settlement = { id: 's1', groupId: 'g1', from: 'c', to: 'a', amount: 130, createdAt: '' };
  expect(calculateBalances(['a', 'b', 'c'], expenses, [settlement])).toEqual({
    a: 40,
    b: -40,
    c: 0,
  });
});

// Test 3: custom split validation.
test('rejects a custom split that does not add up to the total', () => {
  expect(
    validateCustomSplit(200, [
      { memberId: 'a', amount: 120 },
      { memberId: 'b', amount: 80 },
    ]),
  ).toEqual({ valid: true });

  const wrong = validateCustomSplit(200, [
    { memberId: 'a', amount: 120 },
    { memberId: 'b', amount: 50 },
  ]);
  expect(wrong.valid).toBe(false);
  expect(wrong.error).toMatch(/add up/);
});
