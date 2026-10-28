import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

interface TabIconProps {
  symbol: string;
  focused: boolean;
}

export const TabIcon: React.FC<TabIconProps> = ({ symbol, focused }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Text style={[styles.symbolText, focused && styles.activeSymbolText]}>
        {symbol}
      </Text>
    </View>
  );
};

interface TabLabelProps {
  label: string;
  focused: boolean;
}

export const TabLabel: React.FC<TabLabelProps> = ({ label, focused }) => {
  return (
    <View style={styles.labelContainer}>
      <Text
        style={[
          styles.labelText,
          focused ? styles.activeLabelText : styles.inactiveLabelText,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View
        style={[
          styles.dotPlaceholder,
          focused && styles.activeDot,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
    marginTop: 2,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  symbolText: {
    fontSize: 18,
    opacity: 0.85,
  },
  activeSymbolText: {
    fontSize: 19,
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  labelText: {
    fontSize: 10.5,
  },
  activeLabelText: {
    color: '#1B5E20',
    fontWeight: '800',
    fontSize: 11,
  },
  inactiveLabelText: {
    color: '#757575',
    fontWeight: '500',
  },
  dotPlaceholder: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    backgroundColor: 'transparent',
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
