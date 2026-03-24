import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import StatTile from '../../components/StatTile';
import PageHeader from '../../components/PageHeader';

export default function FarmDataScreen() {
  const [farmData, setFarmData] = useState({
    nodeCount: 0,
    landArea: 0,
    activeNodes: 0,
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFarmData();
  }, []);

  const loadFarmData = () => {
    setTimeout(() => {
      setFarmData({
        nodeCount: 24,
        landArea: 15.5,
        activeNodes: 22,
        soilMoisture: 65,
        temperature: 28,
        humidity: 72,
      });
    }, 800);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFarmData();
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  const onlinePercent =
    farmData.nodeCount > 0
      ? Math.round((farmData.activeNodes / farmData.nodeCount) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Farm Data" subtitle="Real-time monitoring" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
            title="Soil Moisture"
            value={`${farmData.soilMoisture}%`}
            icon={<Text style={styles.tileIcon}>💧</Text>}
            subtitle="Average across farm"
            trend={farmData.soilMoisture > 60 ? 'Optimal' : 'Needs watering'}
          />
        </View>

        <View style={styles.environmentSection}>
          <Text style={[typography.h3, styles.sectionTitle]}>Environmental Data</Text>

          <View style={styles.envGrid}>
            <View style={styles.envItem}>
              <Text style={styles.envIcon}>🌡️</Text>
              <View style={styles.envText}>
                <Text style={typography.label}>Temperature</Text>
                <Text style={[typography.h2, styles.envValue]}>
                  {farmData.temperature}°C
                </Text>
              </View>
            </View>

            <View style={styles.envItem}>
              <Text style={styles.envIcon}>💨</Text>
              <View style={styles.envText}>
                <Text style={typography.label}>Humidity</Text>
                <Text style={[typography.h2, styles.envValue]}>
                  {farmData.humidity}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.nodesSection}>
          <Text style={[typography.h3, styles.sectionTitle]}>Node Distribution</Text>
          <Text style={typography.body}>
            Nodes are strategically placed across {farmData.landArea} acres of farmland,
            providing comprehensive coverage for irrigation and monitoring systems.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tileIcon: {
    fontSize: 24,
  },
  environmentSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  sectionTitle: {
    color: colors.primary,
    marginBottom: spacing.md,
  },
  envGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  envItem: {
    alignItems: 'center',
    flex: 1,
  },
  envIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  envText: {
    alignItems: 'center',
  },
  envValue: {
    color: colors.primary,
    marginTop: spacing.xs,
  },
  nodesSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
});