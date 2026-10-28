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
 * Get farming advice fallback responses
 */
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    'pest': 'For pest control, use organic methods like neem oil spray, introduce beneficial insects, or practice crop rotation. Remove affected plants promptly. Always follow integrated pest management (IPM) practices.',
    'water|irrigation': 'Proper irrigation is key! Water deeply but less frequently to encourage root growth. Best time is early morning. Check soil moisture before watering - the top 2 inches should be dry. Use drip irrigation for efficiency.',
    'soil': 'Healthy soil is foundation of farming! Test your soil pH and nutrients annually. Add compost to improve structure. Rotate crops yearly and use cover crops to maintain soil health.',
    'crop': 'For crop selection, consider: climate zone, soil type, water availability, and market demand. Rotate crops yearly to prevent disease and maintain soil nutrients.',
    'fertilizer|nutrient': 'Use balanced fertilization based on soil tests. Organic options: compost, animal manure, or green manure crops. Apply nitrogen in spring, phosphorus at planting, potassium throughout season.',
    'weather': 'Monitor local weather forecasts. Prepare for: frost with row covers, heavy rain with drainage, drought with mulch. Plant frost-sensitive crops after last frost date.',
    'hi|hello|hey': 'Hello! I am your agricultural assistant. Ask me about farming, crops, irrigation, pest control, or any agriculture-related questions!',
  };
  
  for (const [key, response] of Object.entries(responses)) {
    if (key.split('|').some(word => lowerMessage.includes(word))) {
      return response;
    }
  }
  
  return 'I can help with farming questions about crops, irrigation, pest control, soil management, fertilizers, and weather preparation. What would you like to know?';
};

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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://smarthill-farm.app',
        'X-Title': 'SmartHill Agricultural Assistant',
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
      console.error('❌ API Error Details:', {
        status: response.status,
        errorMessage,
        fullError: errorData,
      });
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('⚠️ Invalid API Key or Account Issue\n\nPlease check:\n1. API key is valid\n2. OpenRouter account is in good standing\n3. Key has not expired');
      } else if (response.status === 429) {
        throw new Error('Rate limited. Please wait a moment and try again.');
      }
      
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
  } catch (error) {
    console.error('❌ Chatbox API Error:', error.message);
    
    // Fallback: Use local responses when API fails
    console.log('📱 Using fallback response due to API error');
    const fallbackMessage = getFallbackResponse(message);
    
    return {
      success: true,
      message: fallbackMessage,
      role: 'assistant',
      timestamp: new Date(),
      isFallback: true,
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
