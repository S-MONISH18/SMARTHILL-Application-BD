import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
import MenuButton from '../../components/MenuButton';
import {
  fetchThingSpeakStatus,
  setDeviceStatus,
  LOCK_TIME_SECONDS,
} from '../../services/thingSpeakControlService';

export default function FarmerDashboardScreen() {
  const navigation = useNavigation();
  const [areaSize, setAreaSize] = React.useState('2.5');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [currentIP, setCurrentIP] = useState(null);
  const [connectedIP, setConnectedIP] = useState(null);

  // ThingSpeak device states
  const [motorStatus, setMotorStatus] = useState(false);
  const [fertilizerStatus, setFertilizerStatus] = useState(false);
  const [valve1Status, setValve1Status] = useState(false);
  const [valve2Status, setValve2Status] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const LOCAL_IP = '192.168.1.100';
  const nodeCount = 0;
  const motorCount = 2;
  const valveCount = 2;

  // Fetch ThingSpeak status on mount
  useEffect(() => {
    loadThingSpeakStatus();
  }, []);

  const loadThingSpeakStatus = async () => {
    try {
      setLoadingDevices({ motor: true, fertilizer: true, valve1: true, valve2: true });
      const status = await fetchThingSpeakStatus();
      setMotorStatus(status.motor);
      setFertilizerStatus(status.fertilizer);
      setValve1Status(status.valve1);
      setValve2Status(status.valve2);
      console.log('✅ ThingSpeak status loaded:', status);
    } catch (err) {
      console.error('❌ Failed to load ThingSpeak status:', err);
      Alert.alert('Error', 'Failed to load device status from ThingSpeak');
    } finally {
      setLoadingDevices({});
    }
  };

  // Lock timer effect
  useEffect(() => {
    let interval;
    if (lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
    }
    return () => clearInterval(interval);
  }, [lockTimer, isLocked]);

  // Handle device toggle
  const handleDeviceToggle = async (device) => {
    if (isLocked) {
      Alert.alert('Locked', `Please wait ${lockTimer} seconds before next action`);
      return;
    }

    const statusMap = {
      motor: motorStatus,
      fertilizer: fertilizerStatus,
      valve1: valve1Status,
      valve2: valve2Status,
    };

    const currentStatus = {
      motor: motorStatus,
      fertilizer: fertilizerStatus,
      valve1: valve1Status,
      valve2: valve2Status,
    };

    try {
      setLoadingDevices((prev) => ({ ...prev, [device]: true }));
      
      const newStatus = !statusMap[device];
      await setDeviceStatus(device, newStatus, currentStatus);

      // Update local state
      switch (device) {
        case 'motor':
          setMotorStatus(newStatus);
          break;
        case 'fertilizer':
          setFertilizerStatus(newStatus);
          break;
        case 'valve1':
          setValve1Status(newStatus);
          break;
        case 'valve2':
          setValve2Status(newStatus);
          break;
      }

      // Set lock
      setIsLocked(true);
      setLockTimer(LOCK_TIME_SECONDS);
      
      console.log(`✅ ${device} toggled to ${newStatus}`);
    } catch (err) {
      console.error(`❌ Failed to toggle ${device}:`, err);
      Alert.alert('Error', `Failed to control ${device}: ${err.message}`);
    } finally {
      setLoadingDevices((prev) => ({ ...prev, [device]: false }));
    }
  };

  // Network detection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('📡 Network State (Farmer):', state);
      if (state.isConnected && (state.type === 'wifi' || state.type === 'cellular') && state.details) {
        const ip = state.details.ipAddress || null;
        console.log('🌐 Detected network IP (Farmer):', ip);
        setCurrentIP(ip);
        setConnectedIP(ip);
      } else {
        setCurrentIP(null);
        console.log('❌ No network connection (Farmer), type:', state.type);
      }
    });

    NetInfo.fetch().then((state) => {
      console.log('Initial Network State (Farmer):', state);
      if (state.isConnected && (state.type === 'wifi' || state.type === 'cellular') && state.details) {
        const ip = state.details.ipAddress || null;
        setCurrentIP(ip);
        setConnectedIP(ip);
      }
    });

    return unsubscribe;
  }, []);

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
          <MenuButton
            isOfflineMode={isOfflineMode}
            onOfflineModeChange={setIsOfflineMode}
          />
        </View>

        <FarmSummary
          nodeCount={nodeCount}
          motorCount={motorCount}
          valveCount={valveCount}
          areaSize={areaSize}
        />

        {/* 🔥 REGISTER TRACTOR CARD */}
        <TouchableOpacity
          style={styles.registerTractorCard}
          onPress={() => navigation.navigate('Tractors', { screen: 'RegisterTractor' })}
        >
          <Text style={styles.registerTractorIcon}>🚜</Text>
          <View style={styles.registerTractorContent}>
            <Text style={[typography.h4, styles.registerTractorTitle]}>Register Tractor</Text>
            <Text style={[typography.bodySmall, styles.registerTractorText]}>
              List your tractor and earn extra income
            </Text>
          </View>
          <Text style={styles.registerTractorArrow}>→</Text>
        </TouchableOpacity>

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

        {isLocked && (
          <View style={styles.lockWarning}>
            <Text style={styles.lockWarningText}>⏱️ Please wait {lockTimer}s before next action...</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>Motor Controls</Text>

          {/* Motor */}
          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={styles.controlHeaderLeft}>
                <Text style={[typography.label, styles.controlTitle]}>
                  🔌 Motor Pump
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  {motorStatus ? 'Currently running' : 'Standby mode'}
                </Text>
              </View>
              <Badge text={motorStatus ? 'ON' : 'OFF'} variant={motorStatus ? 'success' : 'default'} />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={[styles.controlButtonOn, motorStatus && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('motor')}
                disabled={loadingDevices.motor || isLocked}
              >
                {loadingDevices.motor ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                    Turn ON
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButtonOff, !motorStatus && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('motor')}
                disabled={loadingDevices.motor || isLocked}
              >
                {loadingDevices.motor ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOff]}>
                    Turn OFF
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </AppCard>

          {/* Fertilizer */}
          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={styles.controlHeaderLeft}>
                <Text style={[typography.label, styles.controlTitle]}>
                  💧 Fertilizer Dispenser
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  {fertilizerStatus ? 'Currently running' : 'Ready to activate'}
                </Text>
              </View>
              <Badge text={fertilizerStatus ? 'ON' : 'OFF'} variant={fertilizerStatus ? 'success' : 'default'} />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={[styles.controlButtonOn, fertilizerStatus && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('fertilizer')}
                disabled={loadingDevices.fertilizer || isLocked}
              >
                {loadingDevices.fertilizer ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                    Turn ON
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButtonOff, !fertilizerStatus && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('fertilizer')}
                disabled={loadingDevices.fertilizer || isLocked}
              >
                {loadingDevices.fertilizer ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOff]}>
                    Turn OFF
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </AppCard>

          {/* Valve 1 */}
          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={styles.controlHeaderLeft}>
                <Text style={[typography.label, styles.controlTitle]}>
                  🚰 Valve 1
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  {valve1Status ? 'Currently open' : 'Closed'}
                </Text>
              </View>
              <Badge text={valve1Status ? 'ON' : 'OFF'} variant={valve1Status ? 'success' : 'default'} />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={[styles.controlButtonOn, valve1Status && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('valve1')}
                disabled={loadingDevices.valve1 || isLocked}
              >
                {loadingDevices.valve1 ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                    Turn ON
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButtonOff, !valve1Status && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('valve1')}
                disabled={loadingDevices.valve1 || isLocked}
              >
                {loadingDevices.valve1 ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOff]}>
                    Turn OFF
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </AppCard>

          {/* Valve 2 */}
          <AppCard style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={styles.controlHeaderLeft}>
                <Text style={[typography.label, styles.controlTitle]}>
                  🚰 Valve 2
                </Text>
                <Text style={[typography.caption, styles.controlStatus]}>
                  {valve2Status ? 'Currently open' : 'Closed'}
                </Text>
              </View>
              <Badge text={valve2Status ? 'ON' : 'OFF'} variant={valve2Status ? 'success' : 'default'} />
            </View>
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={[styles.controlButtonOn, valve2Status && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('valve2')}
                disabled={loadingDevices.valve2 || isLocked}
              >
                {loadingDevices.valve2 ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOn]}>
                    Turn ON
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButtonOff, !valve2Status && styles.controlButtonActive]}
                onPress={() => handleDeviceToggle('valve2')}
                disabled={loadingDevices.valve2 || isLocked}
              >
                {loadingDevices.valve2 ? (
                  <ActivityIndicator color={colors.surface} size="small" />
                ) : (
                  <Text style={[typography.buttonSmall, styles.controlButtonTextOff]}>
                    Turn OFF
                  </Text>
                )}
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
  registerTractorCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerTractorIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  registerTractorContent: {
    flex: 1,
  },
  registerTractorTitle: {
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  registerTractorText: {
    color: colors.textSecondary,
  },
  registerTractorArrow: {
    fontSize: 20,
    color: colors.primary,
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
  controlHeaderLeft: {
    flex: 1,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButtonOn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  controlButtonActive: {
    opacity: 1,
  },
  controlButtonOff: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  controlButtonTextOn: {
    color: colors.surface,
  },
  controlButtonTextOff: {
    color: colors.surface,
  },
  lockWarning: {
    backgroundColor: '#FEF08A',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  lockWarningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
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