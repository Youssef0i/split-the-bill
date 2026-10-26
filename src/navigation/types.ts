// Typed routes: every screen and the params it needs. Send only small ids.
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  // groups (Member A)
  Home: undefined;
  CreateGroup: undefined;
  GroupDetails: { groupId: string };
  // expenses (Member B)
  AddExpense: { groupId: string; expenseId?: string }; // expenseId = edit mode
  ExpenseDetails: { expenseId: string };
  Statistics: { groupId: string };
  // settlements (Member C)
  Balances: { groupId: string };
  SettleUp: { groupId: string; from?: string; to?: string; amount?: number };
  PaymentHistory: { groupId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
