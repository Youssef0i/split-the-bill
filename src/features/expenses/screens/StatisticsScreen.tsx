// VIEW: spending statistics for one group.
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useStatistics } from '../hooks/useStatistics';
import { EmptyState, ErrorView, Loader } from '@/components/ui/StateViews';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import HeroCard from '@/components/ui/HeroCard';
import { categoryEmoji } from '@/lib/categories';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'Statistics'>;

const sectionClass = 'mb-3 mt-5 text-lg font-extrabold text-ink';

export default function StatisticsScreen({ route }: Props) {
  const vm = useStatistics(route.params.groupId);

  if (vm.status === 'loading') return <Loader />;
  if (vm.status === 'error') return <ErrorView message={vm.error ?? ''} onRetry={vm.reload} />;
  if (!vm.group) return <ErrorView message="This group was not found." />;
  if (vm.count === 0) {
    return (
      <EmptyState
        emoji="📊"
        title="No stats yet"
        message="Add a few expenses and your spending breakdown will show up here."
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pb-10 pt-2">
      <HeroCard
        label="Total spent"
        value={formatMoney(vm.total)}
        stats={[
          { label: 'Per person', value: formatMoney(vm.perPerson) },
          { label: 'Expenses', value: String(vm.count) },
        ]}
      />

      <Text className={sectionClass}>By category</Text>
      <Card>
        {vm.byCategory.map((c) => (
          <View key={c.category} className="py-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-[15px] font-semibold text-ink">
                {categoryEmoji[c.category] ?? '💸'} {c.category}
              </Text>
              <Text className="text-sm font-bold text-ink">
                {formatMoney(c.amount)} · {Math.round(c.percent * 100)}%
              </Text>
            </View>
            {/* Simple bar chart: a colored View whose width is the percentage */}
            <View className="mt-2 h-3 overflow-hidden rounded-full bg-line">
              <View
                className="h-3 rounded-full bg-primary"
                style={{ width: `${Math.max(4, c.percent * 100)}%` }}
              />
            </View>
          </View>
        ))}
      </Card>

      <Text className={sectionClass}>Who paid most</Text>
      <Card>
        {vm.byPayer.map((p, i) => (
          <View key={p.id} className="flex-row items-center gap-3 py-2">
            <Avatar name={p.name} index={p.index} />
            <Text className="flex-1 text-base font-bold text-ink">
              {p.name} {i === 0 && p.paid > 0 ? '🥇' : ''}
            </Text>
            <Text className="text-base font-extrabold text-ink">{formatMoney(p.paid)}</Text>
          </View>
        ))}
      </Card>

      {vm.biggest && (
        <>
          <Text className={sectionClass}>Biggest expense</Text>
          <Card className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
              <Text className="text-2xl">{categoryEmoji[vm.biggest.category ?? 'Other'] ?? '💸'}</Text>
            </View>
            <Text className="flex-1 text-base font-bold text-ink">{vm.biggest.title}</Text>
            <Text className="text-base font-extrabold text-ink">{formatMoney(vm.biggest.amount)}</Text>
          </Card>
        </>
      )}
    </ScrollView>
  );
}
