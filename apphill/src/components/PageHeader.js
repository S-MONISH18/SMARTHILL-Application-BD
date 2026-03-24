import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function PageHeader({ title, subtitle, rightElement }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={[typography.h2, styles.title]}>{title}</Text>
        {subtitle ? <Text style={[typography.bodySmall, styles.subtitle]}>{subtitle}</Text> : null}
      </View>
      {rightElement ? <View>{rightElement}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});
