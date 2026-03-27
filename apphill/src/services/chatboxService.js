// Chatbox Service for OpenRouter API Integration (GPT-2.5 Flash)
// Uses configuration from chatConfig.js

import chatConfig from '../config/chatConfig';

const API_KEY = chatConfig.apiKey;
const API_URL = chatConfig.apiUrl;

if (!API_KEY || API_KEY.includes('your_api_key')) {
  console.warn(`
⚠️  ChatBox API Key Not Configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: src/config/chatConfig.js

1. Go to: https://openrouter.ai/
2. Sign in and go to Keys section
3. Create a new API key
4. Open: src/config/chatConfig.js
5. Replace apiKey value with your OpenRouter key
6. Save the file
7. App will auto-refresh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

/**
 * Send a message to the chatbox and get AI response
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<Object>} - API response with assistant's message
 */
export const sendMessage = async (message, conversationHistory = [], timeoutMs = chatConfig.timeoutMs) => {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  if (!API_KEY || API_KEY.includes('your_api_key')) {
    console.error('❌ API Key is missing or not configured');
    return {
      success: false,
      error: '🔑 ChatBox API Key Not Found!\n\nTo get started:\n1. Visit: https://openrouter.ai/\n2. Sign in and go to Keys section\n3. Create a new API key\n4. Edit: src/config/chatConfig.js\n5. Replace apiKey value with your OpenRouter key\n6. Save and refresh the app',
      timestamp: new Date(),
    };
  }

  try {
    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: chatConfig.systemPrompt,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    console.log('📤 Sending message to OpenRouter API...');

    // Create abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: chatConfig.model,
          messages: messages,
          temperature: chatConfig.temperature,
          max_tokens: chatConfig.maxTokens,
        }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
        console.error('❌ API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Response received:', data.choices?.[0]?.message?.content?.substring(0, 50));

      const assistantMessage = data.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error('No response content from OpenRouter API');
      }

      return {
        success: true,
        message: assistantMessage,
        role: 'assistant',
        timestamp: new Date(),
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ Request timeout - took longer than ' + timeoutMs + 'ms');
        throw new Error('Request timeout - API took too long to respond');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('❌ Chatbox API Error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to get response from chatbox',
      timestamp: new Date(),
    };
  }
};

/**
 * Get predefined farming advice based on topic
 * @param {string} topic - Topic such as 'pest-control', 'irrigation', 'fertilizer'
 * @returns {Promise<string>} - AI-generated advice
 */
export const getFarmingAdvice = async (topic) => {
  const topics = {
    'pest-control': 'What are the best organic pest control methods for crops?',
    'irrigation': 'How should I optimize irrigation for my farm?',
    'fertilizer': 'What fertilizer recommendations do you have for my soil?',
    'crop-rotation': 'Can you explain the benefits of crop rotation?',
    'weather': 'How do I prepare my farm for seasonal weather changes?',
  };

  const question = topics[topic] || `Tell me about ${topic} in farming`;
  return sendMessage(question, []);
};

export default {
  sendMessage,
  getFarmingAdvice,
};
