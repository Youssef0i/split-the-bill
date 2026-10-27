// VIEW: form to create a group and add its members.
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useGroups } from '../hooks/useGroups';
import AppButton from '@/components/ui/AppButton';
import Avatar from '@/components/ui/Avatar';

type Props = RootStackScreenProps<'CreateGroup'>;

const inputClass = 'rounded-2xl bg-card px-4 py-3.5 text-base text-ink shadow-sm';
const labelClass = 'mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-muted';

export default function CreateGroupScreen({ navigation }: Props) {
  const { createGroup, saving, formError } = useGroups();
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>(['', '']);

  const updateMember = (i: number, value: string) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? value : m)));
  const removeMember = (i: number) => setMembers((prev) => prev.filter((_, idx) => idx !== i));

  const onSave = async () => {
    const id = await createGroup(name, members);
    if (id) navigation.replace('GroupDetails', { groupId: id });
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pb-10"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="mt-2 text-center text-5xl">🎉</Text>
      <Text className="mt-2 text-center text-sm text-muted">
        Name your group and add everyone who shares the bills.
      </Text>

      <Text className={labelClass}>Group name</Text>
      <TextInput
        className={inputClass}
        placeholder="e.g. Dahab trip 🏖️"
        placeholderTextColor="#8A8AA0"
        value={name}
        onChangeText={setName}
      />

      <Text className={labelClass}>Members</Text>
      {members.map((m, i) => (
        <View key={i} className="mb-2.5 flex-row items-center gap-3">
          <Avatar name={m || '?'} index={i} />
          <TextInput
            className={`${inputClass} flex-1`}
            placeholder={`Member ${i + 1}`}
            placeholderTextColor="#8A8AA0"
            value={m}
            onChangeText={(v) => updateMember(i, v)}
          />
          {members.length > 2 && (
            <Pressable onPress={() => removeMember(i)} className="p-2" accessibilityLabel="Remove member">
              <Text className="text-lg text-danger">✕</Text>
            </Pressable>
          )}
        </View>
      ))}
      <AppButton
        label="＋ Add member"
        variant="outline"
        onPress={() => setMembers((prev) => [...prev, ''])}
        className="mt-1"
      />

      {formError && (
        <View className="mt-4 rounded-2xl bg-danger/10 px-4 py-3">
          <Text className="text-sm font-semibold text-danger">{formError}</Text>
        </View>
      )}

      <AppButton label="Create group" onPress={onSave} loading={saving} className="mt-6" />
    </ScrollView>
  );
}
