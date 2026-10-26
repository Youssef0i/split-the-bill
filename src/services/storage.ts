// Data layer: saves and loads everything locally on the phone (AsyncStorage).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '@/models/types';

const KEY = 'split-the-bill/data/v1';

export const emptyData: AppData = { groups: [], expenses: [], settlements: [] };

export async function loadData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return emptyData;
  const parsed = JSON.parse(raw) as Partial<AppData>;
  return {
    groups: parsed.groups ?? [],
    expenses: parsed.expenses ?? [],
    settlements: parsed.settlements ?? [],
  };
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
