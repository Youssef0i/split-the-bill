// VIEWMODEL for the Group Details screen.
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { selectGroup } from '@/lib/selectGroup';

export function useGroupDetails(groupId: string) {
  const { data, status, error, reload, deleteGroup } = useAppContext();
  const view = useMemo(() => selectGroup(data, groupId), [data, groupId]);

  // Deleting needs two taps: the first asks "are you sure?", the second deletes.
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /** Returns true when the group was deleted. */
  const onDeletePress = async () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return false;
    }
    setDeleting(true);
    try {
      await deleteGroup(groupId);
      return true;
    } catch {
      setDeleteError('Could not delete the group. Try again.');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    ...view,
    status,
    error,
    reload,
    confirmingDelete,
    cancelDelete: () => setConfirmingDelete(false),
    deleting,
    deleteError,
    onDeletePress,
  };
}
