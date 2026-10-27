// VIEWMODEL for the Balances screen: who owes whom and the suggested payments.
import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { selectGroup } from '@/lib/selectGroup';
import { suggestTransfers } from '@/lib/splitCalculator';

export function useBalances(groupId: string) {
  const { data, status, error, reload } = useAppContext();

  return useMemo(() => {
    const view = selectGroup(data, groupId);
    const transfers = suggestTransfers(view.balances);
    const allSettled = transfers.length === 0;
    return { ...view, transfers, allSettled, status, error, reload };
  }, [data, groupId, status, error, reload]);
}
