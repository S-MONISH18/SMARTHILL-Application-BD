import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

import { BASE_URL as API_BASE } from '../../services/apiService';
// ☝️ Uses same host as the rest of the app (local/emulator/LAN) — change it
// in apiService.js for all screens at once.

// ─── Field config ─────────────────────────────────────────
const FIELDS = [
  { key: 'N',           label: 'Nitrogen (N)',        icon: '🧪', unit: 'mg/kg', placeholder: 'e.g. 90',    keyboardType: 'numeric' },
  { key: 'P',           label: 'Phosphorus (P)',       icon: '⚗️',  unit: 'mg/kg', placeholder: 'e.g. 42',    keyboardType: 'numeric' },
  { key: 'K',           label: 'Potassium (K)',        icon: '🔬', unit: 'mg/kg', placeholder: 'e.g. 43',    keyboardType: 'numeric' },
  { key: 'temperature', label: 'Temperature',         icon: '🌡️',  unit: '°C',    placeholder: 'e.g. 24.5',  keyboardType: 'decimal-pad' },
  { key: 'humidity',    label: 'Humidity',             icon: '💧', unit: '%',     placeholder: 'e.g. 82.0',  keyboardType: 'decimal-pad' },
  { key: 'ph',          label: 'Soil pH',              icon: '🧬', unit: '0–14',  placeholder: 'e.g. 6.5',   keyboardType: 'decimal-pad' },
  { key: 'rainfall',    label: 'Rainfall',             icon: '🌧️',  unit: 'mm',    placeholder: 'e.g. 202.9', keyboardType: 'decimal-pad' },
];

