import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { sendMessage } from '../../services/chatboxService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import PageHeader from '../../components/PageHeader';

const ChatBoxScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your agricultural assistant. How can I help you today? Feel free to ask about farming, crops, pest control, irrigation, or anything related to agriculture.',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: userInput,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setLoading(true);
    setError(null);

    console.log('📨 User message:', currentInput);

    try {
      // Build conversation history for context (last 5 messages)
      const recentHistory = messages
        .slice(-5)
        .map(msg => ({
          role: msg.role,
          content: msg.text,
        }));

      console.log('📤 Sending to OpenAI with history:', recentHistory.length, 'messages');

      // Get response from chatbox API
      const response = await sendMessage(currentInput, recentHistory);

      console.log('📬 API Response received:', response);

      if (response.success) {
        console.log('✅ Success response:', response.message?.substring(0, 50));
        const assistantMessage = {
          id: Date.now().toString(),
          text: response.message,
          role: 'assistant',
          timestamp: response.timestamp,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error('❌ Error in response:', response.error);
        setError(response.error || 'Failed to get response');
        const errorMessage = {
          id: Date.now().toString(),
          text: `⚠️ ${response.error || 'Failed to get response. Please try again.'}`,
          role: 'assistant',
          timestamp: response.timestamp,
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('💥 Chat error:', err);
      setError('Network error. Please check your connection and try again.');
      const errorMessage = {
        id: Date.now().toString(),
        text: '⚠️ Sorry, I encountered a network error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
        item.isError && styles.errorBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText,
          item.isError && styles.errorText,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.messageTime,
          item.role === 'user' ? styles.userTime : styles.assistantTime,
        ]}
      >
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <PageHeader title="SmartHill Assistant" subtitle="Ask farming questions" />

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onEndReachedThreshold={0.2}
        />

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {error}</Text>
          </View>
        )}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about farming..."
            placeholderTextColor={colors.textTertiary}
            value={userInput}
            onChangeText={setUserInput}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (loading || !userInput.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={loading || !userInput.trim()}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.sendButtonText}>📤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    marginLeft: spacing.xs,
  },
  errorBubble: {
    backgroundColor: colors.error,
    alignSelf: 'flex-start',
  },
  messageText: {
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  userText: {
    color: colors.white,
    ...typography.body2,
  },
  assistantText: {
    color: colors.text,
    ...typography.body2,
  },
  errorText: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 11,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  assistantTime: {
    color: colors.textTertiary,
  },
  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    ...typography.body2,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 18,
  },
  errorBanner: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorBannerText: {
    color: colors.white,
    ...typography.caption,
  },
});

export default ChatBoxScreen;
