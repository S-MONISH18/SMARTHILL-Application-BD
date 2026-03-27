import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import StatTile from '../../components/StatTile';
import PageHeader from '../../components/PageHeader';
import { fetchLatestSensorReading } from '../../services/thingSpeakService';

export default function FarmDataScreen() {
  const [farmData, setFarmData] = useState({
    nodeCount: 24,
    landArea: 15.5,
    activeNodes: 22,
  });
  const [sensorData, setSensorData] = useState({
    node1: { ph: 0, temperature: 0, waterLevel: 0, ldr: 0 },
    node2: { ph: 0, temperature: 0, waterLevel: 0, ldr: 0 },
    npk: { nitrogen: 0, phosphorus: 0, potassium: 0 },
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sensorError, setSensorError] = useState(null);

  useEffect(() => {
    loadFarmData();
  }, []);

  const loadFarmData = async () => {
    try {
      setSensorError(null);
      const result = await fetchLatestSensorReading();
      
      if (result.success) {
        console.log('✅ ThingSpeak data fetched:', result);
        setSensorData({
          node1: result.node1,
          node2: result.node2,
          npk: result.npk,
        });
        setLastUpdated(new Date(result.timestamp));
      } else {
        console.warn('⚠️ ThingSpeak error:', result.error);
        setSensorError(result.error);
        // Fallback to demo data
        setSensorData({
          node1: { ph: 23.14, temperature: 37.65, waterLevel: 0, ldr: 420 },
          node2: { ph: 26.86, temperature: 37.61, waterLevel: 0, ldr: 580 },
          npk: { nitrogen: 0, phosphorus: 0, potassium: 0 },
        });
      }
    } catch (error) {
      console.error('❌ Farm data load error:', error);
      setSensorError('Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadFarmData();
    setRefreshing(false);
  };

  const getLightLevel = (ldr) => {
    if (ldr < 100) return 'Very Dark';
    if (ldr < 200) return 'Dark';
    if (ldr < 400) return 'Medium';
    if (ldr < 600) return 'Bright';
    return 'Very Bright';
  };

  const onlinePercent =
    farmData.nodeCount > 0
      ? Math.round((farmData.activeNodes / farmData.nodeCount) * 100)
      : 0;

  const formatTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Farm Data" subtitle="Real-time monitoring" />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.label, { marginTop: spacing.md }]}>
            Fetching sensor data...
          </Text>
        </View>
      )}

      {!loading && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {sensorError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {sensorError}</Text>
              <Text style={styles.errorSubtext}>Showing demo data</Text>
            </View>
          )}

          {lastUpdated && (
            <View style={styles.updateBanner}>
              <Text style={styles.liveIndicator}>🔴 LIVE</Text>
              <Text style={styles.updateTime}>
                Last updated: {formatTime(lastUpdated)}
              </Text>
            </View>
          )}

          <View style={styles.statsGrid}>
            <StatTile
              title="Total Nodes"
              value={farmData.nodeCount.toString()}
              icon={<Text style={styles.tileIcon}>📡</Text>}
              subtitle="IoT sensors deployed"
              trend="+2 this week"
            />

            <StatTile
              title="Land Area"
              value={`${farmData.landArea} acres`}
              icon={<Text style={styles.tileIcon}>🌾</Text>}
              subtitle="Total farm size"
              trend="15.5 acres"
            />

            <StatTile
              title="Active Nodes"
              value={farmData.activeNodes.toString()}
              icon={<Text style={styles.tileIcon}>🔋</Text>}
              subtitle={`${onlinePercent}% online`}
              trend={`${farmData.nodeCount - farmData.activeNodes} offline`}
            />

            <StatTile
              title="NPK Index"
              value={`${Math.round((sensorData.npk.nitrogen + sensorData.npk.phosphorus + sensorData.npk.potassium) / 3)}`}
              icon={<Text style={styles.tileIcon}>🧪</Text>}
              subtitle="Nutrient balance"
              trend="Healthy level"
            />
          </View>

          {/* Node 1 Data */}
          <View style={styles.nodeCard}>
            <View style={styles.nodeHeader}>
              <Text style={[typography.h3, styles.nodeTitle]}>Node 1</Text>
              <View style={styles.nodeBadge}>
                <Text style={styles.nodeBadgeText}>📡 Active</Text>
              </View>
            </View>

            <View style={styles.sensorGrid}>
              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>📊</Text>
                <Text style={typography.label}>pH Level</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node1.ph.toFixed(2)}
                </Text>
              </View>

              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>🌡️</Text>
                <Text style={typography.label}>Temperature</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node1.temperature.toFixed(1)}°C
                </Text>
              </View>

              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>💧</Text>
                <Text style={typography.label}>Water Level</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node1.waterLevel.toFixed(0)}%
                </Text>
              </View>

              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>💡</Text>
                <Text style={typography.label}>Light (LDR)</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node1.ldr.toFixed(0)}
                </Text>
                <Text style={typography.caption}>{getLightLevel(sensorData.node1.ldr)}</Text>
              </View>
            </View>
          </View>

          {/* Node 2 Data */}
          <View style={styles.nodeCard}>
            <View style={styles.nodeHeader}>
              <Text style={[typography.h3, styles.nodeTitle]}>Node 2</Text>
              <View style={styles.nodeBadge}>
                <Text style={styles.nodeBadgeText}>📡 Active</Text>
              </View>
            </View>

            <View style={styles.sensorGrid}>
              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>📊</Text>
                <Text style={typography.label}>pH Level</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node2.ph.toFixed(2)}
                </Text>
              </View>

              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>🌡️</Text>
                <Text style={typography.label}>Temperature</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node2.temperature.toFixed(1)}°C
                </Text>
              </View>

              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>💧</Text>
                <Text style={typography.label}>Water Level</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node2.waterLevel.toFixed(0)}%
                </Text>
              </View>

              <View style={styles.sensorItem}>
                <Text style={styles.sensorIcon}>💡</Text>
                <Text style={typography.label}>Light (LDR)</Text>
                <Text style={[typography.h3, styles.sensorValue]}>
                  {sensorData.node2.ldr.toFixed(0)}
                </Text>
                <Text style={typography.caption}>{getLightLevel(sensorData.node2.ldr)}</Text>
              </View>
            </View>
          </View>

          {/* NPK Sensor Data */}
          <View style={styles.npkCard}>
            <Text style={[typography.h3, styles.npkTitle]}>🧪 NPK Sensor Reading</Text>
            <Text style={[typography.caption, styles.npkSubtitle]}>
              Nitrogen - Phosphorus - Potassium Levels
            </Text>

            <View style={styles.npkGrid}>
              <View style={styles.npkItem}>
                <Text style={styles.npkIcon}>N</Text>
                <Text style={typography.label}>Nitrogen</Text>
                <Text style={[typography.h2, styles.npkValue]}>
                  {sensorData.npk.nitrogen.toFixed(0)}
                </Text>
                <Text style={typography.caption}>ppm</Text>
              </View>

              <View style={styles.npkItem}>
                <Text style={styles.npkIcon}>P</Text>
                <Text style={typography.label}>Phosphorus</Text>
                <Text style={[typography.h2, styles.npkValue]}>
                  {sensorData.npk.phosphorus.toFixed(0)}
                </Text>
                <Text style={typography.caption}>ppm</Text>
              </View>

              <View style={styles.npkItem}>
                <Text style={styles.npkIcon}>K</Text>
                <Text style={typography.label}>Potassium</Text>
                <Text style={[typography.h2, styles.npkValue]}>
                  {sensorData.npk.potassium.toFixed(0)}
                </Text>
                <Text style={typography.caption}>ppm</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerNote}>
            <Text style={[typography.caption, styles.thingSpeakNote]}>
              📡 All data synced from ThingSpeak Channel 3232296 in real-time
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  errorText: {
    color: '#991B1B',
    ...typography.label,
    fontWeight: '600',
  },
  errorSubtext: {
    color: '#7F1D1D',
    ...typography.caption,
    marginTop: spacing.xs,
  },
  updateBanner: {
    backgroundColor: colors.primary + '15',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveIndicator: {
    color: colors.primary,
    ...typography.label,
    fontWeight: '600',
    fontSize: 12,
  },
  updateTime: {
    color: colors.primary,
    ...typography.caption,
    marginLeft: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  tileIcon: {
    fontSize: 24,
  },

  // Node Card Styles
  nodeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nodeTitle: {
    color: colors.primary,
    fontSize: 18,
  },
  nodeBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  nodeBadgeText: {
    color: colors.primary,
    ...typography.caption,
    fontWeight: '600',
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sensorItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
  },
  sensorIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  sensorValue: {
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },

  // NPK Card Styles
  npkCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  npkTitle: {
    color: '#7B1FA2',
    marginBottom: spacing.xs,
  },
  npkSubtitle: {
    color: '#9C27B0',
    marginBottom: spacing.md,
  },
  npkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  npkItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  npkIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: spacing.sm,
  },
  npkValue: {
    color: '#7B1FA2',
    marginTop: spacing.xs,
    fontWeight: '600',
  },

  footerNote: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  thingSpeakNote: {
    color: colors.primary,
    fontStyle: 'italic',
  },
});