import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import PrimaryButton from '../../components/PrimaryButton';

const FAQScreen = ({ navigation }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: '0',
      text: 'Hi! 👋 How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' or 'chat'

  const faqData = [
    {
      id: '1',
      question: 'How do I book a tractor?',
      answer:
        'To book a tractor, go to the "Rent Tractor" section, select your preferred tractor, choose your dates, and confirm the booking. You will receive a confirmation message once the tractor owner accepts.',
      category: 'Booking',
    },
    {
      id: '2',
      question: 'What payment methods are accepted?',
      answer:
        'We accept all major payment methods including credit cards, debit cards, digital wallets, and net banking. Payment is processed securely through our payment gateway.',
      category: 'Payment',
    },
    {
      id: '3',
      question: 'Can I cancel my booking?',
      answer:
        'Yes, you can cancel your booking up to 24 hours before the scheduled date for a full refund. Cancellations within 24 hours will attract a 10% cancellation fee.',
      category: 'Booking',
    },
    {
      id: '4',
      question: 'How do I sell my products?',
      answer:
        'To sell products, go to "My Products" and click "Add New Product". Fill in product details, set your price, and publish. Your products will be visible to customers immediately.',
      category: 'Selling',
    },
    {
      id: '5',
      question: 'What is the commission structure?',
      answer:
        'We charge a 5% commission on successful transactions. This includes product sales and tractor rental bookings. You will receive 95% of your total earnings.',
      category: 'Payment',
    },
    {
      id: '6',
      question: 'How do I track my orders?',
      answer:
        'You can track all your orders in the "My Bookings" section. Click on any order to view real-time updates, location, and estimated delivery/completion time.',
      category: 'Tracking',
    },
    {
      id: '7',
      question: 'Is my data secure?',
      answer:
        'Yes, we use industry-standard encryption (HTTPS/SSL) and secure authentication. Your personal and payment information is protected by advanced security measures.',
      category: 'Security',
    },
    {
      id: '8',
      question: 'What should I do if I have an issue with a tractor?',
      answer:
        'If you face any issues, contact the tractor owner directly through the app. You can also file a complaint to our support team under "Help & Support". We will assist within 24 hours.',
      category: 'Support',
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (userMessage.trim() === '') return;

    // Add user message
    const userMsg = {
      id: chatMessages.length.toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, userMsg]);
    setUserMessage('');

    // Simulate bot response (search FAQs for relevant answer)
    setTimeout(() => {
      let botResponse = '';
      const matchedFaq = faqData.find(
        (faq) =>
          faq.question.toLowerCase().includes(userMessage.toLowerCase()) ||
          faq.answer.toLowerCase().includes(userMessage.toLowerCase())
      );

      if (matchedFaq) {
        botResponse = `Found this for you:\n\n**Q:** ${matchedFaq.question}\n\n**A:** ${matchedFaq.answer}`;
      } else {
        botResponse =
          "I couldn't find an answer to that question. Please contact our support team or check the FAQ section for more information.";
      }

      const botMsg = {
        id: (chatMessages.length + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const renderFAQItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
    >
      <AppCard style={styles.faqCard}>
        <View style={styles.faqHeader}>
          <View style={styles.faqTitleContainer}>
            <Text style={[typography.body, styles.faqQuestion]}>
              {item.question}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <Icon
            name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.primary}
          />
        </View>

        {expandedId === item.id && (
          <View style={styles.faqAnswerContainer}>
            <View style={styles.divider} />
            <Text style={[typography.caption, styles.faqAnswer]}>
              {item.answer}
            </Text>
          </View>
        )}
      </AppCard>
    </TouchableOpacity>
  );

  const renderChatMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            typography.body,
            item.sender === 'user' ? styles.userMessageText : styles.botMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            typography.caption,
            item.sender === 'user' ? styles.userTimestamp : styles.botTimestamp,
          ]}
        >
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title]}>FAQ & Support</Text>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'faq' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('faq')}
        >
          <Icon
            name="help-circle"
            size={20}
            color={activeTab === 'faq' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              typography.label,
              activeTab === 'faq' ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            FAQs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'chat' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Icon
            name="chat-outline"
            size={20}
            color={activeTab === 'chat' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              typography.label,
              activeTab === 'chat' ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <View style={styles.contentContainer}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search FAQs..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* FAQ List */}
          {filteredFaqs.length > 0 ? (
            <FlatList
              data={filteredFaqs}
              renderItem={renderFAQItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
              contentContainerStyle={styles.faqList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="help-circle-outline" size={48} color={colors.textSecondary} />
              <Text style={[typography.label, styles.emptyStateText]}>
                No FAQs found matching your search
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <View style={styles.contentContainer}>
            {/* Chat Messages */}
            <FlatList
              data={chatMessages}
              renderItem={renderChatMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatContainer}
              scrollEnabled={true}
            />

            {/* Chat Input */}
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask a question..."
                placeholderTextColor={colors.textSecondary}
                value={userMessage}
                onChangeText={setUserMessage}
                multiline
                maxHeight={80}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={userMessage.trim() === ''}
              >
                <Icon
                  name="send"
                  size={20}
                  color={userMessage.trim() === '' ? colors.textSecondary : colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  activeTabText: {
    color: colors.primary,
  },
  inactiveTabText: {
    color: colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  faqList: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  faqCard: {
    padding: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  faqTitleContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  faqQuestion: {
    color: colors.text,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  faqAnswerContainer: {
    marginTop: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  faqAnswer: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyStateText: {
    color: colors.textSecondary,
  },
  chatContainer: {
    paddingVertical: spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: spacing.sm,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  botBubble: {
    backgroundColor: colors.lightGreen,
  },
  userMessageText: {
    color: colors.white,
  },
  botMessageText: {
    color: colors.text,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  botTimestamp: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    maxHeight: 80,
  },
  sendButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
});

export default FAQScreen;
