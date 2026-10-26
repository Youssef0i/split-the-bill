import React from 'react';
import { Text, View } from 'react-native';
import { avatarColors } from '@/theme/tokens';

// A colored circle with the member's first letter.
export default function Avatar({
  name,
  index,
  size = 'md',
}: {
  name: string;
  index: number;
  size?: 'sm' | 'md';
}) {
  const box = size === 'sm' ? 'h-6 w-6' : 'h-9 w-9';
  const text = size === 'sm' ? 'text-[10px]' : 'text-sm';
  return (
    <View
      className={`${box} items-center justify-center rounded-full border-2 border-card`}
      style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
    >
      <Text className={`${text} font-extrabold text-white`}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}
