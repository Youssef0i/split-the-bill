import React from 'react';
import { Pressable, Text } from 'react-native';

// A selectable pill, used for "Paid by" and "Category". `left` can hold an avatar.
export default function Chip({
  label,
  selected,
  onPress,
  left,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  left?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`mb-2 mr-2 flex-row items-center gap-1.5 rounded-2xl border-2 px-3 py-2 ${
        selected ? 'border-primary bg-primary-light' : 'border-transparent bg-card'
      }`}
    >
      {left}
      <Text className={`text-sm font-semibold ${selected ? 'text-primary-dark' : 'text-ink'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
