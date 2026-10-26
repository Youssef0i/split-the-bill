// Expense categories and the emoji shown for each (emoji are used instead of an icon library).
export const CATEGORIES = ['Food', 'Transport', 'Stay', 'Shopping', 'Other'] as const;

export const categoryEmoji: Record<string, string> = {
  Food: '🍕',
  Transport: '🚕',
  Stay: '🏨',
  Shopping: '🛍️',
  Other: '💸',
};

// A friendly emoji for each group card, picked by its position in the list.
export const groupEmojis = ['🏖️', '🍕', '🏠', '🎉', '✈️', '⚽'];
