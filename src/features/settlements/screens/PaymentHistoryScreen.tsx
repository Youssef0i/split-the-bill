// VIEW: every payment recorded in a group, newest first.
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { EmptyState, ErrorView, Loader } from '@/components/ui/StateViews';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'PaymentHistory'>;

export default function PaymentHistoryScreen({ route }: Props) {
  const vm = usePaymentHistory(route.params.groupId);

  if (vm.status === 'loading') return <Loader />;
  if (vm.status === 'error') return <ErrorView message={vm.error ?? ''} onRetry={vm.reload} />;
  if (!vm.group) return <ErrorView message="This group was not found." />;
  if (vm.payments.length === 0) {
    return (
      <EmptyState
        emoji="🤝"
        title="No payments yet"
        message="When someone settles up, the payment will show here."
      />
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      data={vm.payments}
      keyExtractor={(p) => p.id}
      contentContainerClassName="px-5 pb-10 pt-2"
      ListHeaderComponent={
        <Text className="mb-3 text-sm text-muted">
          {vm.payments.length} {vm.payments.length === 1 ? 'payment' : 'payments'} ·{' '}
          {formatMoney(vm.totalPaid)} settled
        </Text>
      }
      renderItem={({ item }) => {
        const date = new Date(item.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return (
          <Card className="flex-row items-center gap-3">
            <Avatar name={vm.memberName(item.from)} index={vm.memberIndex(item.from)} />
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">
                {vm.memberName(item.from)} paid {vm.memberName(item.to)}
              </Text>
              <Text className="mt-0.5 text-xs text-muted">
                {date}
                {item.note ? ` · ${item.note}` : ''}
              </Text>
            </View>
            <Text className="text-base font-extrabold text-success">{formatMoney(item.amount)}</Text>
          </Card>
        );
      }}
    />
  );
}
