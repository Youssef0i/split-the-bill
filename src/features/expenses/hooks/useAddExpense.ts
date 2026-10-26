// VIEWMODEL for the Add / Edit Expense screen: form state, validation and saving.
// With an expenseId the form starts filled in and saving updates that expense.
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { SplitType } from '@/models/types';
import { splitEqually, validateCustomSplit } from '@/lib/splitCalculator';

export { CATEGORIES } from '@/lib/categories';

export function useAddExpense(groupId: string, expenseId?: string) {
  const { data, addExpense, updateExpense } = useAppContext();
  const group = data.groups.find((g) => g.id === groupId);
  const members = group?.members ?? [];
  const existing = expenseId ? data.expenses.find((e) => e.id === expenseId) : undefined;
  const isEdit = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [paidBy, setPaidBy] = useState(existing?.paidBy ?? members[0]?.id ?? '');
  const [category, setCategory] = useState<string>(existing?.category ?? 'Food');
  const [splitType, setSplitType] = useState<SplitType>(existing?.splitType ?? 'equal');
  const [selected, setSelected] = useState<string[]>(
    existing ? existing.shares.map((s) => s.memberId) : members.map((m) => m.id),
  );
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    existing && existing.splitType === 'custom'
      ? Object.fromEntries(existing.shares.map((s) => [s.memberId, String(s.amount)]))
      : {},
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const total = Number(amount) || 0;

  const toggleMember = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const setCustomAmount = (id: string, value: string) =>
    setCustomAmounts((prev) => ({ ...prev, [id]: value }));

  // Preview of each member's share, shown under the checkboxes.
  const preview = useMemo(() => {
    if (splitType === 'equal') {
      if (total <= 0 || selected.length === 0) return {};
      const shares = splitEqually(total, selected);
      return Object.fromEntries(shares.map((s) => [s.memberId, s.amount]));
    }
    return Object.fromEntries(selected.map((id) => [id, Number(customAmounts[id]) || 0]));
  }, [splitType, total, selected, customAmounts]);

  /** Returns true when saved, false when validation failed. */
  const save = async () => {
    if (!title.trim()) return setError('Enter a title'), false;
    if (total <= 0) return setError('Amount must be greater than zero'), false;
    if (!paidBy) return setError('Choose who paid'), false;
    if (selected.length === 0) return setError('Choose at least one member'), false;

    const shares =
      splitType === 'equal'
        ? splitEqually(total, selected)
        : selected.map((id) => ({ memberId: id, amount: Number(customAmounts[id]) || 0 }));

    if (splitType === 'custom') {
      const check = validateCustomSplit(total, shares);
      if (!check.valid) return setError(check.error ?? 'Invalid split'), false;
    }

    setError(null);
    setSaving(true);
    try {
      const fields = {
        groupId,
        title: title.trim(),
        amount: total,
        paidBy,
        splitType,
        shares,
        category,
      };
      if (existing) await updateExpense(existing.id, fields);
      else await addExpense(fields);
      return true;
    } catch {
      setError('Could not save the expense. Try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    group,
    members,
    isEdit,
    title, setTitle,
    amount, setAmount,
    paidBy, setPaidBy,
    category, setCategory,
    splitType, setSplitType,
    selected, toggleMember,
    customAmounts, setCustomAmount,
    preview,
    error,
    saving,
    save,
  };
}
