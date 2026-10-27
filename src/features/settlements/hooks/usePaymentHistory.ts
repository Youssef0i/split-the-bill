// VIEWMODEL for the Payment History screen.
import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { selectGroup } from '@/lib/selectGroup';

export function usePaymentHistory(groupId: string) {
  const { data, status, error, reload } = useAppContext();

  return useMemo(() => {
    const view = selectGroup(data, groupId);
    // Newest payment first.
    const payments = [...view.settlements].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    return { ...view, payments, totalPaid, status, error, reload };
  }, [data, groupId, status, error, reload]);
}
