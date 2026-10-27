// VIEWMODEL for the Home and Create Group screens.
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export function useGroups() {
  const { data, status, error, reload, addGroup } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const groups = data.groups.map((g) => {
    const groupExpenses = data.expenses.filter((e) => e.groupId === g.id);
    return {
      ...g,
      expenseCount: groupExpenses.length,
      total: groupExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  });

  // Numbers for the summary card on the Home screen.
  const summary = {
    total: groups.reduce((sum, g) => sum + g.total, 0),
    groupCount: groups.length,
    expenseCount: groups.reduce((sum, g) => sum + g.expenseCount, 0),
  };

  /** Validates the form, then saves. Returns the new group id or null. */
  const createGroup = async (name: string, memberNames: string[]) => {
    const members = memberNames.map((m) => m.trim()).filter(Boolean);
    if (!name.trim()) return setFormError('Enter a group name'), null;
    if (members.length < 2) return setFormError('Add at least 2 members'), null;
    if (new Set(members.map((m) => m.toLowerCase())).size !== members.length) {
      return setFormError('Member names must be different'), null;
    }

    setFormError(null);
    setSaving(true);
    try {
      const group = await addGroup(name, members);
      return group.id;
    } catch {
      setFormError('Could not save the group. Try again.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { groups, summary, status, error, reload, createGroup, saving, formError };
}
