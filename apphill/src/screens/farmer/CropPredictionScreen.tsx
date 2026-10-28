import React, { useState, useRef } from 'react';
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

// Crop emoji helper
const CROP_EMOJIS = {
  rice: '🌾',
  maize: '🌽',
  chickpea: '🫘',
  kidneybeans: '🫘',
  pigeonpeas: '🌿',
  mothbeans: '🌿',
  mungbean: '🌿',
  blackgram: '🌿',
  lentil: '🫘',
  pomegranate: '🍎',
  banana: '🍌',
  mango: '🥭',
  grapes: '🍇',
  watermelon: '🍉',
  muskmelon: '🍈',
  apple: '🍎',
  orange: '🍊',
  papaya: '🍈',
  coconut: '🥥',
  cotton: '☁️',
  jute: '🌾',
  coffee: '☕',
};

const getCropEmoji = (name) => CROP_EMOJIS[name?.toLowerCase()] || '🌱';

// Human-friendly suitability evaluation
const getMatchInfo = (confidence) => {
  if (confidence >= 80) {
    return {
      status: 'Highly Recommended',
      color: '#15803D',
      bgColor: '#DCFCE7',
      borderColor: '#86EFAC',
      desc: 'Your soil nutrients (NPK) and climate conditions are strongly aligned and optimal for this crop.',
    };
  }
  if (confidence >= 60) {
    return {
      status: 'Good Match',
      color: '#B45309',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      desc: 'This crop is suitable for your soil with standard irrigation and fertilization practices.',
    };
  }
  return {
    status: 'Moderate Match',
    color: '#B91C1C',
    bgColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    desc: 'Marginally compatible. Review soil conditioning or check the alternative crops below.',
  };
};

