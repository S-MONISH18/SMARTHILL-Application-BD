import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * ScreenHeader with Menu Button for accessing FAQ, ChatBox, Notifications
 * Usage: <ScreenHeader title="Screen Title" />
 */
export default function ScreenHeader({ title, subtitle }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    {
      id: 'chat',
      label: '💬 AI Chat Assistant',
      description: 'Ask farming questions',
      action: () => {
        setMenuVisible(false);
        navigation.navigate('ChatBox');
      },
    },
    {
      id: 'faq',
      label: '❓ FAQ & Support',
      description: 'Frequently asked questions',
      action: () => {
        setMenuVisible(false);
        navigation.navigate('FAQ');
      },
    },
    {
      id: 'notifications',
      label: '🔔 Notifications',
      description: 'View alerts and updates',
      action: () => {
        setMenuVisible(false);
        navigation.navigate('Notifications');
      },
    },
  ];

  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity activeOpacity={1} style={styles.menu}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>More Options</Text>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.menuItems}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.action}
                  >
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                      <Text style={styles.menuItemDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <Text style={styles.menuItemArrow}>›</Text>
                  </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  titleSection: {
    flex: 1,
  },

  title: {
    ...typography.h2,
    color: '#fff',
    fontWeight: '700',
  },

  subtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },

  menuButton: {
    padding: spacing.md,
    marginRight: -spacing.md,
  },

  menuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },

  menuContainer: {
    alignItems: 'flex-end',
    paddingRight: spacing.lg,
  },

  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 280,
    maxHeight: 400,
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
    backgroundColor: colors.surface,
  },

  menuTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },

  closeButton: {
    fontSize: 24,
    color: colors.textSecondary,
  },

  menuItems: {
    maxHeight: 300,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  menuItemContent: {
    flex: 1,
    marginRight: spacing.md,
  },

  menuItemLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },

  menuItemDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  menuItemArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
});
