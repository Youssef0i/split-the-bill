// MODEL layer: the shape of the app's data.

export type ID = string;

export interface Member {
  id: ID;
  name: string;
}

export interface Group {
  id: ID;
  name: string;
  members: Member[];
  createdAt: string; // ISO date
}

export type SplitType = 'equal' | 'custom';

export interface ExpenseShare {
  memberId: ID;
  amount: number; // what this member owes for the expense
}

export interface Expense {
  id: ID;
  groupId: ID;
  title: string;
  amount: number;
  paidBy: ID;
  splitType: SplitType;
  shares: ExpenseShare[];
  category?: string;
  createdAt: string;
}

export interface Settlement {
  id: ID;
  groupId: ID;
  from: ID; // who paid back
  to: ID; // who received
  amount: number;
  note?: string; // e.g. Cash, InstaPay
  createdAt: string;
}

/** Everything the app stores on the device. */
export interface AppData {
  groups: Group[];
  expenses: Expense[];
  settlements: Settlement[];
}

/** Balance > 0 means the member should receive money; < 0 means they owe. */
export type Balances = Record<ID, number>;

export interface Transfer {
  from: ID;
  to: ID;
  amount: number;
}
