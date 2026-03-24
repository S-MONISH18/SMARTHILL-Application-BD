import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  icon,
  multiline = false,
  style,
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={[typography.label, styles.label]}>{label}</Text> : null}

      <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}

        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.text,
  },
  inputContainer: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingTop: spacing.md,
  },
  iconWrap: {
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});