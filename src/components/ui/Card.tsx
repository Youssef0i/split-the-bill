import React from 'react';
import { Pressable, View } from 'react-native';

const base = 'mb-3 rounded-3xl bg-card p-4 shadow-sm';

export default function Card({
  children,
  onPress,
  className = '',
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} className={`${base} active:opacity-80 ${className}`}>
        {children}
      </Pressable>
    );
  }
  return <View className={`${base} ${className}`}>{children}</View>;
}
