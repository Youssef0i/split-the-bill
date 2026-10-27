// VIEW: one group — summary, members' balances and its expenses.
import React, { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGroupDetails } from '../hooks/useGroupDetails';
import { EmptyState, ErrorView, Loader } from '@/components/ui/StateViews';
import Card from '@/components/ui/Card';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';
import HeroCard from '@/components/ui/HeroCard';
import { categoryEmoji } from '@/lib/categories';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'GroupDetails'>;

const sectionClass = 'mb-3 mt-5 text-lg font-extrabold text-ink';

export default function GroupDetailsScreen({ route, navigation }: Props) {
  const vm = useGroupDetails(route.params.groupId);
  const { group, expenses, balances, memberName, total, status, error, reload } = vm;

  useEffect(() => {
    if (group) navigation.setOptions({ title: group.name });
  }, [group, navigation]);

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <ErrorView message={error ?? ''} onRetry={reload} />;
  if (!group) return <ErrorView message="This group was not found." />;

  const onDelete = async () => {
    const deleted = await vm.onDeletePress();
    if (deleted) navigation.goBack();
  };

  // Shown under the expenses list.
  const footer = (
    <View className="mt-6 items-center">
      {vm.confirmingDelete && (
        <Text className="mb-2 text-center text-sm font-semibold text-danger">
          Delete “{group.name}” with all its expenses and payments?
        </Text>
      )}
      {vm.deleteError && <Text className="mb-2 text-sm text-danger">{vm.deleteError}</Text>}
      <View className="flex-row gap-2">
        {vm.confirmingDelete && (
          <Pressable onPress={vm.cancelDelete} className="rounded-2xl bg-card px-5 py-3 shadow-sm">
            <Text className="text-sm font-bold text-ink">Cancel</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onDelete}
          disabled={vm.deleting}
          className={`rounded-2xl px-5 py-3 ${vm.confirmingDelete ? 'bg-danger' : 'bg-danger/10'}`}
        >
          <Text className={`text-sm font-bold ${vm.confirmingDelete ? 'text-white' : 'text-danger'}`}>
            {vm.deleting ? 'Deleting...' : vm.confirmingDelete ? 'Yes, delete group' : '🗑️ Delete group'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const perPerson = group.members.length ? total / group.members.length : 0;

  const header = (
    <View>
      <HeroCard
        label="Total spent"
        value={formatMoney(total)}
        stats={[
          { label: 'Per person', value: formatMoney(perPerson) },
          { label: 'Expenses', value: String(expenses.length) },
        ]}
      />

      {/* Quick links to the other features of this group */}
      <View className="mt-3 flex-row gap-2">
        {[
          { label: '⚖️ Balances', onPress: () => navigation.navigate('Balances', { groupId: group.id }) },
          { label: '📊 Stats', onPress: () => navigation.navigate('Statistics', { groupId: group.id }) },
          { label: '🧾 History', onPress: () => navigation.navigate('PaymentHistory', { groupId: group.id }) },
        ].map((link) => (
          <Pressable
            key={link.label}
            onPress={link.onPress}
            accessibilityRole="button"
            className="flex-1 items-center rounded-2xl bg-card py-3 shadow-sm active:opacity-70"
          >
            <Text className="text-sm font-bold text-ink">{link.label}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mb-3 mt-5 flex-row items-center justify-between">
        <Text className="text-lg font-extrabold text-ink">Balances</Text>
        <Pressable onPress={() => navigation.navigate('Balances', { groupId: group.id })}>
          <Text className="text-sm font-bold text-primary">Who owes who →</Text>
        </Pressable>
      </View>
      <Card>
        {group.members.map((m, i) => {
          const b = balances[m.id] ?? 0;
          const color = b > 0 ? 'text-success' : b < 0 ? 'text-danger' : 'text-muted';
          const text = b > 0 ? `+${formatMoney(b)}` : b < 0 ? `−${formatMoney(-b)}` : 'settled ✓';
          return (
            <View key={m.id} className="flex-row items-center gap-3 py-2">
              <Avatar name={m.name} index={i} />
              <Text className="flex-1 text-base font-bold text-ink">{m.name}</Text>
              <Text className={`text-base font-extrabold ${color}`}>{text}</Text>
            </View>
          );
        })}
      </Card>

      <Text className={sectionClass}>Expenses</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={expenses}
        keyExtractor={(e) => e.id}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerClassName="grow px-5 pb-4 pt-2"
        ListEmptyComponent={
          <EmptyState
            emoji="🧾"
            title="No expenses yet"
            message="Tap “Add expense” to record the first bill."
          />
        }
        renderItem={({ item }) => (
          <Card
            onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
            className="flex-row items-center gap-3"
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
              <Text className="text-2xl">{categoryEmoji[item.category ?? 'Other'] ?? '💸'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-ink">{item.title}</Text>
              <Text className="mt-0.5 text-xs text-muted">{memberName(item.paidBy)} paid</Text>
            </View>
            <Text className="text-base font-extrabold text-ink">{formatMoney(item.amount)}</Text>
          </Card>
        )}
      />
      <View className="px-5 pb-8 pt-2">
        <AppButton
          label="＋ Add expense"
          onPress={() => navigation.navigate('AddExpense', { groupId: group.id })}
        />
      </View>
    </View>
  );
}