export default function CropPredictionScreen() {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  // form state
  const [values, setValues] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '',
  });
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);
  const [error,   setError]     = useState(null);

  // animated card
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
        // Smoothly scroll down to the result card so the user sees it immediately
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
    } catch (err) {
      console.error('❌ Predict error:', err);
      setError('Could not reach the server. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
    setResult(null);
    setError(null);
  };

  const matchInfo = result ? getMatchInfo(result.confidence) : null;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

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
            title={loading ? 'Analyzing Soil & Climate...' : '🌿  Predict Crop'}
            onPress={handlePredict}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={{ marginTop: 14 }} color={colors.primary} size="large" />}

          {result && (
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>↺  Reset Values</Text>
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

        {/* ── RESULT SECTION WITH GENEROUS MARGINS ── */}
        {result && matchInfo && (
          <Animated.View style={[styles.resultSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Section Title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Recommendation Result</Text>
              <Text style={styles.sectionSubtitle}>
                Best suited crop based on your NPK and regional conditions
              </Text>
            </View>

            {/* Main Crop Result Card */}
            <AppCard style={styles.resultCard}>
              
              {/* Top Suitability Badge */}
              <View style={[styles.statusBadge, { backgroundColor: matchInfo.bgColor, borderColor: matchInfo.borderColor }]}>
                <Text style={[styles.statusBadgeText, { color: matchInfo.color }]}>
                  ★ {matchInfo.status} · {result.confidence}% Match
                </Text>
              </View>

              {/* Crop Hero Presentation */}
              <View style={styles.cropHero}>
                <View style={styles.emojiCircle}>
                  <Text style={styles.cropHeroEmoji}>
                    {result.emoji || getCropEmoji(result.crop)}
                  </Text>
                </View>
                <View style={styles.cropHeroDetails}>
                  <Text style={styles.cropHeroLabel}>Recommended Crop</Text>
                  <Text style={styles.cropHeroTitle}>
                    {result.crop.charAt(0).toUpperCase() + result.crop.slice(1)}
                  </Text>
                  <View style={styles.seasonPill}>
                    <Text style={styles.seasonPillText}>🗓️ {result.season} Season</Text>
                  </View>
                </View>
              </View>

              {/* Match Explanation */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>
                  {matchInfo.desc}
                </Text>
              </View>

              {/* Compatibility Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Soil &amp; Climate Compatibility</Text>
                  <Text style={[styles.progressValue, { color: matchInfo.color }]}>
                    {result.confidence}%
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${result.confidence}%`, backgroundColor: matchInfo.color },
                    ]}
                  />
                </View>
              </View>

              {/* Farming Advice Box */}
              {result.tip && (
                <View style={styles.adviceBox}>
                  <View style={styles.adviceHeader}>
                    <Text style={styles.adviceIcon}>💡</Text>
                    <Text style={styles.adviceTitle}>Cultivation &amp; Soil Advice</Text>
                  </View>
                  <Text style={styles.adviceText}>{result.tip}</Text>
                </View>
              )}

            </AppCard>

            {/* Other Suitable Crops Card */}
            {result.alternatives && result.alternatives.length > 1 && (
              <AppCard style={styles.altCard}>
                <View style={styles.altHeader}>
                  <Text style={styles.altTitle}>🌱 Other Suitable Options</Text>
                  <Text style={styles.altSubtitle}>
                    Secondary crops that also match your soil conditions:
                  </Text>
                </View>

                {result.alternatives.slice(1).map((alt, i) => (
                  <View key={i} style={styles.altItem}>
                    <View style={styles.altRankBadge}>
                      <Text style={styles.altRankText}>#{i + 2}</Text>
                    </View>
                    <Text style={styles.altEmoji}>{getCropEmoji(alt.crop)}</Text>
                    <View style={styles.altDetails}>
                      <Text style={styles.altCropName}>
                        {alt.crop.charAt(0).toUpperCase() + alt.crop.slice(1)}
                      </Text>
                      <View style={styles.altBarBg}>
                        <View
                          style={[
                            styles.altBarFill,
                            { width: `${Math.min(alt.confidence * 2, 100)}%` },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.altScoreBadge}>
                      <Text style={styles.altScoreText}>{alt.confidence}%</Text>
                    </View>
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
  content:        { padding: spacing.lg, paddingBottom: 140 },

  // Header
  header:         { marginBottom: spacing.lg },
  backBtn:        { marginBottom: spacing.md },
  backBtnText:    { color: colors.primary, fontSize: 15, fontWeight: '600' },
  headerCenter:   { alignItems: 'center' },
  headerEmoji:    { fontSize: 44, marginBottom: spacing.xs },
  headerTitle:    { color: colors.primary, fontWeight: '800', textAlign: 'center' },
  headerSub:      { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },

  // Form Card
  formCard:       { marginBottom: spacing.xl },
  formTitle:      { color: colors.text, marginBottom: spacing.lg, fontWeight: '700' },
  fieldRow:       { marginBottom: spacing.sm },
  resetBtn:       { marginTop: spacing.md, alignItems: 'center', paddingVertical: 8 },
  resetText:      { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },

  // Error Card
  errorCard:      { backgroundColor: '#FEE2E2', borderRadius: 16, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl },
  errorIcon:      { fontSize: 28, marginBottom: spacing.sm },
  errorText:      { color: '#DC2626', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Result Section (Generous Margins & Separation)
  resultSection:  {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Primary Result Card
  resultCard: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    elevation: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Crop Hero
  cropHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emojiCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  cropHeroEmoji: {
    fontSize: 40,
  },
  cropHeroDetails: {
    flex: 1,
  },
  cropHeroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cropHeroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  seasonPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  seasonPillText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },

  // Explanation Box
  explanationBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  explanationText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },

  // Progress Bar
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 5,
  },

  // Advice Box
  adviceBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  adviceIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adviceText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    paddingLeft: 22,
  },

  // Alternatives Card
  altCard: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },
  altHeader: {
    marginBottom: spacing.md,
  },
  altTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  altSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  altItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  altRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  altRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  altEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  altDetails: {
    flex: 1,
    marginRight: 10,
  },
  altCropName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  altBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  altBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  altScoreBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  altScoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // Field Reference
  refCard: {
    marginBottom: spacing.xl,
  },
  refTitle: {
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  refRow: {
    marginBottom: spacing.sm,
  },
  refName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  refDesc: {
    color: colors.textSecondary,
  },
});
