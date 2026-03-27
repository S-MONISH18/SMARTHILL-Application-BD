import React, { useState } from 'react';
import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

/**
 * MenuButton - Access FAQ, ChatBox, Notifications, and Settings
 * Usage: <PageHeader title="Title" rightElement={<MenuButton networkStatus={status} onOfflineModeChange={handler} />} />
 */
export default function MenuButton({ networkStatus, onOfflineModeChange, isOfflineMode }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNavigate = (screen) => {
    setMenuVisible(false);
    // Add small delay to ensure modal closes smoothly
    setTimeout(() => {
      navigation.navigate(screen);
    }, 100);
  };

  // Determine network status display
  const getNetworkStatus = () => {
    if (isOfflineMode) return { label: '🔴 OFFLINE', color: '#DC2626', detail: 'Cached data' };
    if (networkStatus === 'local') return { label: '🟢 LOCAL IP', color: '#16A34A', detail: 'Live data' };
    if (networkStatus === 'remote') return { label: '🟡 REMOTE', color: '#F59E0B', detail: 'Live data' };
    return { label: '⚫ NO NETWORK', color: '#6B7280', detail: 'No connection' };
  };

  const networkInfo = getNetworkStatus();

  const menuItems = [
    {
      id: 'chat',
      icon: '💬',
      label: 'AI Chat',
      description: 'Ask farming questions',
      screen: 'ChatBox',
      type: 'nav',
    },
    {
      id: 'faq',
      icon: '❓',
      label: 'FAQ',
      description: 'Help & Support',
      screen: 'FAQ',
      type: 'nav',
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      description: 'View alerts',
      screen: 'Notifications',
      type: 'nav',
    },
    {
      id: 'network',
      icon: '⚙️',
      label: 'Network Settings',
      description: networkInfo.label,
      type: 'setting',
    },
  ];

  return (
    <>
      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity activeOpacity={1} style={styles.menu}>
              {/* Header */}
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>More</Text>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuItems} scrollEnabled={false}>
                {menuItems.map((item) => (
                  <View key={item.id}>
                    {item.type === 'nav' ? (
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleNavigate(item.screen)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                        <View style={styles.itemContent}>
                          <Text style={styles.itemLabel}>{item.label}</Text>
                          <Text style={styles.itemDescription}>{item.description}</Text>
                        </View>
                        <Text style={styles.itemArrow}>›</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.SettingItem}>
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                        <View style={[styles.itemContent, { flex: 1 }]}>
                          <Text style={styles.itemLabel}>{item.label}</Text>
                          <View style={styles.networkStatusRow}>
                            <View
                              style={[
                                styles.networkStatusDot,
                                { backgroundColor: networkInfo.color },
                              ]}
                            />
                            <Text
                              style={[
                                styles.networkStatusText,
                                { color: networkInfo.color },
                              ]}
                            >
                              {networkInfo.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Offline Mode Toggle - Only show in Network Settings */}
                    {item.type === 'setting' && (
                      <View style={styles.offlineModeToggle}>
                        <View style={styles.toggleContent}>
                          <Text style={styles.toggleLabel}>Offline Mode</Text>
                          <Text style={styles.toggleDescription}>
                            {isOfflineMode ? 'Using cached data' : 'Using live data'}
                          </Text>
                        </View>
                        <Switch
                          value={isOfflineMode || false}
                          onValueChange={onOfflineModeChange}
                          trackColor={{ false: '#E5E7EB', true: colors.primaryLight }}
                          thumbColor={isOfflineMode ? colors.primary : '#f4f3f4'}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: spacing.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '700',
  },

  // Modal Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingRight: spacing.md,
  },

  menuContainer: {
    alignItems: 'flex-end',
  },

  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 290,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },

  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: colors.primary,
  },

  menuTitle: {
    ...typography.h3,
    color: '#fff',
    fontWeight: '700',
  },

  closeIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },

  menuItems: {
    maxHeight: 420,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  SettingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  itemIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },

  itemContent: {
    flex: 1,
  },

  itemLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },

  itemDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  networkStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  networkStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },

  networkStatusText: {
    ...typography.caption,
    fontWeight: '600',
  },

  itemArrow: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },

  offlineModeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  toggleContent: {
    flex: 1,
  },

  toggleLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
  },

  toggleDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
});
