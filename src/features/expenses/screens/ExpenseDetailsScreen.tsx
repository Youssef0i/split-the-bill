// VIEW: one expense — amount, who paid, and each member's share.
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useExpenseDetails } from '../hooks/useExpenseDetails';
import { ErrorView, Loader } from '@/components/ui/StateViews';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { categoryEmoji } from '@/lib/categories';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'ExpenseDetails'>;

export default function ExpenseDetailsScreen({ route, navigation }: Props) {
  const vm = useExpenseDetails(route.params.expenseId);

  useEffect(() => {
    if (vm.expense) navigation.setOptions({ title: vm.expense.title });
  }, [vm.expense, navigation]);

  if (vm.status === 'loading') return <Loader />;
  if (!vm.expense) return <ErrorView message="This expense was not found." />;

  const e = vm.expense;
  const date = new Date(e.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const onDelete = async () => {
    const deleted = await vm.onDeletePress();
    if (deleted) navigation.goBack();
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pb-6 pt-2">
        <Card className="items-center py-6">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary-light">
            <Text className="text-3xl">{categoryEmoji[e.category ?? 'Other'] ?? '💸'}</Text>
          </View>
          <Text className="mt-3 text-lg font-bold text-ink">{e.title}</Text>
          <Text className="mt-1 text-4xl font-extrabold text-primary">{formatMoney(e.amount)}</Text>
          <View className="mt-3 flex-row items-center gap-2">
            <Avatar name={vm.memberName(e.paidBy)} index={vm.memberIndex(e.paidBy)} size="sm" />
            <Text className="text-sm text-muted">
              {vm.memberName(e.paidBy)} paid · {date}
            </Text>
          </View>
          <View className="mt-3 rounded-full bg-primary-light px-3 py-1">
            <Text className="text-xs font-bold text-primary-dark">{e.category ?? 'Other'}</Text>
          </View>
        </Card>

        <Text className="mb-3 mt-5 text-lg font-extrabold text-ink">
          Split {e.splitType === 'equal' ? 'equally' : 'by custom amounts'}
        </Text>
        <Card>
          {e.shares.map((s) => (
            <View key={s.memberId} className="flex-row items-center gap-3 py-2">
              <Avatar name={vm.memberName(s.memberId)} index={vm.memberIndex(s.memberId)} />
              <Text className="flex-1 text-base font-bold text-ink">{vm.memberName(s.memberId)}</Text>
              <Text className="text-base font-extrabold text-ink">{formatMoney(s.amount)}</Text>
            </View>
          ))}
        </Card>

        {vm.error && (
          <View className="mt-2 rounded-2xl bg-danger/10 px-4 py-3">
            <Text className="text-sm font-semibold text-danger">{vm.error}</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-8 pt-2">
        {!vm.confirming && (
          <AppButton
            label="✏️ Edit expense"
            variant="outline"
            className="mb-2"
            onPress={() => navigation.navigate('AddExpense', { groupId: e.groupId, expenseId: e.id })}
          />
        )}
        {vm.confirming && (
          <Text className="mb-2 text-center text-sm font-semibold text-danger">
            Delete this expense? Balances will be recalculated.
          </Text>
        )}
        <AppButton
          label={vm.confirming ? 'Yes, delete it' : 'Delete expense'}
          variant="danger"
          loading={vm.deleting}
          onPress={onDelete}
        />
        {vm.confirming && (
          <AppButton label="Cancel" variant="outline" onPress={vm.cancelDelete} className="mt-2" />
        )}
      </View>
    </View>
  );
}