// ─── Confidence → colour ──────────────────────────────────
const confColor = (c) => {
  if (c >= 85) return '#22c55e';
  if (c >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function CropPredictionScreen() {
  const navigation = useNavigation();

  // form state
  const [values, setValues] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '',
  });
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);
  const [error,   setError]     = useState(null);

  // animated card
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  const animateResult = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  // ─── Predict ────────────────────────────────────────────
  const handlePredict = async () => {
    setError(null);
    setResult(null);

    // client-side validation
    const empty = FIELDS.filter(f => !values[f.key].trim());
    if (empty.length > 0) {
      Alert.alert('Missing Fields', `Please fill: ${empty.map(f => f.label).join(', ')}`);
      return;
    }

    // range hints
    if (parseFloat(values.ph) < 0 || parseFloat(values.ph) > 14) {
      Alert.alert('Invalid pH', 'Soil pH must be between 0 and 14.');
      return;
    }

    setLoading(true);
    try {
      const body = {};
      FIELDS.forEach(f => { body[f.key] = values[f.key]; });

      const resp = await fetch(`${API_BASE}/predict-crop`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      if (!resp.ok) throw new Error(`Server error ${resp.status}`);

      const json = await resp.json();

      if (!json.success) {
        setError(json.error || 'Prediction failed');
      } else {
        setResult(json);
        animateResult();
      }
    } catch (err) {
      console.error('❌ Predict error:', err);
      setError('Could not reach the server. Make sure both the Node.js backend and the ML service are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
    setResult(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* ── HEADER ──────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerEmoji}>🌱</Text>
            <Text style={[typography.h2, styles.headerTitle]}>Crop Prediction</Text>
            <Text style={[typography.bodySmall, styles.headerSub]}>
              AI-powered crop recommendation from soil &amp; climate data
            </Text>
          </View>
        </View>

        {/* ── MODEL BADGE ─────────────────────────── */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>🤖 Random Forest · XGBoost · Extra Trees</Text></View>
        </View>

        {/* ── INPUT FORM ──────────────────────────── */}
        <AppCard style={styles.formCard}>
          <Text style={[typography.h4, styles.formTitle]}>Enter Soil &amp; Climate Values</Text>
          {FIELDS.map((field) => (
            <View key={field.key} style={styles.fieldRow}>
              <InputField
                label={`${field.icon}  ${field.label}`}
                placeholder={`${field.placeholder}  (${field.unit})`}
                value={values[field.key]}
                onChangeText={(v) => setValues(prev => ({ ...prev, [field.key]: v }))}
                keyboardType={field.keyboardType}
                icon={null}
              />
            </View>
          ))}

          <PrimaryButton
            title={loading ? 'Predicting...' : '🌿  Predict Crop'}
            onPress={handlePredict}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={{ marginTop: 12 }} color={colors.primary} />}

          {result && (
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>↺  Reset</Text>
            </TouchableOpacity>
          )}
        </AppCard>

        {/* ── ERROR ───────────────────────────────── */}
        {error && (
          <AppCard style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </AppCard>
        )}

        {/* ── RESULT ──────────────────────────────── */}
        {result && (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Main prediction */}
            <AppCard style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultEmoji}>{result.emoji}</Text>
                <View style={styles.resultHeaderText}>
                  <Text style={[typography.h2, styles.resultCrop]}>
                    {result.crop.charAt(0).toUpperCase() + result.crop.slice(1)}
                  </Text>
                  <Text style={[typography.bodySmall, styles.resultSeason]}>
                    Season: {result.season}
                  </Text>
                </View>
              </View>

              {/* Confidence bar */}
              <View style={styles.confRow}>
                <Text style={styles.confLabel}>Confidence</Text>
                <Text style={[styles.confValue, { color: confColor(result.confidence) }]}>
                  {result.confidence}%
                </Text>
              </View>
              <View style={styles.confBarBg}>
                <View style={[styles.confBarFill, {
                  width: `${result.confidence}%`,
                  backgroundColor: confColor(result.confidence),
                }]} />
              </View>

              {/* Tip */}
              <View style={styles.tipRow}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={[typography.bodySmall, styles.tipText]}>{result.tip}</Text>
              </View>

              <Text style={[typography.caption, styles.modelTag]}>
                Model: {result.model_used}
              </Text>
            </AppCard>

            {/* Alternatives */}
            {result.alternatives && result.alternatives.length > 1 && (
              <AppCard style={styles.altCard}>
                <Text style={[typography.h4, styles.altTitle]}>Other Possibilities</Text>
                {result.alternatives.slice(1).map((alt, i) => (
                  <View key={i} style={styles.altRow}>
                    <Text style={styles.altNum}>{i + 2}.</Text>
                    <Text style={styles.altCrop}>
                      {alt.crop.charAt(0).toUpperCase() + alt.crop.slice(1)}
                    </Text>
                    <View style={styles.altBarBg}>
                      <View style={[styles.altBarFill, { width: `${alt.confidence}%` }]} />
                    </View>
                    <Text style={styles.altConf}>{alt.confidence}%</Text>
                  </View>
                ))}
              </AppCard>
            )}
          </Animated.View>
        )}

        {/* ── FIELD REFERENCE ─────────────────────── */}
        <AppCard style={styles.refCard}>
          <Text style={[typography.h4, styles.refTitle]}>📋 Field Reference</Text>
          {[
            { name: 'N – Nitrogen',    desc: 'Ratio of Nitrogen in soil (mg/kg)' },
            { name: 'P – Phosphorus',  desc: 'Ratio of Phosphorus in soil (mg/kg)' },
            { name: 'K – Potassium',   desc: 'Ratio of Potassium in soil (mg/kg)' },
            { name: 'Temperature',     desc: 'Avg temperature of the region (°C)' },
            { name: 'Humidity',        desc: 'Relative humidity in the air (%)' },
            { name: 'Soil pH',         desc: 'pH value of soil (0 = acid, 14 = alkaline)' },
            { name: 'Rainfall',        desc: 'Average annual rainfall (mm)' },
          ].map((item, i) => (
            <View key={i} style={styles.refRow}>
              <Text style={styles.refName}>{item.name}</Text>
              <Text style={[typography.caption, styles.refDesc]}>{item.desc}</Text>
            </View>
          ))}
        </AppCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer:  { flex: 1, backgroundColor: colors.background },
  container:      { flex: 1 },
  content:        { padding: spacing.lg, paddingBottom: 120 },

  // header
  header:         { marginBottom: spacing.lg },
  backBtn:        { marginBottom: spacing.md },
  backBtnText:    { color: colors.primary, fontSize: 15, fontWeight: '600' },
  headerCenter:   { alignItems: 'center' },
  headerEmoji:    { fontSize: 48, marginBottom: spacing.sm },
  headerTitle:    { color: colors.primary, fontWeight: '800', textAlign: 'center' },
  headerSub:      { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },

  // badge
  badgeRow:       { alignItems: 'center', marginBottom: spacing.xl },
  badge:          { backgroundColor: colors.primary + '18', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: colors.primary + '40' },
  badgeText:      { fontSize: 12, color: colors.primary, fontWeight: '600' },

  // form
  formCard:       { marginBottom: spacing.xl },
  formTitle:      { color: colors.text, marginBottom: spacing.lg, fontWeight: '700' },
  fieldRow:       { marginBottom: spacing.sm },
  resetBtn:       { marginTop: spacing.md, alignItems: 'center' },
  resetText:      { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },

  // error
  errorCard:      { backgroundColor: '#FEE2E2', borderRadius: 16, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl },
  errorIcon:      { fontSize: 28, marginBottom: spacing.sm },
  errorText:      { color: '#DC2626', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // result
  resultCard:     { marginBottom: spacing.lg, backgroundColor: colors.primary + '10', borderWidth: 1.5, borderColor: colors.primary + '40' },
  resultHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  resultEmoji:    { fontSize: 56, marginRight: spacing.lg },
  resultHeaderText: { flex: 1 },
  resultCrop:     { color: colors.primary, fontWeight: '800', fontSize: 26 },
  resultSeason:   { color: colors.textSecondary, marginTop: 2 },

  confRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  confLabel:      { fontSize: 13, fontWeight: '600', color: colors.text },
  confValue:      { fontSize: 14, fontWeight: '800' },
  confBarBg:      { height: 10, borderRadius: 5, backgroundColor: '#E5E7EB', marginBottom: spacing.lg, overflow: 'hidden' },
  confBarFill:    { height: 10, borderRadius: 5 },

  tipRow:         { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  tipIcon:        { fontSize: 16, marginRight: 8, marginTop: 1 },
  tipText:        { flex: 1, color: colors.textSecondary, lineHeight: 20 },
  modelTag:       { color: colors.textMuted, textAlign: 'right', marginTop: 4 },

  // alternatives
  altCard:        { marginBottom: spacing.xl },
  altTitle:       { color: colors.text, marginBottom: spacing.md, fontWeight: '700' },
  altRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  altNum:         { fontSize: 13, color: colors.textMuted, width: 20 },
  altCrop:        { fontSize: 13, fontWeight: '600', color: colors.text, width: 90 },
  altBarBg:       { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB', marginHorizontal: 8, overflow: 'hidden' },
  altBarFill:     { height: 6, borderRadius: 3, backgroundColor: colors.primary + '70' },
  altConf:        { fontSize: 12, color: colors.textSecondary, width: 38, textAlign: 'right' },

  // reference
  refCard:        { marginBottom: spacing.xl },
  refTitle:       { color: colors.text, marginBottom: spacing.md, fontWeight: '700' },
  refRow:         { marginBottom: spacing.sm },
  refName:        { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  refDesc:        { color: colors.textSecondary },
});
