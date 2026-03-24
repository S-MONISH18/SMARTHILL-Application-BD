import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import StatTile from '../../components/StatTile';
import Badge from '../../components/Badge';
import FarmSummary from '../../components/FarmSummary';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

export default function FarmerDashboardScreen() {
  const [areaSize, setAreaSize] = React.useState('2.5');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [currentIP, setCurrentIP] = useState(null);
  const [connectedIP, setConnectedIP] = useState(null);

  const LOCAL_IP = '192.168.1.100';
  const nodeCount = 2;
  const motorCount = 3;
  const valveCount = 4;

  // Network detection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('📡 Network State (Farmer):', state);
      if (state.isConnected && state.type === 'wifi' && state.details) {
        const ip = state.details.ipAddress || null;
        console.log('🌐 Detected WIFI IP (Farmer):', ip);
        setCurrentIP(ip);
        setConnectedIP(ip);
      } else {
        setCurrentIP(null);
        console.log('❌ No WIFI connection (Farmer), type:', state.type);
      }
    });

    NetInfo.fetch().then((state) => {
      console.log('Initial Network State (Farmer):', state);
      if (state.isConnected && state.type === 'wifi' && state.details) {
        const ip = state.details.ipAddress || null;
        setCurrentIP(ip);
        setConnectedIP(ip);
      }
    });

    return unsubscribe;
  }, []);

  const getModeLabel = () => {
    if (isOfflineMode) return '🔴 OFFLINE';
    if (currentIP === LOCAL_IP) return '🟢 LOCAL IP';
    if (currentIP) return `🟡 REMOTE (${currentIP})`;
    return '⚫ NO NETWORK';
  };

  const getModeColor = () => {
    if (isOfflineMode) return '#DC2626';
    if (currentIP === LOCAL_IP) return '#16A34A';
    if (currentIP) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[typography.h2, styles.brand]}>HillSmart</Text>
            <Text style={[typography.bodySmall, styles.subtitle]}>
              Smart farm monitoring
            </Text>
          </View>
          <View style={[styles.headerBox, { borderColor: getModeColor() }]}> 
            <View style={styles.modeRow}>
              <View style={[styles.statusDot, { backgroundColor: getModeColor() }]} />
              <View style={styles.modeSection}>
                <Text style={styles.modeLabel}>{getModeLabel()}</Text>
                <Text style={styles.modeDetails}>{isOfflineMode ? 'Cached data' : 'Live data'}</Text>
              </View>
            </View>
            <View style={styles.toggleSection}>
              <Text style={styles.toggleText}>Offline mode</Text>
              <Switch
                value={isOfflineMode}
                onValueChange={setIsOfflineMode}
                trackColor={{ false: '#E5E7EB', true: colors.primaryLight }}
              />
            </View>
          </View>
        </View>

        <FarmSummary
          nodeCount={nodeCount}
          motorCount={motorCount}
          valveCount={valveCount}
          areaSize={areaSize}
        />

        <AppCard style={styles.areaCard}>
          <InputField
            label="Farm Area (acres)"
            placeholder="Enter area size"
            value={areaSize}
            onChangeText={setAreaSize}
            icon={<Text style={styles.inputIcon}>🌾</Text>}
          />
          <PrimaryButton title="Update Area" onPress={() => {}} />
        </AppCard>

        <View style={styles.welcomeBanner}>
          <Text style={[typography.h3, styles.welcomeTitle]}>🌱 Welcome back!</Text>
          <Text style={[typography.body, styles.welcomeText]}>
            Your farm is running smoothly. All sensors are active and motors are ready.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Live Sensor Data</Text>

          <AppCard style={styles.sensorCard}>
            <View style={styles.nodeHeader}>
              <Text style={[typography.label, styles.nodeTitle]}>Node 1</Text>
              <Badge text="Online" variant="success" size="small" />
            </View>

            <View style={styles.sensorGrid}>
              <StatTile
                label="Temperature"
                value="24°C"
                icon={<Text style={styles.sensorIcon}>🌡️</Text>}
              />
              <StatTile
                label="Soil pH"
                value="6.8"
                icon={<Text style={styles.sensorIcon}>🧪</Text>}
              />
            </View>

            <View style={styles.sensorGrid}>
              <StatTile
                label="Water Level"
                value="85%"
                icon={<Text style={styles.sensorIcon}>💧</Text>}
              />
              <StatTile
                label="Light"
                value="Medium"
                icon={<Text style={styles.sensorIcon}>☀️</Text>}
              />
            </View>
          </AppCard>

          <AppCard style={styles.sensorCard}>
            <View style={styles.nodeHeader}>
              <Text style={[typography.label, styles.nodeTitle]}>Node 2</Text>
              <Badge text="Online" variant="success" size="small" />
            </View>

            <View style={styles.sensorGrid}>
              <StatTile
                label="Temperature"
                value="26°C"
                icon={<Text style={styles.sensorIcon}>🌡️</Text>}
              />
              <StatTile
                label="Soil pH"
                value="7.2"
                icon={<Text style={styles.sensorIcon}>🧪</Text>}
              />
            </View>

            <View style={styles.sensorGrid}>
              <StatTile
                label="Water Level"
                value="92%"
                icon={<Text style={styles.sensorIcon}>💧</Text>}
              />
              <StatTile
                label="Light"
                value="High"
                icon={<Text style={styles.sensorIcon}>☀️</Text>}
              />
            </View>
          </AppCard>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Motor Controls</Text>

          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View>
                <Text style={[typography.label, styles.controlTitle]}>
                  Irrigation Pump 1
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  Currently active
                </Text>
              </View>
              <Badge text="ON" variant="success" />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButtonOff}>
                <Text style={[typography.buttonSmall, styles.controlButtonTextOff]}>
                  Turn OFF
                </Text>
              </TouchableOpacity>
            </View>
          </AppCard>

          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View>
                <Text style={[typography.label, styles.controlTitle]}>
                  Irrigation Pump 2
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  Ready to activate
                </Text>
              </View>
              <Badge text="OFF" variant="default" />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButtonOn}>
                <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                  Turn ON
                </Text>
              </TouchableOpacity>
            </View>
          </AppCard>

          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View>
                <Text style={[typography.label, styles.controlTitle]}>
                  Irrigation Pump 3
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  Standby mode
                </Text>
              </View>
              <Badge text="OFF" variant="default" />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButtonOn}>
                <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                  Turn ON
                </Text>
              </TouchableOpacity>
            </View>
          </AppCard>

          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View>
                <Text style={[typography.label, styles.controlTitle]}>
                  Fertilizer Dispenser
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  Ready to activate
                </Text>
              </View>
              <Badge text="OFF" variant="default" />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButtonOn}>
                <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                  Turn ON
                </Text>
              </TouchableOpacity>
            </View>
          </AppCard>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Farm Insights</Text>
          <AppCard style={styles.insightsCard}>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>📊</Text>
              <View style={styles.insightContent}>
                <Text style={[typography.label, styles.insightTitle]}>
                  Optimal Conditions
                </Text>
                <Text style={[typography.bodySmall, styles.insightText]}>
                  Soil pH and moisture levels are ideal for crop growth
                </Text>
              </View>
            </View>
          </AppCard>
        </View>

        <View style={styles.footer}>
          <Text style={[typography.caption, styles.lastUpdated]}>
            Last updated: 2 minutes ago
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  brand: {
    color: colors.primary,
    marginBottom: spacing.xs / 2,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  headerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 130,
    maxWidth: 170,
    justifyContent: 'space-between',
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  modeSection: {
    marginBottom: spacing.xs,
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  modeDetails: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
  },
  welcomeBanner: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    color: colors.surface,
    opacity: 0.9,
  },
  areaCard: {
    marginBottom: spacing.xl,
  },
  inputIcon: {
    fontSize: 18,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.text,
  },
  sensorCard: {
    marginBottom: spacing.lg,
  },
  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nodeTitle: {
    color: colors.primary,
  },
  sensorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sensorIcon: {
    fontSize: 20,
  },
  controlCard: {
    marginBottom: spacing.lg,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  controlTitle: {
    marginBottom: spacing.xs / 2,
  },
  controlStatus: {
    color: colors.textSecondary,
  },
  controlButtons: {
    flexDirection: 'row',
  },
  controlButtonOn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonOff: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonTextOn: {
    color: colors.surface,
  },
  controlButtonTextOff: {
    color: colors.surface,
  },
  insightsCard: {
    padding: spacing.lg,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    marginBottom: spacing.xs / 2,
  },
  insightText: {
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  lastUpdated: {
    color: colors.textMuted,
  },
});