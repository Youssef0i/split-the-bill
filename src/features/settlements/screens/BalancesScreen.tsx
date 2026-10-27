// VIEW: balances of every member and the fewest payments to settle up.
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useBalances } from '../hooks/useBalances';
import { ErrorView, Loader } from '@/components/ui/StateViews';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'Balances'>;

const sectionClass = 'mb-3 mt-5 text-lg font-extrabold text-ink';

export default function BalancesScreen({ route, navigation }: Props) {
  const groupId = route.params.groupId;
  const vm = useBalances(groupId);

  if (vm.status === 'loading') return <Loader />;
  if (vm.status === 'error') return <ErrorView message={vm.error ?? ''} onRetry={vm.reload} />;
  if (!vm.group) return <ErrorView message="This group was not found." />;

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pb-6 pt-2">
        <Card>
          {vm.members.map((m, i) => {
            const b = vm.balances[m.id] ?? 0;
            const color = b > 0 ? 'text-success' : b < 0 ? 'text-danger' : 'text-muted';
            const label = b > 0 ? 'gets back' : b < 0 ? 'owes' : 'settled ✓';
            return (
              <View key={m.id} className="flex-row items-center gap-3 py-2">
                <Avatar name={m.name} index={i} />
                <View className="flex-1">
                  <Text className="text-base font-bold text-ink">{m.name}</Text>
                  <Text className={`text-xs font-semibold ${color}`}>{label}</Text>
                </View>
                <Text className={`text-base font-extrabold ${color}`}>
                  {b === 0 ? '—' : formatMoney(Math.abs(b))}
                </Text>
              </View>
            );
          })}
        </Card>

        <Text className={sectionClass}>Suggested payments</Text>
        {vm.allSettled ? (
          <Card className="items-center py-6">
            <Text className="text-4xl">🎉</Text>
            <Text className="mt-2 text-base font-extrabold text-ink">Everyone is settled up</Text>
            <Text className="mt-1 text-center text-sm text-muted">Nobody owes anything right now.</Text>
          </Card>
        ) : (
          vm.transfers.map((t) => (
            <Card key={`${t.from}-${t.to}`} className="flex-row items-center gap-3">
              <View className="flex-row">
                <Avatar name={vm.memberName(t.from)} index={vm.memberIndex(t.from)} />
                <View className="-ml-2">
                  <Avatar name={vm.memberName(t.to)} index={vm.memberIndex(t.to)} />
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink">
                  {vm.memberName(t.from)} → {vm.memberName(t.to)}
                </Text>
                <Text className="text-sm font-semibold text-muted">{formatMoney(t.amount)}</Text>
              </View>
              <AppButton
                label="Mark paid"
                className="px-4 py-2.5"
                onPress={() =>
                  navigation.navigate('SettleUp', { groupId, from: t.from, to: t.to, amount: t.amount })
                }
              />
            </Card>
          ))
        )}
        <Text className="mt-1 text-center text-xs text-muted">
          Tap “Mark paid” after someone pays back, so the app can update the balances.
        </Text>
      </ScrollView>

      <View className="px-5 pb-8 pt-2">
        <AppButton
          label="Payment history"
          variant="outline"
          onPress={() => navigation.navigate('PaymentHistory', { groupId })}
        />
      </View>
    </View>
  );
}
