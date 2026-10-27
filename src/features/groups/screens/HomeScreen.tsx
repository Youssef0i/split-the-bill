// VIEW: the list of groups. All logic lives in useGroups (ViewModel).
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGroups } from '../hooks/useGroups';
import { EmptyState, ErrorView, Loader } from '@/components/ui/StateViews';
import Card from '@/components/ui/Card';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';
import HeroCard from '@/components/ui/HeroCard';
import { groupEmojis } from '@/lib/categories';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { groups, summary, status, error, reload } = useGroups();

  if (status === 'loading') return <Loader message="Loading your groups..." />;
  if (status === 'error') return <ErrorView message={error ?? ''} onRetry={reload} />;
  if (groups.length === 0) {
    return (
      <EmptyState
        emoji="👋"
        title="No groups yet"
        message="Create a group for your next trip or outing and start splitting bills."
        actionLabel="Create a group"
        onAction={() => navigation.navigate('CreateGroup')}
      />
    );
  }

  const header = (
    <View>
      <Text className="text-sm text-muted">Welcome back 👋</Text>
      <Text className="mb-4 text-3xl font-extrabold text-ink">Your groups</Text>
      <HeroCard
        label="Total spent in all groups"
        value={formatMoney(summary.total)}
        stats={[
          { label: 'Groups', value: String(summary.groupCount) },
          { label: 'Expenses', value: String(summary.expenseCount) },
        ]}
      />
      <Text className="mb-3 mt-5 text-lg font-extrabold text-ink">Groups</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={groups}
        keyExtractor={(g) => g.id}
        ListHeaderComponent={header}
        contentContainerClassName="px-5 pb-4 pt-2"
        renderItem={({ item, index }) => (
          <Card
            onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
            className="flex-row items-center gap-3"
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
              <Text className="text-2xl">{groupEmojis[index % groupEmojis.length]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-ink">{item.name}</Text>
              <Text className="mt-0.5 text-xs text-muted">
                {item.members.length} members · {item.expenseCount}{' '}
                {item.expenseCount === 1 ? 'expense' : 'expenses'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-base font-extrabold text-ink">{formatMoney(item.total)}</Text>
              <View className="mt-1 flex-row">
                {item.members.slice(0, 4).map((m, i) => (
                  <View key={m.id} className={i === 0 ? '' : '-ml-1.5'}>
                    <Avatar name={m.name} index={i} size="sm" />
                  </View>
                ))}
              </View>
            </View>
          </Card>
        )}
      />
      <View className="px-5 pb-8 pt-2">
        <AppButton label="＋ New group" variant="dark" onPress={() => navigation.navigate('CreateGroup')} />
      </View>
    </View>
  );
}
