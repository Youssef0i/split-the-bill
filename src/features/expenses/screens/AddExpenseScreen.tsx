// VIEW: form to add an expense. All logic lives in useAddExpense (ViewModel).
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { CATEGORIES, useAddExpense } from '../hooks/useAddExpense';
import { ErrorView } from '@/components/ui/StateViews';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import { categoryEmoji } from '@/lib/categories';

type Props = RootStackScreenProps<'AddExpense'>;

const labelClass = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted';

export default function AddExpenseScreen({ route, navigation }: Props) {
  const vm = useAddExpense(route.params.groupId, route.params.expenseId);

  // Same screen is used to edit: change the title in edit mode.
  useEffect(() => {
    if (vm.isEdit) navigation.setOptions({ title: 'Edit Expense' });
  }, [vm.isEdit, navigation]);

  if (!vm.group) return <ErrorView message="This group was not found." />;

  const onSave = async () => {
    const ok = await vm.save();
    if (ok) navigation.goBack();
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pb-6" keyboardShouldPersistTaps="handled">
        {/* Big amount, like a payment app */}
        <View className="mt-2 flex-row items-end justify-center">
          <Text className="mb-2 mr-2 text-lg font-bold text-muted">EGP</Text>
          <TextInput
            className="min-w-[80px] text-center text-5xl font-extrabold text-ink"
            placeholder="0"
            placeholderTextColor="#C9C7D6"
            keyboardType="decimal-pad"
            value={vm.amount}
            onChangeText={vm.setAmount}
          />
        </View>
        <TextInput
          className="mt-4 rounded-2xl bg-card px-4 py-3.5 text-center text-base text-ink shadow-sm"
          placeholder={`${categoryEmoji[vm.category] ?? ''} What was it for?`}
          placeholderTextColor="#8A8AA0"
          value={vm.title}
          onChangeText={vm.setTitle}
        />

        <Text className={labelClass}>Paid by</Text>
        <View className="flex-row flex-wrap">
          {vm.members.map((m, i) => (
            <Chip
              key={m.id}
              label={m.name}
              selected={vm.paidBy === m.id}
              onPress={() => vm.setPaidBy(m.id)}
              left={<Avatar name={m.name} index={i} size="sm" />}
            />
          ))}
        </View>

        <Text className={labelClass}>Category</Text>
        <View className="flex-row flex-wrap">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={`${categoryEmoji[c]} ${c}`}
              selected={vm.category === c}
              onPress={() => vm.setCategory(c)}
            />
          ))}
        </View>

        <Text className={labelClass}>Split</Text>
        <View className="flex-row rounded-2xl bg-line p-1">
          {(['equal', 'custom'] as const).map((type) => {
            const on = vm.splitType === type;
            return (
              <Pressable
                key={type}
                onPress={() => vm.setSplitType(type)}
                className={`flex-1 items-center rounded-xl py-2.5 ${on ? 'bg-card shadow-sm' : ''}`}
              >
                <Text className={`text-sm font-bold ${on ? 'text-ink' : 'text-muted'}`}>
                  {type === 'equal' ? 'Equally' : 'Custom'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Card className="mt-3">
          {vm.members.map((m, i) => {
            const isOn = vm.selected.includes(m.id);
            return (
              <View key={m.id} className="flex-row items-center justify-between py-2">
                <Pressable
                  onPress={() => vm.toggleMember(m.id)}
                  className="flex-1 flex-row items-center gap-3"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isOn }}
                >
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-lg border-2 ${
                      isOn ? 'border-primary bg-primary' : 'border-line bg-card'
                    }`}
                  >
                    {isOn && <Text className="text-xs font-bold text-white">✓</Text>}
                  </View>
                  <Avatar name={m.name} index={i} size="sm" />
                  <Text className={`text-[15px] font-semibold ${isOn ? 'text-ink' : 'text-muted'}`}>
                    {m.name}
                  </Text>
                </Pressable>

                {isOn && vm.splitType === 'custom' ? (
                  <TextInput
                    className="w-24 rounded-xl bg-background px-3 py-2 text-right font-bold text-ink"
                    placeholder="0"
                    placeholderTextColor="#8A8AA0"
                    keyboardType="decimal-pad"
                    value={vm.customAmounts[m.id] ?? ''}
                    onChangeText={(v) => vm.setCustomAmount(m.id, v)}
                  />
                ) : (
                  <Text className="text-base font-extrabold text-ink">
                    {isOn && vm.preview[m.id] !== undefined ? vm.preview[m.id].toFixed(2) : '—'}
                  </Text>
                )}
              </View>
            );
          })}
        </Card>

        {vm.error && (
          <View className="mt-2 rounded-2xl bg-danger/10 px-4 py-3">
            <Text className="text-sm font-semibold text-danger">{vm.error}</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-8 pt-2">
        <AppButton
          label={vm.isEdit ? 'Save changes' : 'Save expense'}
          onPress={onSave}
          loading={vm.saving}
        />
      </View>
    </View>
  );
}
