import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function StatTile({ title, label, value, icon, subtitle, trend }) {
  const displayTitle = title || label;

  return (
    <View style={styles.tile}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}

      {displayTitle ? (
        <Text style={[typography.label, styles.title]}>{displayTitle}</Text>
      ) : null}

      <Text style={[typography.h2, styles.value]}>{value}</Text>

      {subtitle ? (
        <Text style={[typography.caption, styles.subtitle]}>{subtitle}</Text>
      ) : null}

      {trend ? (
        <Text style={[typography.caption, styles.trend]}>{trend}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconWrap: {
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  value: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  trend: {
    textAlign: 'center',
    color: colors.success,
    fontWeight: '600',
  },
});
