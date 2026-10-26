// Shared app state for every screen (Context). Screens never touch storage directly.
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppData, Expense, Group, Settlement } from '@/models/types';
import { emptyData, loadData, newId, saveData } from '@/services/storage';

type Status = 'loading' | 'ready' | 'error';

interface AppContextValue {
  data: AppData;
  status: Status;
  error: string | null;
  reload: () => Promise<void>;
  addGroup: (name: string, memberNames: string[]) => Promise<Group>;
  deleteGroup: (groupId: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (expenseId: string, changes: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  addSettlement: (s: Omit<Settlement, 'id' | 'createdAt'>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      setData(await loadData());
      setStatus('ready');
    } catch {
      setError('Could not load your data. Please try again.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Update state and save it to the device.
  const commit = async (next: AppData) => {
    setData(next);
    await saveData(next);
  };

  const addGroup = async (name: string, memberNames: string[]) => {
    const group: Group = {
      id: newId(),
      name: name.trim(),
      members: memberNames.map((n) => ({ id: newId(), name: n.trim() })),
      createdAt: new Date().toISOString(),
    };
    await commit({ ...data, groups: [group, ...data.groups] });
    return group;
  };

  // Deleting a group also deletes its expenses and payments.
  const deleteGroup = async (groupId: string) => {
    await commit({
      groups: data.groups.filter((g) => g.id !== groupId),
      expenses: data.expenses.filter((e) => e.groupId !== groupId),
      settlements: data.settlements.filter((s) => s.groupId !== groupId),
    });
  };

  const addExpense: AppContextValue['addExpense'] = async (e) => {
    const expense: Expense = { ...e, id: newId(), createdAt: new Date().toISOString() };
    await commit({ ...data, expenses: [expense, ...data.expenses] });
  };

  // Editing keeps the expense id and date, and replaces the rest.
  const updateExpense: AppContextValue['updateExpense'] = async (expenseId, changes) => {
    await commit({
      ...data,
      expenses: data.expenses.map((e) => (e.id === expenseId ? { ...e, ...changes } : e)),
    });
  };

  const deleteExpense = async (expenseId: string) => {
    await commit({ ...data, expenses: data.expenses.filter((e) => e.id !== expenseId) });
  };

  const addSettlement: AppContextValue['addSettlement'] = async (s) => {
    const settlement: Settlement = { ...s, id: newId(), createdAt: new Date().toISOString() };
    await commit({ ...data, settlements: [settlement, ...data.settlements] });
  };

  return (
    <AppContext.Provider
      value={{ data, status, error, reload, addGroup, deleteGroup, addExpense, updateExpense, deleteExpense, addSettlement }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
