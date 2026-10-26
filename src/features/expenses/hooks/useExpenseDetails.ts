// VIEWMODEL for the Expense Details screen.
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { selectGroup } from '@/lib/selectGroup';

export function useExpenseDetails(expenseId: string) {
  const { data, status, deleteExpense } = useAppContext();
  const expense = data.expenses.find((e) => e.id === expenseId);
  const view = useMemo(() => selectGroup(data, expense?.groupId ?? ''), [data, expense?.groupId]);

  // Deleting needs two taps: the first asks "are you sure?", the second deletes.
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Returns true when the expense was deleted. */
  const onDeletePress = async () => {
    if (!confirming) {
      setConfirming(true);
      return false;
    }
    setDeleting(true);
    try {
      await deleteExpense(expenseId);
      return true;
    } catch {
      setError('Could not delete the expense. Try again.');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    expense,
    status,
    memberName: view.memberName,
    memberIndex: view.memberIndex,
    confirming,
    cancelDelete: () => setConfirming(false),
    deleting,
    error,
    onDeletePress,
  };
}
