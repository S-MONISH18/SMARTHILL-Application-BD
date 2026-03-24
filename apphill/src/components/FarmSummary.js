import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';
import StatTile from './StatTile';

const SummaryIcon = ({ symbol, text }) => (
  <View style={styles.iconBox}>
    {symbol ? (
      <Text style={styles.iconEmoji}>{symbol}</Text>
    ) : (
      <Text style={styles.iconText}>{text}</Text>
    )}
  </View>
);

export default function FarmSummary({ nodeCount, motorCount, valveCount, areaSize }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Farm Overview</Text>

      <View style={styles.grid}>
        <StatTile
          label="Nodes"
          value={nodeCount}
          icon={<SummaryIcon symbol="📡" />}
        />

        <StatTile
          label="Motors"
          value={motorCount}
          icon={<SummaryIcon symbol="⚙️" />}
        />

        <StatTile
          label="Valves"
          value={valveCount}
          icon={<SummaryIcon symbol="🚰" />}
        />

        <StatTile
          label="Area (acres)"
          value={areaSize}
          icon={<SummaryIcon symbol="🌾" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    elevation: 2,
  },
  title: {
    ...typography.h4,
    marginBottom: spacing.lg,
    color: colors.primary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary || '#EEF6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});