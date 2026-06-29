const axios = require('axios');
require('dotenv').config();

class GrokService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
    
    console.log('=== GROK SERVICE INITIALIZED ===');
    console.log('API Key exists?', !!this.apiKey);
    console.log('API URL:', this.apiUrl);
    console.log('================================');
    
    if (!this.apiKey) {
      console.warn('WARNING: GROK_API_KEY not found in .env file');
      console.warn('WARNING: Using fallback keyword matching only');
    }
  }

  createPrompt(userInput) {
    return `
      You are an AI assistant that classifies customer support tickets.
      
      IMPORTANT: Respond with ONLY valid JSON, no other text.
      
      Categories:
      - Authentication: Login issues, password problems, account access
      - Billing: Payments, invoices, subscriptions, refunds
      - Technical: Bugs, errors, app crashes, performance issues
      - Feature Request: Suggestions for new features or improvements
      - General: Other questions or inquiries
      
      Priority levels:
      - Critical: System down, data loss, security issue
      - High: Affects many users, blocks important functionality
      - Medium: Affects individual user, has workaround
      - Low: Minor issues, feature suggestions
      
      Customer message: "${userInput}"
      
      Response format (JSON only):
      {"category": "Category Name", "priority": "Priority Level"}
    `;
  }

  async classifyTicket(userInput) {
    console.log(`Classifying: "${userInput}"`);

    if (!userInput || userInput.trim().length === 0) {
      console.log('Empty input, using fallback');
      return this.fallbackClassification('No input provided');
    }

    try {
      if (this.apiKey) {
        console.log('Calling Grok API...');
        console.log('API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
        
        const response = await axios.post(
          this.apiUrl,
          {
            model: 'grok-1',
            messages: [
              {
                role: 'system',
                content: 'You are a ticket classifier. Respond with JSON only.'
              },
              {
                role: 'user',
                content: this.createPrompt(userInput)
              }
            ],
            temperature: 0.3,
            max_tokens: 150
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Grok API Response Status:', response.status);
        
        const content = response.data.choices[0]?.message?.content;
        
        if (!content) {
          console.log('No response from Grok, using fallback');
          return this.fallbackClassification(userInput);
        }

        console.log('Received response from Grok');
        console.log('Response content:', content);
        return this.validateAndParseResponse(content, userInput);
      } else {
        console.log('No API key found, using fallback classification');
        return this.fallbackClassification(userInput);
      }
    } catch (error) {
      console.error('Error with Grok API:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
      console.log('Using fallback due to error');
      return this.fallbackClassification(userInput);
    }
  }

  validateAndParseResponse(content, originalInput) {
    try {
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/```json/g, '');
      cleanContent = cleanContent.replace(/```/g, '');
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);

      if (!parsed.category || !parsed.priority) {
        console.log('Missing fields in response, using fallback');
        return this.fallbackClassification(originalInput);
      }

      const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
      if (!validPriorities.includes(parsed.priority)) {
        console.log(`Invalid priority "${parsed.priority}", defaulting to Medium`);
        parsed.priority = 'Medium';
      }

      console.log(`Validated: Category="${parsed.category}", Priority="${parsed.priority}"`);
      return parsed;
    } catch (error) {
      console.log('JSON parsing failed, using fallback');
      return this.fallbackClassification(originalInput);
    }
  }

  fallbackClassification(userInput) {
    console.log('Using fallback classification (keyword matching)');
    
    const lowerInput = userInput.toLowerCase();
    
    let category = 'General';
    let matchedKeyword = false;
    
    if (lowerInput.includes('login') || lowerInput.includes('password') || 
        lowerInput.includes('account') || lowerInput.includes('access') ||
        lowerInput.includes('verify') || lowerInput.includes('authentication')) {
      category = 'Authentication';
      matchedKeyword = true;
    } else if (lowerInput.includes('pay') || lowerInput.includes('invoice') || 
               lowerInput.includes('subscription') || lowerInput.includes('credit') ||
               lowerInput.includes('card') || lowerInput.includes('bill')) {
      category = 'Billing';
      matchedKeyword = true;
    } else if (lowerInput.includes('bug') || lowerInput.includes('error') || 
               lowerInput.includes('crash') || lowerInput.includes('not working') ||
               lowerInput.includes('fail') || lowerInput.includes('issue')) {
      category = 'Technical';
      matchedKeyword = true;
    } else if (lowerInput.includes('feature') || lowerInput.includes('suggest') || 
               lowerInput.includes('improve') || lowerInput.includes('enhance') ||
               lowerInput.includes('wish')) {
      category = 'Feature Request';
      matchedKeyword = true;
    }

    let priority = 'Medium';
    
    if (lowerInput.includes('urgent') || lowerInput.includes('critical') || 
        lowerInput.includes('emergency') || lowerInput.includes('down') ||
        lowerInput.includes('broken') || lowerInput.includes('stop')) {
      priority = 'Critical';
    } else if (lowerInput.includes('important') || lowerInput.includes('serious') ||
               lowerInput.includes('major')) {
      priority = 'High';
    } else if (lowerInput.includes('minor') || lowerInput.includes('small') || 
               lowerInput.includes('suggestion') || lowerInput.includes('nice to have')) {
      priority = 'Low';
    }

    const result = { 
      category, 
      priority,
      usedFallback: true,
      matchedKeyword: matchedKeyword
    };
    
    console.log('Fallback result:', result);
    return result;
  }

  async test() {
    console.log('\nRUNNING TESTS');
    console.log('========================================');
    
    const testCases = [
      { input: 'I cannot login to my account, it says invalid password' },
      { input: 'I was charged twice for my subscription this month' },
      { input: 'The app crashes when I try to upload large files' },
      { input: 'It would be nice to have dark mode in the app' },
      { input: 'Hello, I have a question about your service' }
    ];

    for (const test of testCases) {
      console.log(`\nInput: "${test.input}"`);
      const result = await this.classifyTicket(test.input);
      console.log('Result:', result);
    }
  }
}

module.exports = GrokService;