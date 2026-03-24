import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function Badge({ text, variant = 'default', size = 'medium' }) {
  const isSuccess = variant === 'success';
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        isSuccess ? styles.successBadge : styles.defaultBadge,
        isSmall && styles.smallBadge,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSuccess ? styles.successText : styles.defaultText,
          isSmall && styles.smallText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  successBadge: {
    backgroundColor: colors.successLight,
  },
  defaultBadge: {
    backgroundColor: colors.surfaceSecondary,
  },
  smallBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
  successText: {
    color: colors.success,
  },
  defaultText: {
    color: colors.textSecondary,
  },
  smallText: {
    fontSize: 12,
  },
});
