// VIEWMODEL for the Settle Up screen: form state, validation and saving a payment.
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { selectGroup } from '@/lib/selectGroup';

export const PAYMENT_METHODS = ['Cash', 'InstaPay', 'Vodafone Cash', 'Bank transfer'];

export function useSettleUp(
  groupId: string,
  initial: { from?: string; to?: string; amount?: number },
) {
  const { data, addSettlement } = useAppContext();
  const view = useMemo(() => selectGroup(data, groupId), [data, groupId]);

  const [from, setFrom] = useState(initial.from ?? '');
  const [to, setTo] = useState(initial.to ?? '');
  const [amount, setAmount] = useState(initial.amount ? String(initial.amount) : '');
  const [note, setNote] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // How much "from" still owes (a negative balance means they owe money).
  const owed = from ? Math.max(0, -(view.balances[from] ?? 0)) : 0;

  /** Returns true when the payment was saved. */
  const save = async () => {
    const value = Number(amount);
    if (!from || !to) return setError('Choose who paid and who received'), false;
    if (from === to) return setError('Payer and receiver must be different'), false;
    if (!value || value <= 0) return setError('Amount must be greater than zero'), false;
    if (owed === 0) return setError(`${view.memberName(from)} doesn't owe anything`), false;
    if (value > owed + 0.001) {
      return setError(`Amount can't be more than the debt (EGP ${owed.toFixed(2)})`), false;
    }

    setError(null);
    setSaving(true);
    try {
      await addSettlement({ groupId, from, to, amount: value, note });
      return true;
    } catch {
      setError('Could not save the payment. Try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    group: view.group,
    members: view.members,
    memberName: view.memberName,
    memberIndex: view.memberIndex,
    from, setFrom,
    to, setTo,
    amount, setAmount,
    note, setNote,
    owed,
    error,
    saving,
    save,
  };
}
