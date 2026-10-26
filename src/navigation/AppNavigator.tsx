// The navigation shell: one NavigationContainer and a typed stack.
// Each member registers their screens here.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme/tokens';
import type { RootStackParamList } from './types';
// groups (Member A)
import HomeScreen from '@/features/groups/screens/HomeScreen';
import CreateGroupScreen from '@/features/groups/screens/CreateGroupScreen';
import GroupDetailsScreen from '@/features/groups/screens/GroupDetailsScreen';
// expenses (Member B)
import AddExpenseScreen from '@/features/expenses/screens/AddExpenseScreen';
import ExpenseDetailsScreen from '@/features/expenses/screens/ExpenseDetailsScreen';
import StatisticsScreen from '@/features/expenses/screens/StatisticsScreen';
// settlements (Member C)
import BalancesScreen from '@/features/settlements/screens/BalancesScreen';
import SettleUpScreen from '@/features/settlements/screens/SettleUpScreen';
import PaymentHistoryScreen from '@/features/settlements/screens/PaymentHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Split the Bill' }} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'New Group' }} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: 'Group' }} />

        <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
        <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Expense' }} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Statistics' }} />

        <Stack.Screen name="Balances" component={BalancesScreen} options={{ title: 'Balances' }} />
        <Stack.Screen name="SettleUp" component={SettleUpScreen} options={{ title: 'Record Payment' }} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
