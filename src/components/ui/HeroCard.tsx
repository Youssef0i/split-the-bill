import React from 'react';
import { Text, View } from 'react-native';

// The big purple summary card at the top of a screen.
export default function HeroCard({
  label,
  value,
  stats,
}: {
  label: string;
  value: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <View className="mb-2 rounded-3xl bg-primary p-5 shadow-lg">
      <Text className="text-xs font-medium text-white/80">{label}</Text>
      <Text className="mt-1 text-3xl font-extrabold text-white">{value}</Text>
      <View className="mt-4 flex-row gap-2">
        {stats.map((s) => (
          <View key={s.label} className="flex-1 rounded-2xl bg-white/20 px-3 py-2">
            <Text className="text-[11px] text-white/80">{s.label}</Text>
            <Text className="mt-0.5 text-sm font-bold text-white">{s.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
