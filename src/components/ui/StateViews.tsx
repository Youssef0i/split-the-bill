// Shared loading / empty / error states, reused by every screen.
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';
import AppButton from './AppButton';

export function Loader({ message = 'Loading...' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-3 text-center text-[15px] text-muted">{message}</Text>
    </View>
  );
}

export function EmptyState({
  emoji = '🧾',
  title,
  message,
  actionLabel,
  onAction,
}: {
  emoji?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-5xl">{emoji}</Text>
      <Text className="mt-4 text-xl font-extrabold text-ink">{title}</Text>
      <Text className="mt-2 text-center text-[15px] text-muted">{message}</Text>
      {actionLabel && onAction && (
        <AppButton label={actionLabel} onPress={onAction} className="mt-6 self-stretch" />
      )}
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text className="text-5xl">😕</Text>
      <Text className="mt-4 text-xl font-extrabold text-ink">Something went wrong</Text>
      <Text className="mt-2 text-center text-[15px] text-muted">{message}</Text>
      {onRetry && <AppButton label="Try again" onPress={onRetry} className="mt-6 self-stretch" />}
    </View>
  );
}
