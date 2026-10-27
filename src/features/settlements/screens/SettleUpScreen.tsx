// VIEW: record a payment between two members.
import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { PAYMENT_METHODS, useSettleUp } from '../hooks/useSettleUp';
import { ErrorView } from '@/components/ui/StateViews';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import { formatMoney } from '@/theme/tokens';

type Props = RootStackScreenProps<'SettleUp'>;

const labelClass = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted';

export default function SettleUpScreen({ route, navigation }: Props) {
  const { groupId, from, to, amount } = route.params;
  const vm = useSettleUp(groupId, { from, to, amount });

  if (!vm.group) return <ErrorView message="This group was not found." />;

  const onSave = async () => {
    const ok = await vm.save();
    if (ok) navigation.goBack();
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pb-6 pt-2" keyboardShouldPersistTaps="handled">
        <Card className="items-center py-6">
          {vm.from && vm.to ? (
            <>
              <View className="flex-row items-center gap-3">
                <Avatar name={vm.memberName(vm.from)} index={vm.memberIndex(vm.from)} />
                <Text className="text-xl text-muted">→</Text>
                <Avatar name={vm.memberName(vm.to)} index={vm.memberIndex(vm.to)} />
              </View>
              <Text className="mt-3 text-lg font-extrabold text-ink">
                {vm.memberName(vm.from)} pays {vm.memberName(vm.to)}
              </Text>
              <Text className="mt-1 text-sm text-muted">
                {vm.owed > 0
                  ? `${vm.memberName(vm.from)} owes ${formatMoney(vm.owed)} in total`
                  : `${vm.memberName(vm.from)} doesn't owe anything`}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-4xl">🤝</Text>
              <Text className="mt-2 text-base font-bold text-ink">Who paid whom?</Text>
            </>
          )}
        </Card>

        <Text className={labelClass}>From (paid)</Text>
        <View className="flex-row flex-wrap">
          {vm.members.map((m, i) => (
            <Chip
              key={m.id}
              label={m.name}
              selected={vm.from === m.id}
              onPress={() => vm.setFrom(m.id)}
              left={<Avatar name={m.name} index={i} size="sm" />}
            />
          ))}
        </View>

        <Text className={labelClass}>To (received)</Text>
        <View className="flex-row flex-wrap">
          {vm.members.map((m, i) => (
            <Chip
              key={m.id}
              label={m.name}
              selected={vm.to === m.id}
              onPress={() => vm.setTo(m.id)}
              left={<Avatar name={m.name} index={i} size="sm" />}
            />
          ))}
        </View>

        <Text className={labelClass}>Amount (EGP)</Text>
        <TextInput
          className="rounded-2xl bg-card px-4 py-3.5 text-lg font-bold text-ink shadow-sm"
          placeholder="0.00"
          placeholderTextColor="#8A8AA0"
          keyboardType="decimal-pad"
          value={vm.amount}
          onChangeText={vm.setAmount}
        />

        <Text className={labelClass}>Paid with</Text>
        <View className="flex-row flex-wrap">
          {PAYMENT_METHODS.map((p) => (
            <Chip key={p} label={p} selected={vm.note === p} onPress={() => vm.setNote(p)} />
          ))}
        </View>

        {vm.error && (
          <View className="mt-3 rounded-2xl bg-danger/10 px-4 py-3">
            <Text className="text-sm font-semibold text-danger">{vm.error}</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-8 pt-2">
        <AppButton label="Confirm payment" onPress={onSave} loading={vm.saving} />
      </View>
    </View>
  );
}
