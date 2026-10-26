import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'dark' | 'outline' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
}

const box: Record<Variant, string> = {
  primary: 'bg-primary',
  dark: 'bg-ink',
  outline: 'border-2 border-primary bg-transparent',
  danger: 'bg-danger',
};

// One button for the whole app. The screen decides what happens on press.
export default function AppButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  className = '',
}: Props) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      className={`items-center rounded-2xl px-5 py-4 active:opacity-80 ${box[variant]} ${
        disabled || loading ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={outline ? '#7C3AED' : '#fff'} />
      ) : (
        <Text className={`text-base font-bold ${outline ? 'text-primary' : 'text-white'}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
