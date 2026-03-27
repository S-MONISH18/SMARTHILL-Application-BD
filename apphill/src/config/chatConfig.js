// ChatBox Configuration
// API Key for OpenRouter integration (GPT-2.5 Flash model)

// 🔑 HOW TO GET YOUR API KEY:
// 1. Go to: https://openrouter.ai/
// 2. Sign in to your OpenRouter account
// 3. Go to Keys section and create a new API key
// 4. Copy the key and paste it below
// 5. Save this file

const chatConfig = {
  // ✅ OpenRouter API key (sk-or-v1-... format)
  apiKey: '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', // Your OpenRouter key
  
  // OpenRouter API URL for chat completions
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  
  // Model configuration - Google Gemini 2.5 Flash
  model: 'google/gemini-2.5-flash',
  
  // Request settings
  temperature: 0.7,
  maxTokens: 500,
  timeoutMs: 30000, // 30 seconds
  
  // System prompt for agricultural assistant
  systemPrompt: `You are a helpful agricultural assistant for SmartHill farming app. 
You help farmers, customers, and tractor owners with farming advice, product information, tractor rentals, and general agricultural questions. 
Keep responses concise, practical, and actionable.
- Always provide specific recommendations
- Consider local farming conditions
- Suggest preventive measures
- Be supportive and encouraging
Format responses clearly with key points.`,
};

export default chatConfig;
