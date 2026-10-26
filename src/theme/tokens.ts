// Design tokens: the single source of the app's look.
// tailwind.config.js has the same colors, so NativeWind classes
// (bg-primary, text-ink, text-muted, bg-line, ...) match these values.
export const colors = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#F3EEFF',
  accent: '#EC4899',
  background: '#F7F7FB',
  card: '#FFFFFF',
  text: '#0F0F1A',
  muted: '#8A8AA0',
  line: '#EDEBF5',
  danger: '#F43F5E',
  success: '#10B981',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 20, xl: 24, pill: 999 } as const;

// Every member gets a fixed avatar color (by their position in the group).
export const avatarColors = ['#7C3AED', '#F59E0B', '#10B981', '#EC4899', '#0EA5E9', '#EF4444'] as const;

export const formatMoney = (n: number) =>
  `EGP ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
